const express = require('express');
const openaiService = require('../services/openaiService');

const router = express.Router();

// Website analysis endpoint - now accessible at /api/analysis/analyze
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

    console.log(`🔍 Starting comprehensive analysis for: ${url}`);
    
    // Step 1: Get basic website analysis
    const websiteData = { url, content: '' };
    const analysis = await openaiService.analyzeWebsite(websiteData);
    
    console.log('✅ Analysis completed');

    // Step 2: Generate competitors
    const competitors = await openaiService.generateCompetitors(
      url, 
      analysis.businessType, 
      analysis.industry
    );
    
    console.log(`✅ Generated ${competitors.length} competitors`);

    // Step 3: Generate recommendations
    const recommendations = await openaiService.generateRecommendations(analysis, url);
    
    console.log(`✅ Generated ${recommendations.length} recommendations`);

    // Return comprehensive analysis
    const result = {
      analysis,
      competitors,
      recommendations,
      metadata: {
        analyzedAt: new Date().toISOString(),
        url: url,
        totalCompetitors: competitors.length,
        totalRecommendations: recommendations.length
      }
    };

    res.json(result);

  } catch (error) {
    console.error('Analysis endpoint error:', error);
    res.status(500).json({ 
      message: error.message || 'Analysis failed',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test endpoint for the analysis route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Analysis route is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
