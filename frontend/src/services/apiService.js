import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000, // UPDATED: Increased to 60 seconds for better URL handling
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // UPDATED: Enhanced request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data?.url) {
          console.log(`📍 Target URL: ${config.data.url}`);
        }
        return config;
      },
      (error) => {
        console.error('🚨 API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // UPDATED: Enhanced response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        if (response.data?.analysis?.urlInfo) {
          console.log(`🔄 URL Processing:`, response.data.analysis.urlInfo);
        }
        return response;
      },
      (error) => {
        console.error('🚨 API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // NEW: URL validation method
  async validateUrl(url) {
    try {
      console.log(`🔍 Validating URL: ${url}`);
      const response = await this.api.post('/analysis/validate', { url });
      console.log(`✅ URL validation result:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ URL validation failed for ${url}:`, error);
      throw this.handleError(error, 'URL validation failed');
    }
  }

  // UPDATED: Enhanced website analysis method
  async analyzeWebsite(url) {
    try {
      console.log(`🔍 Starting website analysis for: ${url}`);
      const response = await this.api.post('/analysis/analyze', { url });
      
      const result = response.data;
      console.log(`✅ Analysis completed for: ${result.analysis?.urlInfo?.normalized || url}`);
      
      // Log analysis summary
      if (result.analysis) {
        console.log(`📊 Analysis Summary:`, {
          score: result.analysis.geoScore,
          grade: result.analysis.grade,
          businessType: result.analysis.businessType,
          urlProcessed: result.analysis.urlInfo
        });
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Website analysis failed for ${url}:`, error);
      throw this.handleError(error, 'Website analysis failed');
    }
  }

  // UPDATED: Enhanced competitor analysis
  async getCompetitors(url, businessType) {
    try {
      console.log(`🏢 Getting competitors for: ${url} (${businessType})`);
      const response = await this.api.post('/analysis/competitors', { 
        url, 
        businessType 
      });
      
      const competitors = response.data.data || [];
      console.log(`✅ Found ${competitors.length} competitors`);
      return response.data;
    } catch (error) {
      console.error(`❌ Competitor analysis failed for ${url}:`, error);
      throw this.handleError(error, 'Competitor analysis failed');
    }
  }

  // UPDATED: Enhanced recommendations
  async getRecommendations(url, currentScore) {
    try {
      console.log(`💡 Getting recommendations for: ${url} (Score: ${currentScore})`);
      const response = await this.api.post('/analysis/recommendations', { 
        url, 
        currentScore 
      });
      
      const recommendations = response.data.recommendations || [];
      console.log(`✅ Generated ${recommendations.length} recommendations`);
      return response.data;
    } catch (error) {
      console.error(`❌ Recommendations failed for ${url}:`, error);
      throw this.handleError(error, 'Recommendations failed');
    }
  }

  // NEW: Test API connection
  async testConnection() {
    try {
      const response = await this.api.get('/analysis/test');
      console.log('✅ API connection test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      throw this.handleError(error, 'API connection test failed');
    }
  }

  // UPDATED: Enhanced error handling
  handleError(error, defaultMessage) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || defaultMessage;
      const details = error.response.data?.error;
      
      console.error(`🚨 Server Error (${error.response.status}):`, message);
      if (details) console.error('🔍 Error Details:', details);
      
      return new Error(message);
    } else if (error.request) {
      // Request made but no response received
      console.error('🚨 Network Error: No response received');
      return new Error('Network error - please check your connection and try again');
    } else {
      // Something else happened
      console.error('🚨 Unexpected Error:', error.message);
      return new Error(error.message || defaultMessage);
    }
  }
}

export default new ApiService();