const cron = require('node-cron');
const { isDriveConfigured, uploadBufferToDrive } = require('../services/googleDrive');
const Inquiry = require('../models/Inquiry');

function scheduleDriveBackups() {
  const enabled = String(process.env.BACKUP_ENABLE || 'false').toLowerCase() === 'true';
  if (!enabled) return;
  if (!isDriveConfigured()) {
    console.warn('BACKUP_ENABLE is true but Google Drive is not configured. Skipping schedules.');
    return;
  }
  const cronExpr = process.env.BACKUP_CRON || '0 3 * * *'; // default 3:00 AM daily
  console.log(`[Backups] Scheduling Drive backups with cron: ${cronExpr}`);

  cron.schedule(cronExpr, async () => {
    try {
      console.log('[Backups] Generating inquiries CSV...');
      const csvBuffer = await generateInquiriesCSV();
      const date = new Date().toISOString().split('T')[0];
      const filename = `inquiries_${date}.csv`;
      await uploadBufferToDrive({ buffer: csvBuffer, mimeType: 'text/csv', filename });
      console.log('[Backups] Inquiries CSV uploaded to Drive');
    } catch (err) {
      console.error('[Backups] Error during backup:', err);
    }
  });
}

async function generateInquiriesCSV() {
  const inquiries = await Inquiry.find({}).populate('respondedBy', 'username email').sort({ createdAt: -1 });
  const escapeCSV = (str) => {
    if (!str) return '';
    return `"${String(str).replace(/"/g, '""')}"`;
  };
  const header = ['ID','Name','Email','Phone','Company','Service','Status','Priority','Message','Response','Responded By','Responded At','Created At'];
  const rows = inquiries.map(i => [
    escapeCSV(i._id),
    escapeCSV(i.name),
    escapeCSV(i.email),
    escapeCSV(i.phone),
    escapeCSV(i.company),
    escapeCSV(i.service),
    escapeCSV(i.status),
    escapeCSV(i.priority),
    escapeCSV(i.message),
    escapeCSV(i.response),
    escapeCSV(i.respondedBy?.username),
    i.respondedAt ? new Date(i.respondedAt).toISOString() : '',
    new Date(i.createdAt).toISOString()
  ].join(','));
  const csv = [header.join(','), ...rows].join('\n');
  // Prepend BOM for Excel UTF-8 support
  const withBom = '\ufeff' + csv;
  return Buffer.from(withBom, 'utf8');
}

module.exports = { scheduleDriveBackups };
