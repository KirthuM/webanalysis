import { useState } from 'react';
import apiService from '../services/apiService';

export const useGeoAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const performAnalysis = async (websiteUrl) => {
    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Step 1: Analyze website (30%)
      setProgress(10);
      console.log('🔍 Starting website analysis...');
      const websiteAnalysis = await apiService.analyzeWebsite(websiteUrl);
      setAnalysis(websiteAnalysis);
      setProgress(30);

      // Step 2: Find competitors (60%)
      console.log('🏢 Finding competitors...');
      const competitorData = await apiService.getCompetitors(
        websiteUrl, 
        websiteAnalysis.businessType
      );
      setCompetitors(competitorData);
      setProgress(60);

      // Step 3: Get recommendations (100%)
      console.log('💡 Generating recommendations...');
      const technicalRecs = await apiService.getTechnicalRecommendations(
        websiteUrl, 
        websiteAnalysis.geoScore
      );
      setRecommendations(technicalRecs);
      setProgress(100);

      console.log('✅ Analysis complete!');

    } catch (err) {
      setError(err.message);
      console.error('❌ Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setCompetitors([]);
    setRecommendations([]);
    setError(null);
    setProgress(0);
  };

  return {
    analysis,
    competitors,
    recommendations,
    isAnalyzing,
    error,
    progress,
    performAnalysis,
    resetAnalysis
  };
};