const express = require('express');
const router = express.Router();

router.post('/download', async (req, res) => {
  try {
    console.log('Download request received:', req.body);
    
    const { data, format = 'json' } = req.body;
    
    if (!data) {
      return res.status(400).json({ message: 'Report data is required' });
    }

    const filename = `analysis-report-${Date.now()}`;
    
    // Simple JSON and CSV generation for now
    switch (format) {
      case 'json':
        const jsonReport = JSON.stringify({
          ...data,
          generatedAt: new Date().toISOString(),
          reportVersion: '1.0'
        }, null, 2);
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
        res.send(jsonReport);
        break;
        
      case 'csv':
        let csvContent = 'Website Analysis Report\n';
        csvContent += `Website,${data.website}\n`;
        csvContent += `Generated At,${new Date().toISOString()}\n\n`;
        
        if (data.analysis) {
          csvContent += `Overall Score,${data.analysis.geoScore || 'N/A'}\n`;
          csvContent += `Grade,${data.analysis.grade || 'N/A'}\n\n`;
          
          if (data.analysis.metrics && data.analysis.metrics.length > 0) {
            csvContent += 'Metrics\n';
            csvContent += 'Name,Score,Description\n';
            data.analysis.metrics.forEach(metric => {
              csvContent += `"${metric.name || ''}",${metric.score || 0},"${metric.description || ''}"\n`;
            });
            csvContent += '\n';
          }
        }
        
        if (data.competitors && data.competitors.length > 0) {
          csvContent += 'Competitors\n';
          csvContent += 'Name,Website,Score,Category\n';
          data.competitors.forEach(competitor => {
            csvContent += `"${competitor.name || ''}","${competitor.website || ''}",${competitor.geoScore || 0},"${competitor.category || ''}"\n`;
          });
        }
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
        res.send(csvContent);
        break;
        
      case 'pdf':
      case 'excel':
      case 'html':
        // For now, return a message that these formats are not yet implemented
        return res.status(501).json({ 
          message: `${format.toUpperCase()} format is not yet implemented. Please use JSON or CSV for now.` 
        });
        
      default:
        return res.status(400).json({ message: `Unsupported format: ${format}` });
    }
    
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      message: 'Report generation failed',
      error: error.message 
    });
  }
});

module.exports = router;
