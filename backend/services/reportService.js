import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ReportService {
  async downloadReport(reportData, format) {
    try {
      console.log('Downloading report:', { format, dataKeys: Object.keys(reportData) });
      
      const response = await axios.post(
        `${API_BASE_URL}/reports/download`,
        { data: reportData, format },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const filename = this.getFilename(format);
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Download error:', error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        console.error('Server error:', error.response.status, error.response.data);
        return { 
          success: false, 
          error: `Server error: ${error.response.status}. ${error.response.data?.message || 'Unknown error'}` 
        };
      } else if (error.request) {
        // Network error
        return { 
          success: false, 
          error: 'Network error. Please check your connection and try again.' 
        };
      } else {
        // Other error
        return { 
          success: false, 
          error: error.message || 'An unexpected error occurred' 
        };
      }
    }
  }

  getFilename(format) {
    const timestamp = Date.now();
    const extensions = {
      json: 'json',
      csv: 'csv',
      pdf: 'pdf',
      excel: 'xlsx',
      html: 'html'
    };
    return `analysis-report-${timestamp}.${extensions[format] || 'txt'}`;
  }

  async generateFullReport(websiteUrl, analysis, competitors, recommendations) {
    return {
      website: websiteUrl,
      analysis: analysis || {},
      competitors: competitors || [],
      recommendations: recommendations || [],
      summary: {
        totalCompetitors: (competitors || []).length,
        totalRecommendations: (recommendations || []).length,
        averageCompetitorScore: (competitors || []).length > 0 
          ? (competitors || []).reduce((sum, comp) => sum + (comp.geoScore || 0), 0) / competitors.length 
          : 0
      }
    };
  }
}

export default new ReportService();
