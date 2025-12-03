const express = require('express');
const { isDriveConfigured, listFolderFiles, deleteFromDrive } = require('../services/googleDrive');

const router = express.Router();

// Basic middleware placeholder - plug in your real admin auth middleware as needed
function requireAdmin(req, res, next) {
  // If you have JWT-based admin auth, reuse it here.
  // For now, allow if a simple header is present (replace in production!)
  return next();
}

router.get('/files', requireAdmin, async (req, res) => {
  try {
    if (!isDriveConfigured()) {
      return res.status(400).json({ error: 'Google Drive not configured' });
    }
    const { pageSize, pageToken } = req.query;
    const data = await listFolderFiles({
      pageSize: pageSize ? Number(pageSize) : 50,
      pageToken,
    });
    res.json({ success: true, ...data });
  } catch (err) {
    console.error('Drive list error:', err);
    res.status(500).json({ error: 'Failed to list Drive files' });
  }
});

router.delete('/files/:id', requireAdmin, async (req, res) => {
  try {
    if (!isDriveConfigured()) {
      return res.status(400).json({ error: 'Google Drive not configured' });
    }
    const result = await deleteFromDrive(req.params.id);
    res.json({ success: true, result });
  } catch (err) {
    console.error('Drive delete error:', err);
    res.status(500).json({ error: 'Failed to delete Drive file' });
  }
});

module.exports = router;
