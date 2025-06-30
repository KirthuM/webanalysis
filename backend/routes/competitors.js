const express = require('express');
const openaiService = require('../services/openaiService');

const router = express.Router();

// Debug logging
console.log('Loading competitors route...');

// Competitor analysis endpoint
router.post('/competitors', async (req, res) => {
  try {
    console.log('🏢 Competitors endpoint hit:', req.body);
    
    const { url, businessType } = req.body;

    if (!url || !businessType) {
      return res.status(400).json({ 
        message: 'URL and businessType are required' 
      });
    }

    console.log(`🏢 Finding competitors for: ${url} (${businessType})`);
    
    const competitors = await openaiService.findCompetitors(url, businessType);
    
    res.json({
      success: true,
      data: competitors.competitors || [],
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Competitors endpoint error:', error);
    res.status(500).json({ 
      message: error.message || 'Competitor analysis failed',
      success: false 
    });
  }
});

console.log('Competitors route loaded successfully');

module.exports = router;
