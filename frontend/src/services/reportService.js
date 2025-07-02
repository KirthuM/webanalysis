import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ReportService {
  async downloadReport(reportData, format) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reports/download`,
        { data: reportData, format },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json'
          }
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
      return { success: false, error: error.message };
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
      analysis,
      competitors,
      recommendations,
      summary: {
        totalCompetitors: competitors.length,
        totalRecommendations: recommendations.length,
        averageCompetitorScore: competitors.reduce((sum, comp) => sum + comp.geoScore, 0) / competitors.length || 0
      }
    };
  }
}

export default new ReportService();
