import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useGeoAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const performAnalysis = async (url) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      setProgress(0);
      
      // Clear previous results
      setAnalysis(null);
      setCompetitors([]);
      setRecommendations([]);

      console.log('Starting analysis for:', url);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full URL:', `${API_BASE_URL}/analysis/analyze`);
      
      // Test if backend is reachable first
      try {
        console.log('Testing backend connection...');
        const healthCheck = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, { timeout: 5000 });
        console.log('Backend health check:', healthCheck.data);
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        throw new Error('Backend server is not reachable. Please make sure the server is running on port 5000.');
      }
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);

      console.log('Sending analysis request...');
      const response = await axios.post(`${API_BASE_URL}/analysis/analyze`, {
        url: url
      }, {
        timeout: 120000, // 2 minutes timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      console.log('Analysis response received:', response.data);

      const { analysis: analysisData, competitors: competitorsData, recommendations: recommendationsData } = response.data;

      // Set the analysis results
      setAnalysis(analysisData);
      setCompetitors(competitorsData || []);
      setRecommendations(recommendationsData || []);

      console.log('Analysis data set successfully');
      console.log('- Analysis:', analysisData);
      console.log('- Competitors count:', competitorsData?.length || 0);
      console.log('- Recommendations count:', recommendationsData?.length || 0);

    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      
      let errorMessage = 'Analysis failed. Please try again.';
      
      if (err.response) {
        // Server responded with error
        console.log('Server error status:', err.response.status);
        console.log('Server error data:', err.response.data);
        errorMessage = `Server error (${err.response.status}): ${err.response.data?.message || 'Unknown server error'}`;
      } else if (err.request) {
        // Network error
        console.log('Network error - no response received');
        errorMessage = 'Network error: Cannot connect to server. Please check if the backend server is running on http://localhost:5000';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout: The analysis is taking too long. Please try again.';
      } else {
        errorMessage = `Request error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return {
    analysis,
    competitors,
    recommendations,
    isAnalyzing,
    error,
    progress,
    performAnalysis
  };
};
