const { google } = require('googleapis');
const { Readable } = require('stream');

function isDriveConfigured() {
  return (
    process.env.GDRIVE_CLIENT_EMAIL &&
    process.env.GDRIVE_PRIVATE_KEY &&
    process.env.GDRIVE_FOLDER_ID
  );
}

function getDriveClient() {
  const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
  let privateKey = process.env.GDRIVE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive service account is not configured');
  }
  // Support escaped newlines in env var
  privateKey = privateKey.replace(/\\n/g, '\n');

  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
  ];

  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
    subject: process.env.GDRIVE_IMPERSONATE_USER || undefined,
  });

  const drive = google.drive({ version: 'v3', auth: jwt });
  return drive;
}

async function ensurePublicPermission(drive, fileId) {
  const makePublic = String(process.env.GDRIVE_PUBLIC || 'true').toLowerCase() === 'true';
  if (!makePublic) return;
  try {
    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });
  } catch (e) {
    // Ignore if already public
  }
}

async function uploadBufferToDrive({ buffer, mimeType, filename }) {
  const drive = getDriveClient();
  const folderId = process.env.GDRIVE_FOLDER_ID;
  const supportsAllDrives = Boolean(process.env.GDRIVE_SHARED_DRIVE_ID);

  const media = {
    mimeType,
    body: Readable.from(buffer),
  };

  const requestBody = {
    name: filename,
    parents: [folderId],
  };

  const { data } = await drive.files.create({
    requestBody,
    media,
    fields: 'id, name, mimeType, webViewLink, webContentLink',
    supportsAllDrives,
  });

  await ensurePublicPermission(drive, data.id);

  // Fetch links (after permission) to ensure availability
  const { data: meta } = await drive.files.get({
    fileId: data.id,
    fields: 'id, webViewLink, webContentLink',
    supportsAllDrives,
  });

  return {
    id: data.id,
    name: data.name,
    mimeType: data.mimeType,
    webViewLink: meta.webViewLink,
    webContentLink: meta.webContentLink,
  };
}

async function deleteFromDrive(fileId) {
  const drive = getDriveClient();
  await drive.files.delete({ fileId, supportsAllDrives: true });
  return { success: true };
}

module.exports = {
  isDriveConfigured,
  uploadBufferToDrive,
  deleteFromDrive,
  listFolderFiles,
};

async function listFolderFiles({ pageSize = 50, pageToken } = {}) {
  const drive = getDriveClient();
  const folderId = process.env.GDRIVE_FOLDER_ID;
  const supportsAllDrives = Boolean(process.env.GDRIVE_SHARED_DRIVE_ID);
  const q = `'${folderId}' in parents and trashed = false`;
  const { data } = await drive.files.list({
    q,
    corpora: supportsAllDrives ? 'drive' : 'user',
    driveId: process.env.GDRIVE_SHARED_DRIVE_ID || undefined,
    includeItemsFromAllDrives: supportsAllDrives,
    supportsAllDrives,
    fields: 'nextPageToken, files(id,name,mimeType,webViewLink,webContentLink,createdTime,modifiedTime,size)',
    pageSize,
    pageToken,
    orderBy: 'modifiedTime desc',
  });
  return data;
}
