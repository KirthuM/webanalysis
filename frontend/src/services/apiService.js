import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 60000, // Increased timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        console.log('📍 Full URL:', `${config.baseURL}${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ API Error Details:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
        
        // Better error messages
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          throw new Error('Backend server is not running. Please start with: npm run dev');
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Test connection
  async testConnection() {
    try {
      const response = await this.api.get('/test');
      console.log('✅ API Connection Test:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Connection Failed:', error.message);
      throw error;
    }
  }

  async analyzeWebsite(websiteUrl) {
    try {
      console.log('🔍 Analyzing website:', websiteUrl);
      const response = await this.api.post('/analyze', {
        url: websiteUrl,
      });
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Analysis failed');
    }
  }

  async getCompetitors(websiteUrl, businessType) {
    try {
      console.log('🏢 Finding competitors for:', websiteUrl, businessType);
      const response = await this.api.post('/competitors', {
        url: websiteUrl,
        businessType,
      });
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Competitor analysis failed');
    }
  }

  async getTechnicalRecommendations(websiteUrl, currentScore) {
    try {
      console.log('💡 Generating recommendations for:', websiteUrl);
      const response = await this.api.post('/recommendations', {
        url: websiteUrl,
        currentScore,
      });
      return response.data.data || response.data; // Handle both formats
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Recommendations failed');
    }
  }
}

export default new ApiService();