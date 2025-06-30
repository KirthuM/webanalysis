const express = require('express');
const openaiService = require('../services/openaiService');

const router = express.Router();

// Website analysis endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    console.log(`🔍 Starting analysis for: ${url}`);
    
    const analysis = await openaiService.analyzeWebsite(url);
    
    res.json({
      success: true,
      data: analysis,
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis endpoint error:', error);
    res.status(500).json({ 
      message: error.message || 'Analysis failed',
      success: false 
    });
  }
});

module.exports = router;