const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeWebsite(url) {
    try {
      console.log(`🤖 Analyzing website: ${url}`);
      
      const prompt = `Analyze the website: ${url}

Please provide a comprehensive analysis in JSON format with exactly this structure:
{
  "businessType": "string - type of business (e.g., E-commerce, SaaS, Blog, etc.)",
  "industry": "string - specific industry",
  "geoScore": 75,
  "grade": "B+",
  "metrics": [
    {
      "name": "Content Quality",
      "score": 78,
      "description": "brief description"
    },
    {
      "name": "Technical SEO", 
      "score": 72,
      "description": "brief description"
    },
    {
      "name": "User Experience",
      "score": 80,
      "description": "brief description"
    },
    {
      "name": "Authority Score",
      "score": 70,
      "description": "brief description"
    }
  ],
  "strengths": ["Modern design", "Fast loading", "Mobile responsive"],
  "weaknesses": ["Missing meta descriptions", "Limited content"],
  "description": "brief business description"
}

Base your analysis on what you know about the domain and typical characteristics of such websites.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });

      return this.parseResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      
      // Return mock data if OpenAI fails
      return {
        businessType: "Technology",
        industry: "Software Development",
        geoScore: 75,
        grade: "B+",
        metrics: [
          { name: "Content Quality", score: 78, description: "Good content structure and readability" },
          { name: "Technical SEO", score: 72, description: "Basic SEO implementation present" },
          { name: "User Experience", score: 80, description: "Responsive design and good navigation" },
          { name: "Authority Score", score: 70, description: "Moderate domain authority" }
        ],
        strengths: ["Modern design", "Fast loading", "Mobile responsive"],
        weaknesses: ["Missing meta descriptions", "Limited content"],
        description: "Technology-focused website with modern design"
      };
    }
  }

  async findCompetitors(url, businessType) {
    try {
      console.log(`🏢 Finding competitors for: ${url} (${businessType})`);
      
      const prompt = `Based on the website ${url} which is a ${businessType} business, find 6-8 direct competitors.

Provide response in JSON format:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "https://example.com",
      "geoScore": 85,
      "category": "specific category/niche",
      "strengths": ["key advantage 1", "key advantage 2"],
      "marketPosition": "Leader"
    }
  ]
}

Focus on real, well-known competitors in the same industry.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 2000,
      });

      return this.parseResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI Competitor Error:', error);
      
      // Return mock competitors
      return {
        competitors: [
          {
            name: "GitHub",
            website: "https://github.com",
            geoScore: 95,
            category: "Code Repository",
            strengths: ["Industry leader", "Large user base"],
            marketPosition: "Leader"
          },
          {
            name: "GitLab",
            website: "https://gitlab.com",
            geoScore: 88,
            category: "DevOps Platform",
            strengths: ["Integrated CI/CD", "Self-hosted options"],
            marketPosition: "Challenger"
          }
        ]
      };
    }
  }

  async getTechnicalRecommendations(url, currentScore) {
    try {
      console.log(`💡 Generating recommendations for: ${url}`);
      
      const prompt = `Analyze ${url} (current GEO score: ${currentScore}) and provide specific technical SEO improvements.

Provide response in JSON format:
{
  "recommendations": [
    {
      "title": "Improve Page Loading Speed",
      "priority": "High",
      "category": "Performance",
      "description": "Optimize images and minify CSS/JS files",
      "implementation": ["Compress images", "Minify CSS files", "Enable GZIP compression"],
      "expectedImpact": 8,
      "timeEstimate": "2-3 days",
      "difficulty": "Medium"
    }
  ],
  "priorityActions": ["Optimize loading speed", "Improve meta descriptions", "Add structured data"],
  "estimatedScoreIncrease": 15
}

Focus on actionable, specific improvements.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      });

      return this.parseResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI Recommendations Error:', error);
      
      // Return mock recommendations
      return {
        recommendations: [
          {
            title: "Improve Page Loading Speed",
            priority: "High",
            category: "Performance",
            description: "Optimize images and minify CSS/JS files to improve loading times",
            implementation: ["Compress images", "Minify CSS files", "Enable GZIP compression"],
            expectedImpact: 8,
            timeEstimate: "2-3 days",
            difficulty: "Medium"
          },
          {
            title: "Add Meta Descriptions",
            priority: "Medium",
            category: "Technical",
            description: "Write compelling meta descriptions for all pages",
            implementation: ["Audit existing pages", "Write unique descriptions", "Implement in HTML"],
            expectedImpact: 6,
            timeEstimate: "1-2 days",
            difficulty: "Easy"
          }
        ],
        priorityActions: ["Optimize loading speed", "Improve meta descriptions", "Add structured data"],
        estimatedScoreIncrease: 15
      };
    }
  }

  parseResponse(content) {
    try {
      // Remove any markdown formatting
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.log('Raw content:', content);
      throw new Error('Failed to parse AI response');
    }
  }
}

module.exports = new OpenAIService();
