const express = require('express');
const openaiService = require('../services/openaiService');

const router = express.Router();

// Recommendations endpoint
router.post('/recommendations', async (req, res) => {
  try {
    const { url, currentScore } = req.body;

    if (!url || currentScore === undefined) {
      return res.status(400).json({ 
        message: 'URL and currentScore are required' 
      });
    }

    console.log(`💡 Generating recommendations for: ${url}`);
    
    const recommendations = await openaiService.getTechnicalRecommendations(url, currentScore);
    
    res.json({
      success: true,
      data: recommendations,
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Recommendations endpoint error:', error);
    res.status(500).json({ 
      message: error.message || 'Recommendations generation failed',
      success: false 
    });
  }
});

module.exports = router;