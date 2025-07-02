const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  async analyzeWebsite(websiteData) {
    try {
      console.log('🤖 Analyzing website with OpenAI:', websiteData.url);
      
      const analysisPrompt = `
        Analyze this website comprehensively: ${websiteData.url}
        
        Please provide a detailed analysis in the following JSON format:
        {
          "geoScore": number (0-100),
          "grade": "A+, A, B+, B, C+, C, D+, D, F",
          "businessType": "specific business category",
          "industry": "specific industry",
          "metrics": [
            {
              "name": "Content Quality",
              "score": number (0-100),
              "description": "detailed assessment"
            },
            {
              "name": "Technical SEO",
              "score": number (0-100),
              "description": "detailed assessment"
            },
            {
              "name": "User Experience",
              "score": number (0-100),
              "description": "detailed assessment"
            },
            {
              "name": "Authority Score",
              "score": number (0-100),
              "description": "detailed assessment"
            },
            {
              "name": "Mobile Optimization",
              "score": number (0-100),
              "description": "detailed assessment"
            },
            {
              "name": "Page Speed",
              "score": number (0-100),
              "description": "detailed assessment"
            }
          ],
          "strengths": ["list of 3-5 key strengths"],
          "weaknesses": ["list of 3-5 areas for improvement"],
          "summary": "2-3 sentence overall summary"
        }
        
        Provide realistic scores based on typical website performance.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional website analyzer. Provide detailed, accurate analysis in valid JSON format only."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const analysisText = response.choices[0].message.content.trim();
      console.log('🤖 OpenAI Analysis Response received');
      
      let analysis;
      try {
        // Clean up the response to extract JSON
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
        analysis = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        analysis = this.getFallbackAnalysis(websiteData.url);
      }

      return analysis;
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      return this.getFallbackAnalysis(websiteData.url);
    }
  }

  async generateCompetitors(websiteUrl, businessType, industry) {
    try {
      console.log('🤖 Generating competitors for:', websiteUrl);
      
      const competitorPrompt = `
        Find 6-8 real competitors for this website: ${websiteUrl}
        Business Type: ${businessType}
        Industry: ${industry}
        
        Provide a JSON array of competitors:
        [
          {
            "name": "Company Name",
            "website": "https://website.com",
            "geoScore": number (60-95),
            "category": "specific category",
            "marketPosition": "Leader/Challenger/Follower/Niche",
            "strengths": ["strength 1", "strength 2", "strength 3"],
            "description": "brief company description"
          }
        ]
        
        Include direct and indirect competitors. Ensure all websites are real.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a competitive analysis expert. Provide only valid JSON array of real competitors."
          },
          {
            role: "user",
            content: competitorPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      const competitorsText = response.choices[0].message.content.trim();
      console.log('🤖 OpenAI Competitors Response received');
      
      let competitors;
      try {
        const jsonMatch = competitorsText.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : competitorsText;
        competitors = JSON.parse(jsonString);
        if (!Array.isArray(competitors)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Competitors JSON Parse Error:', parseError);
        competitors = this.getFallbackCompetitors(businessType, industry);
      }

      return competitors;
    } catch (error) {
      console.error('OpenAI Competitors Error:', error);
      return this.getFallbackCompetitors(businessType, industry);
    }
  }

  async generateRecommendations(analysis, websiteUrl) {
    try {
      console.log('🤖 Generating recommendations for:', websiteUrl);
      
      const recommendationsPrompt = `
        Based on this website analysis, generate 8-12 specific technical recommendations:
        
        Website: ${websiteUrl}
        Overall Score: ${analysis.geoScore}
        
        Weaknesses: ${analysis.weaknesses.join(', ')}
        
        Provide recommendations in JSON format:
        [
          {
            "title": "Specific actionable recommendation",
            "priority": "High/Medium/Low",
            "category": "SEO/Performance/Content/UX/Technical/Security",
            "description": "Detailed explanation",
            "expectedImpact": number (1-10),
            "timeEstimate": "1-2 hours/1-2 days/1-2 weeks/1+ month",
            "difficulty": "Easy/Medium/Hard",
            "implementation": [
              "Step 1: specific action",
              "Step 2: specific action"
            ]
          }
        ]
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a technical SEO expert. Provide only valid JSON array of recommendations."
          },
          {
            role: "user",
            content: recommendationsPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      });

      const recommendationsText = response.choices[0].message.content.trim();
      console.log('🤖 OpenAI Recommendations Response received');
      
      let recommendations;
      try {
        const jsonMatch = recommendationsText.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : recommendationsText;
        recommendations = JSON.parse(jsonString);
        if (!Array.isArray(recommendations)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.error('Recommendations JSON Parse Error:', parseError);
        recommendations = this.getFallbackRecommendations(analysis);
      }

      return recommendations;
    } catch (error) {
      console.error('OpenAI Recommendations Error:', error);
      return this.getFallbackRecommendations(analysis);
    }
  }

  getFallbackAnalysis(url) {
    return {
      geoScore: 75,
      grade: "B+",
      businessType: "Technology",
      industry: "Software Development",
      metrics: [
        {
          name: "Content Quality",
          score: 78,
          description: "Good content structure and readability"
        },
        {
          name: "Technical SEO",
          score: 72,
          description: "Basic SEO implementation present"
        },
        {
          name: "User Experience",
          score: 80,
          description: "Responsive design and good navigation"
        },
        {
          name: "Authority Score",
          score: 70,
          description: "Moderate domain authority"
        },
        {
          name: "Mobile Optimization",
          score: 85,
          description: "Good mobile responsiveness"
        },
        {
          name: "Page Speed",
          score: 65,
          description: "Room for improvement in loading times"
        }
      ],
      strengths: [
        "Clean, professional design",
        "Good mobile responsiveness",
        "Clear navigation structure",
        "Decent content organization"
      ],
      weaknesses: [
        "Page loading speed needs optimization",
        "SEO meta tags could be improved",
        "Missing structured data markup",
        "Limited content depth in some sections"
      ],
      summary: "A solid website with good fundamentals but opportunities for technical improvements and SEO optimization."
    };
  }

  getFallbackCompetitors(businessType, industry) {
    return [
      {
        name: "GitHub",
        website: "https://github.com",
        geoScore: 95,
        category: "Code Repository",
        marketPosition: "Leader",
        strengths: ["Industry leader", "Large user base", "Comprehensive features"],
        description: "Leading platform for version control and collaboration"
      },
      {
        name: "GitLab",
        website: "https://gitlab.com",
        geoScore: 88,
        category: "DevOps Platform",
        marketPosition: "Challenger",
        strengths: ["Integrated CI/CD", "Self-hosted options", "Complete DevOps solution"],
        description: "Comprehensive DevOps platform with integrated tools"
      },
      {
        name: "Bitbucket",
        website: "https://bitbucket.org",
        geoScore: 82,
        category: "Code Repository",
        marketPosition: "Challenger",
        strengths: ["Atlassian integration", "Free private repos", "Good team collaboration"],
        description: "Git repository management solution with team collaboration features"
      },
      {
        name: "Azure DevOps",
        website: "https://azure.microsoft.com/en-us/services/devops/",
        geoScore: 90,
        category: "DevOps Suite",
        marketPosition: "Leader",
        strengths: ["Microsoft ecosystem", "Enterprise features", "Comprehensive toolset"],
        description: "Microsoft's comprehensive DevOps solution"
      }
    ];
  }

  getFallbackRecommendations(analysis) {
    return [
      {
        title: "Optimize Page Loading Speed",
        priority: "High",
        category: "Performance",
        description: "Current page loading times are slower than optimal, affecting user experience and SEO rankings.",
        expectedImpact: 8,
        timeEstimate: "1-2 weeks",
        difficulty: "Medium",
        implementation: [
          "Analyze current page load times using Google PageSpeed Insights",
          "Compress and optimize images using modern formats",
          "Implement lazy loading for images and videos",
          "Minify CSS, JavaScript, and HTML files"
        ]
      },
      {
        title: "Improve SEO Meta Tags",
        priority: "High",
        category: "SEO",
        description: "Meta tags and structured data are incomplete, missing opportunities for better search engine visibility.",
        expectedImpact: 7,
        timeEstimate: "1-2 days",
        difficulty: "Easy",
        implementation: [
          "Add unique, descriptive title tags for each page",
          "Create compelling meta descriptions",
          "Implement Open Graph tags for social media sharing",
          "Add structured data markup"
        ]
      },
      {
        title: "Enhance Mobile Experience",
        priority: "Medium",
        category: "UX",
        description: "While mobile-responsive, there are opportunities to improve the mobile user experience.",
        expectedImpact: 6,
        timeEstimate: "1 week",
        difficulty: "Medium",
        implementation: [
          "Increase touch target sizes to at least 44x44 pixels",
          "Optimize mobile navigation menu",
          "Test and improve form input experience on mobile",
          "Implement swipe gestures where appropriate"
        ]
      }
    ];
  }
}

module.exports = new OpenAIService();
