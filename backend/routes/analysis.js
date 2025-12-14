const express = require('express');
const openaiService = require('../services/openaiService');
const URLUtils = require('../utils/URLUtils'); // NEW: Import URL utility

const router = express.Router();

// Website analysis endpoint - now accessible at /api/analysis/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // NEW CODE START: Validate and normalize URL
    console.log(`🔍 Original URL received: ${url}`);
    
    const urlValidation = await URLUtils.validateUrl(url);
    
    if (!urlValidation.isValid) {
      return res.status(400).json({ 
        message: 'Invalid URL format', 
        error: urlValidation.error,
        providedUrl: url
      });
    }

    const normalizedUrl = urlValidation.normalizedUrl;
    console.log(`✅ URL normalized from "${url}" to "${normalizedUrl}"`);

    // Check if URL is internal/private
    const isInternal = URLUtils.isLikelyInternalUrl(normalizedUrl);
    if (isInternal) {
      console.log(`⚠️ Detected internal/private URL: ${normalizedUrl}`);
    }
    // NEW CODE END

    console.log(`🔍 Starting comprehensive analysis for: ${normalizedUrl}`);
    
    // UPDATED: Use normalizedUrl instead of original url
    const websiteData = { 
      url: normalizedUrl, 
      originalUrl: url, // Keep track of original
      content: '',
      isInternal,
      domainInfo: URLUtils.extractDomainInfo(normalizedUrl)
    };
    
    const analysis = await openaiService.analyzeWebsite(websiteData);
    
    console.log('✅ Analysis completed');

    // UPDATED: Generate competitors with normalized URL
    let competitors = [];
    if (!isInternal && analysis.businessType) {
      try {
        competitors = await openaiService.generateCompetitors(
          normalizedUrl, 
          analysis.businessType, 
          analysis.industry
        );
        console.log(`✅ Generated ${competitors.length} competitors`);
      } catch (error) {
        console.error('Competitor generation failed:', error);
        competitors = [];
      }
    } else {
      console.log('⚠️ Skipping competitor analysis for internal/private URL');
    }

    // UPDATED: Generate recommendations with analysis data
    let recommendations = [];
    try {
      recommendations = await openaiService.getTechnicalRecommendations(
        normalizedUrl, 
        analysis.geoScore || 50
      );
      console.log(`✅ Generated ${recommendations.length} recommendations`);
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      recommendations = [];
    }

    // UPDATED: Return comprehensive analysis with URL info
    const result = {
      analysis: {
        ...analysis,
        urlInfo: { // NEW: Add URL information
          original: url,
          normalized: normalizedUrl,
          isInternal,
          domainInfo: websiteData.domainInfo
        }
      },
      competitors,
      recommendations,
      metadata: { // NEW: Add metadata
        analyzedAt: new Date().toISOString(),
        url: normalizedUrl,
        originalUrl: url,
        totalCompetitors: competitors.length,
        totalRecommendations: recommendations.length,
        isInternalSite: isInternal
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

// NEW: URL validation endpoint
router.post('/validate', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const validation = await URLUtils.validateUrl(url);
    res.json(validation);
  } catch (error) {
    res.status(500).json({ 
      message: 'URL validation failed', 
      error: error.message 
    });
  }
});

// NEW: Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Analysis route is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
