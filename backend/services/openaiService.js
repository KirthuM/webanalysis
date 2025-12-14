

const OpenAI = require('openai');
const puppeteer = require('puppeteer');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {

  // NEW: Website crawling function
  async crawlWebsite(url) {
    let browser;
    try {
      console.log('🕷️ Crawling website:', url);
      
      browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Set user agent and viewport
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setViewport({ width: 1366, height: 768 });
      
      // Navigate to the page with timeout
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });
      
      // Extract comprehensive page data
      const pageData = await page.evaluate(() => {
        // Get basic page info
        const title = document.title || '';
        const description = document.querySelector('meta[name="description"]')?.content || '';
        const keywords = document.querySelector('meta[name="keywords"]')?.content || '';
        
        // Get page content
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()).slice(0, 20);
        const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent.trim()).slice(0, 10);
        
        // Get navigation and structure
        const navLinks = Array.from(document.querySelectorAll('nav a, header a')).map(a => a.textContent.trim()).slice(0, 15);
        const images = Array.from(document.querySelectorAll('img')).length;
        const links = Array.from(document.querySelectorAll('a')).length;
        
        // Get technical info
        const hasSSL = location.protocol === 'https:';
        const hasViewport = !!document.querySelector('meta[name="viewport"]');
        const hasSchema = !!document.querySelector('script[type="application/ld+json"]');
        
        // Get business indicators
        const contactInfo = {
          hasContactForm: !!document.querySelector('form[action*="contact"], input[type="email"]'),
          hasPhone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(document.body.textContent),
          hasEmail: /@\w+\.\w+/.test(document.body.textContent),
          hasAddress: /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd)/i.test(document.body.textContent)
        };
        
        // Detect business type from content
        const businessKeywords = {
          ecommerce: ['shop', 'cart', 'buy', 'price', 'product', 'store', 'checkout'],
          restaurant: ['menu', 'food', 'restaurant', 'dining', 'cuisine', 'order'],
          healthcare: ['doctor', 'medical', 'health', 'patient', 'treatment', 'clinic'],
          technology: ['software', 'tech', 'development', 'digital', 'app', 'platform'],
          education: ['course', 'learn', 'education', 'school', 'training', 'student'],
          finance: ['bank', 'loan', 'finance', 'investment', 'money', 'credit'],
          legal: ['law', 'lawyer', 'legal', 'attorney', 'court', 'justice'],
          realestate: ['property', 'real estate', 'house', 'home', 'rent', 'mortgage']
        };
        
        const bodyText = document.body.textContent.toLowerCase();
        let detectedBusinessType = 'General';
        let maxMatches = 0;
        
        for (const [type, keywords] of Object.entries(businessKeywords)) {
          const matches = keywords.filter(keyword => bodyText.includes(keyword)).length;
          if (matches > maxMatches) {
            maxMatches = matches;
            detectedBusinessType = type.charAt(0).toUpperCase() + type.slice(1);
          }
        }
        
        return {
          title,
          description,
          keywords,
          headings,
          paragraphs: paragraphs.join(' ').substring(0, 1000),
          navLinks,
          images,
          links,
          hasSSL,
          hasViewport,
          hasSchema,
          contactInfo,
          detectedBusinessType,
          contentLength: document.body.textContent.length,
          hasFooter: !!document.querySelector('footer'),
          hasSocialLinks: !!document.querySelector('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]'),
          url: window.location.href
        };
      });
      
      // Get performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const timing = performance.timing;
        return {
          loadTime: timing.loadEventEnd - timing.navigationStart,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: timing.responseStart - timing.navigationStart
        };
      });
      
      console.log('✅ Website crawling completed successfully');
      return { ...pageData, performance: performanceMetrics };
      
    } catch (error) {
      console.error('❌ Website crawling failed:', error);
      return {
        title: '',
        description: '',
        keywords: '',
        headings: [],
        paragraphs: '',
        navLinks: [],
        images: 0,
        links: 0,
        hasSSL: false,
        hasViewport: false,
        hasSchema: false,
        contactInfo: {},
        detectedBusinessType: 'Unknown',
        contentLength: 0,
        error: error.message
      };
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  // UPDATED: Enhanced website analysis with actual content
  async analyzeWebsite(websiteData) {
    try {
      console.log('🤖 Starting comprehensive website analysis for:', websiteData.url);
      
      // First, crawl the website to get actual content
      const crawledData = await this.crawlWebsite(websiteData.url);
      
      if (crawledData.error) {
        console.log('⚠️ Crawling failed, performing URL-based analysis');
        return this.performURLBasedAnalysis(websiteData);
      }
      
      // Create enhanced analysis prompt with actual content
      const analysisPrompt = `
        Analyze this website comprehensively using the following data:
        
        Website URL: ${websiteData.url}
        Page Title: ${crawledData.title}
        Meta Description: ${crawledData.description}
        Meta Keywords: ${crawledData.keywords}
        
        Content Analysis:
        - Headings: ${crawledData.headings.join(', ')}
        - Main Content: ${crawledData.paragraphs}
        - Navigation: ${crawledData.navLinks.join(', ')}
        - Images Count: ${crawledData.images}
        - Links Count: ${crawledData.links}
        - Content Length: ${crawledData.contentLength} characters
        
        Technical Details:
        - Has SSL: ${crawledData.hasSSL}
        - Has Viewport Meta: ${crawledData.hasViewport}
        - Has Schema Markup: ${crawledData.hasSchema}
        - Has Footer: ${crawledData.hasFooter}
        - Has Social Links: ${crawledData.hasSocialLinks}
        
        Business Indicators:
        - Detected Business Type: ${crawledData.detectedBusinessType}
        - Has Contact Form: ${crawledData.contactInfo.hasContactForm}
        - Has Phone: ${crawledData.contactInfo.hasPhone}
        - Has Email: ${crawledData.contactInfo.hasEmail}
        - Has Address: ${crawledData.contactInfo.hasAddress}
        
        Performance:
        - Load Time: ${crawledData.performance?.loadTime || 'N/A'}ms
        - DOM Content Loaded: ${crawledData.performance?.domContentLoaded || 'N/A'}ms
        
        Provide a detailed analysis in JSON format:
        {
          "geoScore": number (0-100, realistic based on actual content quality),
          "grade": "A+, A, B+, B, C+, C, D+, D, F",
          "businessType": "specific business category based on content analysis",
          "industry": "specific industry based on content and business type",
          "metrics": [
            {
              "name": "Content Quality",
              "score": number (0-100),
              "description": "based on title, headings, content depth and structure"
            },
            {
              "name": "Technical SEO",
              "score": number (0-100),
              "description": "based on meta tags, SSL, schema markup, viewport"
            },
            {
              "name": "User Experience",
              "score": number (0-100),
              "description": "based on navigation, structure, contact info availability"
            },
            {
              "name": "Performance",
              "score": number (0-100),
              "description": "based on load times and technical metrics"
            },
            {
              "name": "Mobile Responsiveness",
              "score": number (0-100),
              "description": "based on viewport meta tag and responsive design"
            },
            {
              "name": "Business Presence",
              "score": number (0-100),
              "description": "based on contact information, social links, professional appearance"
            }
          ],
          "strengths": ["list specific strengths found in the actual content"],
          "weaknesses": ["list specific weaknesses found in the actual content"],
          "opportunities": ["specific opportunities for improvement"],
          "threats": ["potential threats or issues"],
          "summary": "comprehensive summary based on actual content analysis",
          "recommendations": ["specific actionable recommendations based on findings"]
        }
        
        Base your analysis on the ACTUAL content and technical details provided, not generic assumptions.
        Be specific and accurate in your assessment.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional website analyst with expertise in SEO, UX, and digital marketing. Analyze the provided website data thoroughly and provide accurate, content-based insights. Return only valid JSON."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 3000
      });

      const analysisText = completion.choices[0].message.content;
      console.log('🤖 Raw OpenAI response received');

      try {
        // Extract JSON from response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : analysisText;
        const analysis = JSON.parse(jsonString);
        
        // Validate and enhance the analysis
        const validatedAnalysis = {
          geoScore: Math.max(0, Math.min(100, analysis.geoScore || 50)),
          grade: analysis.grade || this.calculateGrade(analysis.geoScore || 50),
          businessType: analysis.businessType || crawledData.detectedBusinessType || 'General',
          industry: analysis.industry || this.getIndustryFromBusinessType(analysis.businessType || crawledData.detectedBusinessType),
          metrics: Array.isArray(analysis.metrics) ? analysis.metrics.map(metric => ({
            name: metric.name || 'Unknown Metric',
            score: Math.max(0, Math.min(100, metric.score || 50)),
            description: metric.description || 'No description available'
          })) : [],
          strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
          weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
          opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities : [],
          threats: Array.isArray(analysis.threats) ? analysis.threats : [],
          summary: analysis.summary || 'Website analysis completed based on content review',
          recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
          // Add crawled data info
          crawledData: {
            title: crawledData.title,
            hasContent: crawledData.contentLength > 0,
            businessTypeDetected: crawledData.detectedBusinessType,
            technicalFeatures: {
              ssl: crawledData.hasSSL,
              viewport: crawledData.hasViewport,
              schema: crawledData.hasSchema
            }
          },
          processedUrl: websiteData.url,
          originalUrl: websiteData.originalUrl,
          isInternalSite: websiteData.isInternal
        };

        console.log('✅ Website analysis completed successfully');
        return validatedAnalysis;
        
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw response:', analysisText);
        return this.createFallbackAnalysis(websiteData, crawledData);
      }
      
    } catch (error) {
      console.error('OpenAI analysis error:', error);
      return this.createFallbackAnalysis(websiteData, null);
    }
  }

  // NEW: URL-based analysis for when crawling fails
  async performURLBasedAnalysis(websiteData) {
    const domain = websiteData.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const businessType = this.detectBusinessTypeFromDomain(domain);
    const industry = this.getIndustryFromBusinessType(businessType);
    
    return {
      geoScore: 45,
      grade: 'C',
      businessType,
      industry,
      metrics: [
        {
          name: "Domain Analysis",
          score: 50,
          description: "Analysis based on domain structure and accessibility"
        },
        {
          name: "Basic Technical Check",
          score: 40,
          description: "Limited technical analysis due to access restrictions"
        }
      ],
      strengths: [`Professional domain name: ${domain}`],
      weaknesses: ['Website content could not be analyzed', 'Technical details unavailable'],
      opportunities: ['Improve website accessibility', 'Enable content analysis'],
      threats: ['Limited online visibility due to access restrictions'],
      summary: `Basic analysis of ${domain}. Full content analysis was not possible, recommendations are based on domain structure and general best practices.`,
      recommendations: [
        'Ensure website is publicly accessible',
        'Implement proper meta tags and SEO elements',
        'Add structured data markup'
      ],
      processedUrl: websiteData.url,
      originalUrl: websiteData.originalUrl,
      isInternalSite: websiteData.isInternal,
      error: 'Content crawling failed - analysis limited to domain-based insights'
    };
  }

  // Helper functions
  calculateGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 65) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  }

  detectBusinessTypeFromDomain(domain) {
    const domainLower = domain.toLowerCase();
    
    if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('buy')) return 'E-commerce';
    if (domainLower.includes('restaurant') || domainLower.includes('food') || domainLower.includes('cafe')) return 'Restaurant';
    if (domainLower.includes('tech') || domainLower.includes('dev') || domainLower.includes('software')) return 'Technology';
    if (domainLower.includes('health') || domainLower.includes('medical') || domainLower.includes('clinic')) return 'Healthcare';
    if (domainLower.includes('edu') || domainLower.includes('school') || domainLower.includes('university')) return 'Education';
    if (domainLower.includes('bank') || domainLower.includes('finance') || domainLower.includes('loan')) return 'Finance';
    if (domainLower.includes('law') || domainLower.includes('legal') || domainLower.includes('attorney')) return 'Legal';
    if (domainLower.includes('realty') || domainLower.includes('property') || domainLower.includes('homes')) return 'Real Estate';
    
    return 'Business Services';
  }

  getIndustryFromBusinessType(businessType) {
    const industryMap = {
      'E-commerce': 'Retail & E-commerce',
      'Restaurant': 'Food & Beverage',
      'Technology': 'Information Technology',
      'Healthcare': 'Healthcare & Medical',
      'Education': 'Education & Training',
      'Finance': 'Financial Services',
      'Legal': 'Legal Services',
      'Real Estate': 'Real Estate & Property',
      'Business Services': 'Professional Services',
      'General': 'General Business'
    };
    
    return industryMap[businessType] || 'General Business';
  }

  createFallbackAnalysis(websiteData, crawledData) {
    const businessType = crawledData?.detectedBusinessType || this.detectBusinessTypeFromDomain(websiteData.url);
    const industry = this.getIndustryFromBusinessType(businessType);
    
    return {
      geoScore: crawledData ? 60 : 40,
      grade: crawledData ? 'C+' : 'D',
      businessType,
      industry,
      metrics: [
        {
          name: "Content Analysis",
          score: crawledData ? 65 : 30,
          description: crawledData ? "Basic content analysis completed" : "Content analysis failed"
        },
        {
          name: "Technical SEO",
          score: crawledData?.hasSSL ? 70 : 40,
          description: crawledData ? "Basic technical elements detected" : "Technical analysis limited"
        }
      ],
      strengths: crawledData ? [
        crawledData.hasSSL ? 'SSL certificate installed' : 'Domain accessible',
        crawledData.title ? 'Page title present' : 'Website is online'
      ] : ['Website is accessible'],
      weaknesses: [
        'Detailed analysis could not be completed',
        'Content quality assessment limited'
      ],
      opportunities: [
        'Improve website accessibility for analysis tools',
        'Implement comprehensive SEO strategy'
      ],
      threats: [
        'Limited visibility due to analysis restrictions',
        'Potential technical issues preventing proper crawling'
      ],
      summary: crawledData 
        ? `Analysis of ${businessType.toLowerCase()} website completed with limited data. Some content was accessible but full analysis was restricted.`
        : `Basic analysis of website. Full content analysis was not possible due to technical restrictions.`,
      recommendations: [
        'Ensure website is fully accessible to analysis tools',
        'Implement proper SEO meta tags',
        'Optimize website structure and content',
        'Add technical SEO elements'
      ],
      processedUrl: websiteData.url,
      originalUrl: websiteData.originalUrl,
      isInternalSite: websiteData.isInternal,
      error: crawledData ? 'Partial analysis completed' : 'Full analysis failed'
    };
  }

  // UPDATED: Enhanced competitor generation
  async generateCompetitors(websiteUrl, businessType, industry) {
    try {
      console.log('🤖 Generating competitors for:', websiteUrl, businessType, industry);
      
      const competitorPrompt = `
        Find 6-8 real competitors for this website: ${websiteUrl}
        Business Type: ${businessType}
        Industry: ${industry}
        
        Focus on finding actual competitors that exist and compete in the same space.
        Include both direct competitors (same business model) and indirect competitors (similar target audience).
        
        Return a JSON array:
        [
          {
            "name": "Actual Company Name",
            "website": "https://realwebsite.com",
            "geoScore": number (realistic score 60-95),
            "category": "${businessType} or related category",
            "marketPosition": "Leader/Challenger/Follower/Niche Player",
            "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
            "description": "brief but specific company description"
          }
        ]
        
        Ensure all companies and websites are real and currently active.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a competitive analysis expert. Research and provide only real, existing competitors with accurate information. Return valid JSON only."
          },
          {
            role: "user",
            content: competitorPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const competitorsText = response.choices[0].message.content.trim();
      console.log('🤖 Competitors response received');
      
      try {
        const jsonMatch = competitorsText.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : competitorsText;
        const competitors = JSON.parse(jsonString);
        
        if (!Array.isArray(competitors)) {
          throw new Error('Response is not an array');
        }
        
        // Validate and clean competitor data
        const validatedCompetitors = competitors.map(competitor => ({
          name: competitor.name || 'Unknown Company',
          website: competitor.website || '#',
          geoScore: Math.max(60, Math.min(95, competitor.geoScore || 75)),
          category: competitor.category || businessType,
          marketPosition: competitor.marketPosition || 'Competitor',
          strengths: Array.isArray(competitor.strengths) ? competitor.strengths : ['Market presence'],
          description: competitor.description || 'Competitor in the same industry'
        }));
        
        console.log(`✅ Generated ${validatedCompetitors.length} competitors`);
        return validatedCompetitors;
        
      } catch (parseError) {
        console.error('Competitors JSON Parse Error:', parseError);
        return this.getFallbackCompetitors(businessType, industry);
      }
      
    } catch (error) {
      console.error('OpenAI Competitors Error:', error);
      return this.getFallbackCompetitors(businessType, industry);
    }
  }

  // UPDATED: Enhanced recommendations generation
  async generateRecommendations(analysis, websiteUrl) {
    try {
      console.log('🤖 Generating technical recommendations for:', websiteUrl);
      
      const recommendationsPrompt = `
        Generate specific, actionable technical recommendations based on this website analysis:
        
        Website: ${websiteUrl}
        Overall Score: ${analysis.geoScore}
        Business Type: ${analysis.businessType}
        
        Current Metrics:
        ${analysis.metrics.map(m => `- ${m.name}: ${m.score}/100 - ${m.description}`).join('\n')}
        
        Identified Weaknesses:
        ${analysis.weaknesses.join('\n- ')}
        
        Crawled Data Available: ${analysis.crawledData ? 'Yes' : 'No'}
        ${analysis.crawledData ? `
        Technical Status:
        - SSL: ${analysis.crawledData.technicalFeatures?.ssl}
        - Viewport Meta: ${analysis.crawledData.technicalFeatures?.viewport}
        - Schema Markup: ${analysis.crawledData.technicalFeatures?.schema}
        - Page Title: ${analysis.crawledData.title ? 'Present' : 'Missing'}
        ` : ''}
        
        Generate 8-12 specific, prioritized recommendations in JSON format:
        [
          {
            "title": "Specific, actionable recommendation title",
            "priority": "High/Medium/Low",
            "category": "SEO/Performance/Content/UX/Technical/Security/Mobile",
            "description": "Detailed explanation of the issue and why it matters",
            "expectedImpact": number (1-10, realistic impact rating),
            "timeEstimate": "1-2 hours/1-2 days/1-2 weeks/1+ month",
            "difficulty": "Easy/Medium/Hard",
            "implementation": [
              "Step 1: Specific, actionable step",
              "Step 2: Specific, actionable step",
              "Step 3: Specific, actionable step"
            ]
          }
        ]
        
        Focus on the most impactful recommendations first. Be specific and actionable.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a technical SEO and web optimization expert. Provide specific, actionable recommendations based on the analysis data. Return valid JSON only."
          },
          {
            role: "user",
            content: recommendationsPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 3000
      });

      const recommendationsText = response.choices[0].message.content.trim();
      console.log('🤖 Recommendations response received');
      
      try {
        const jsonMatch = recommendationsText.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : recommendationsText;
        const recommendations = JSON.parse(jsonString);
        
        if (!Array.isArray(recommendations)) {
          throw new Error('Response is not an array');
        }
        
        // Validate and enhance recommendations
        const validatedRecommendations = recommendations.map(rec => ({
          title: rec.title || 'Website Improvement',
          priority: rec.priority || 'Medium',
          category: rec.category || 'General',
          description: rec.description || 'Recommendation for website improvement',
          expectedImpact: Math.max(1, Math.min(10, rec.expectedImpact || 5)),
          timeEstimate: rec.timeEstimate || '1-2 weeks',
          difficulty: rec.difficulty || 'Medium',
          implementation: Array.isArray(rec.implementation) ? rec.implementation : ['Review and implement recommended changes']
        }));
        
        console.log(`✅ Generated ${validatedRecommendations.length} recommendations`);
        return validatedRecommendations;
        
      } catch (parseError) {
        console.error('Recommendations JSON Parse Error:', parseError);
        return this.getFallbackRecommendations(analysis);
      }
      
    } catch (error) {
      console.error('OpenAI Recommendations Error:', error);
      return this.getFallbackRecommendations(analysis);
    }
  }

  // Keep your existing fallback methods but enhance them
  getFallbackCompetitors(businessType, industry) {
    const competitors = {
      'Technology': [
        { name: "Microsoft", website: "https://microsoft.com", geoScore: 95, category: "Technology", marketPosition: "Leader" },
        { name: "Google", website: "https://google.com", geoScore: 98, category: "Technology", marketPosition: "Leader" },
        { name: "Apple", website: "https://apple.com", geoScore: 96, category: "Technology", marketPosition: "Leader" },
        { name: "Amazon", website: "https://amazon.com", geoScore: 94, category: "Technology", marketPosition: "Leader" }
      ],
      'E-commerce': [
        { name: "Amazon", website: "https://amazon.com", geoScore: 98, category: "E-commerce", marketPosition: "Leader" },
        { name: "eBay", website: "https://ebay.com", geoScore: 88, category: "E-commerce", marketPosition: "Challenger" },
        { name: "Shopify", website: "https://shopify.com", geoScore: 90, category: "E-commerce Platform", marketPosition: "Leader" },
        { name: "Etsy", website: "https://etsy.com", geoScore: 85, category: "Marketplace", marketPosition: "Niche Player" }
      ],
      'Restaurant': [
        { name: "OpenTable", website: "https://opentable.com", geoScore: 88, category: "Restaurant Tech", marketPosition: "Leader" },
        { name: "Yelp", website: "https://yelp.com", geoScore: 85, category: "Restaurant Reviews", marketPosition: "Leader" },
        { name: "Grubhub", website: "https://grubhub.com", geoScore: 82, category: "Food Delivery", marketPosition: "Challenger" },
        { name: "DoorDash", website: "https://doordash.com", geoScore: 84, category: "Food Delivery", marketPosition: "Leader" }
      ]
    };
    
    const fallbackCompetitors = competitors[businessType] || competitors['Technology'];
    
    return fallbackCompetitors.map(comp => ({
      ...comp,
      strengths: ["Strong market presence", "Established brand", "Good user experience"],
      description: `Leading company in the ${businessType.toLowerCase()} industry`
    }));
  }

  getFallbackRecommendations(analysis) {
    const baseRecommendations = [
      {
        title: "Improve Page Loading Speed",
        priority: "High",
        category: "Performance",
        description: "Website loading speed directly impacts user experience and SEO rankings. Faster sites have better conversion rates.",
        expectedImpact: 8,
        timeEstimate: "1-2 weeks",
        difficulty: "Medium",
        implementation: [
          "Run Google PageSpeed Insights to identify specific issues",
          "Optimize and compress images using tools like TinyPNG",
          "Minify CSS, JavaScript, and HTML files",
          "Enable browser caching and GZIP compression"
        ]
      },
      {
        title: "Optimize SEO Meta Tags",
        priority: "High",
        category: "SEO",
        description: "Meta tags are crucial for search engine visibility and click-through rates from search results.",
        expectedImpact: 7,
        timeEstimate: "1-2 days",
        difficulty: "Easy",
        implementation: [
          "Add unique, descriptive title tags (50-60 characters) for each page",
          "Write compelling meta descriptions (150-160 characters)",
          "Implement Open Graph tags for social media sharing",
          "Add schema markup for rich snippets"
        ]
      },
      {
        title: "Enhance Mobile Experience",
        priority: "High",
        category: "Mobile",
        description: "Mobile traffic accounts for over 50% of web traffic. Mobile optimization is essential for user experience and SEO.",
        expectedImpact: 8,
        timeEstimate: "1-2 weeks",
        difficulty: "Medium",
        implementation: [
          "Ensure responsive design works on all device sizes",
          "Increase touch target sizes to minimum 44x44 pixels",
          "Optimize mobile navigation and menu structure",
          "Test and improve form input experience on mobile devices"
        ]
      },
      {
        title: "Implement SSL Certificate",
        priority: "High",
        category: "Security",
        description: "SSL certificates are essential for security and are a ranking factor for search engines.",
        expectedImpact: 6,
        timeEstimate: "1-2 hours",
        difficulty: "Easy",
        implementation: [
          "Purchase SSL certificate from your hosting provider",
          "Install and configure SSL certificate",
          "Update all internal links to use HTTPS",
          "Set up 301 redirects from HTTP to HTTPS"
        ]
      }
    ];
    
    // Add specific recommendations based on analysis
    if (analysis.crawledData && !analysis.crawledData.technicalFeatures?.viewport) {
      baseRecommendations.push({
        title: "Add Viewport Meta Tag",
        priority: "Medium",
        category: "Technical",
        description: "Viewport meta tag is essential for responsive design and mobile optimization.",
        expectedImpact: 5,
        timeEstimate: "1 hour",
        difficulty: "Easy",
        implementation: [
          "Add <meta name='viewport' content='width=device-width, initial-scale=1'> to HTML head",
          "Test responsive design on various devices",
          "Validate proper scaling and layout"
        ]
      });
    }
    
    return baseRecommendations;
  }

  // NEW: Method for technical recommendations (used in your routes)
  async getTechnicalRecommendations(websiteUrl, currentScore) {
    try {
      // First get a basic analysis to understand the website
      const basicAnalysis = await this.analyzeWebsite({ url: websiteUrl });
      
      // Then generate recommendations based on the analysis
      const recommendations = await this.generateRecommendations(basicAnalysis, websiteUrl);
      
      return recommendations;
    } catch (error) {
      console.error('Technical recommendations error:', error);
      return this.getFallbackRecommendations({ geoScore: currentScore });
    }
  }

  // NEW: Find competitors method (used in your routes)
  async findCompetitors(websiteUrl, businessType) {
    try {
      const industry = this.getIndustryFromBusinessType(businessType);
      const competitors = await this.generateCompetitors(websiteUrl, businessType, industry);
      
      return {
        competitors,
        total: competitors.length,
        businessType,
        industry
      };
    } catch (error) {
      console.error('Find competitors error:', error);
      return {
        competitors: this.getFallbackCompetitors(businessType, 'General'),
        total: 4,
        businessType,
        industry: 'General Business'
      };
    }
  }
}

module.exports = new OpenAIService();
