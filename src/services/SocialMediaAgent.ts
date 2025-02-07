import OpenAI from 'openai';

// Environment variable helper function
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  // @ts-ignore
  return (typeof import.meta !== 'undefined' && import.meta.env?.[key]) || defaultValue;
};

interface PostConfig {
  maxTweetsPerDay?: number;
  frequency: 'daily' | 'weekly' | 'custom';
  customHours?: number;
  topics?: string[];
  platforms?: ['twitter'];
  tone?: 'professional' | 'casual' | 'technical';
}

interface Post {
  content: string;
  hashtags: string[];
  platform: 'twitter';
}

interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

interface TopicSubcategory {
  [key: string]: string[];
}

interface TopicCategory {
  [key: string]: string[];
}

interface TopicCategories {
  [key: string]: TopicCategory;
}

interface TwitterApiResponse {
  data: {
    id: string;
    text: string;
  };
}

class SocialMediaAgent {
  private groqApiKey: string;
  private twitterConfig: TwitterConfig;
  private config: PostConfig = {
    frequency: 'daily',
    maxTweetsPerDay: 12,
    customHours: 24,
    topics: ['AI', 'Web Development', 'Tech Trends', 'Programming'],
    platforms: ['twitter'],
    tone: 'professional'
  };
  private postingInterval?: NodeJS.Timeout;
  private lastUsedCategory: string | null = null;
  private usedTopics: Set<string> = new Set();
  
  // Rate limiting properties
  private tweetsPostedToday: number = 0;
  private lastTweetTime: Date = new Date(0);
  private readonly MAX_TWEETS_PER_DAY = 17; // Free tier limit
  private readonly MIN_HOURS_BETWEEN_TWEETS = 1.5; // To stay well within limits
  private maxTweetsPerDay: number = 12; // Default to 12 tweets per day

  private topicCategories: TopicCategories = {
    businessAndProductivity: {
      aiIntegration: [
        'AI-Powered Customer Service Solutions',
        'Intelligent Sales Automation',
        'Smart Marketing Automation',
        'Advanced Document Processing',
        'Predictive Data Analysis',
        'Real-time Business Intelligence',
        'AI Process Optimization',
        'Cost-Effective AI Solutions'
      ],
      solutions: [
        'Custom Enterprise AI Development',
        'Seamless AI Integration Services',
        'Cloud Migration Excellence',
        'Digital Transformation Strategy',
        'AI Workflow Optimization',
        'Intelligent Resource Management',
        'AI Consulting Services',
        'Machine Learning Solutions'
      ],
      benefits: [
        'Proven ROI Improvements',
        'Significant Efficiency Gains',
        'Substantial Cost Savings',
        'Measurable Productivity Boost',
        'Enhanced Service Quality',
        'Rapid Time-to-Market',
        'Competitive Advantage',
        'Scalable Growth'
      ],
      success_stories: [
        'Client Success Stories',
        'Case Studies',
        'Implementation Results',
        'Performance Metrics',
        'Customer Testimonials',
        'Project Outcomes'
      ]
    },

    aiAndAutomation: {
      models: [
        'GPT-4', 'Claude', 'Gemini', 'DALL-E', 'Stable Diffusion',
        'Mixtral', 'Llama', 'CodeLlama', 'PaLM'
      ],
      applications: [
        'Code Generation', 'Code Review', 'Testing Automation',
        'Content Generation', 'Image Generation', 'Voice Recognition',
        'Natural Language Processing'
      ],
      agents: [
        'AI Assistants', 'Autonomous Agents', 'Chat Agents',
        'Task Automation', 'Workflow Automation'
      ],
      concepts: [
        'Prompt Engineering', 'Fine-tuning', 'Model Evaluation',
        'AI Ethics', 'AI Safety', 'AI Performance Optimization'
      ]
    },

    webDevelopment: {
      main: [
        'Frontend Development', 'Backend Development', 'Full Stack Development'
      ],
      technologies: [
        'React', 'Next.js', 'Python', 'Node.js', 'Django',
        'GraphQL', 'REST APIs', 'WebSockets', 'Progressive Web Apps'
      ],
      concepts: [
        'Web Performance', 'SEO Optimization', 'Web Security', 'Web Accessibility',
        'Responsive Design'
      ],
      tools: [
        'Webpack', 'Vite', 'Docker', 'Git'
      ]
    },

    appDevelopment: {
      platforms: [
        'iOS Development', 'Android Development', 'Cross-platform Development'
      ],
      frameworks: [
        'React Native', 'Flutter', 'SwiftUI'
      ],
      concepts: [
        'Mobile UI/UX', 'App Performance', 'Mobile Security',
        'Offline Storage', 'Push Notifications', 'App Store Optimization'
      ]
    },
    
    emerging: {
      technologies: [
        'Web3', 'Blockchain', 'Crypto', 'Bitcoin', 'Ethereum', 'Solana'
      ],
      trends: [
        'AI-first Development', 'Low-code/No-code'
      ]
    }
  };

  private tweetCategories = {
    promotional: {
      templates: [
        "🚀 Our {feature} service is perfect for {context}. Here's why: {benefit}",
        "💼 Client Spotlight: See how our {feature} transformed {context}, leading to {benefit}",
        "📈 Success Story: Helped a {context} achieve {benefit} through our {feature}! Real results that speak for themselves.",
        "🎉 Exciting news! Our enhanced {feature} for {context} now delivers even better {benefit}",
        "👥 Client's words: '{feature} transformed our {context}, delivering {benefit}'"
      ],
      weight: 0.4  // 40% of tweets
    },
    educational: {
      templates: [
        "🎓 Pro Tip: Leverage {feature} for your {context} to achieve {benefit}",
        "💡 Quick Guide: Implement {feature} in your {context} workflow to get {benefit}",
        "🔍 Best Practice: When dealing with {context}, use {feature} to ensure {benefit}",
        "📚 Did you know? Proper use of {feature} in {context} leads to {benefit}",
        "💪 Power tip: Optimize your {context} by implementing {feature}, resulting in {benefit}"
      ],
      weight: 0.3  // 30% of tweets
    },
    helpful: {
      templates: [
        "❓ Facing challenges with {context}?\n✨ Solution: Try {feature}\n💫 Result: {benefit}",
        "🎯 Quick troubleshooting for {context}:\n1️⃣ Implement {feature}\n2️⃣ Watch as you get {benefit}",
        "💡 Struggling with {context}? Here's how {feature} helps: {benefit}",
        "🔧 Common {context} issue? Here's a free tip:\nUse {feature} to get {benefit}",
        "🤝 Community tip: For better {context} results, we recommend {feature} - {benefit}"
      ],
      weight: 0.3  // 30% of tweets
    }
  };

  private lastUsedTweetCategory: string | null = null;

  private selectTweetTemplate(): string {
    // Get available categories (exclude last used if possible)
    const categories = Object.keys(this.tweetCategories);
    let availableCategories = this.lastUsedTweetCategory
      ? categories.filter(cat => cat !== this.lastUsedTweetCategory)
      : categories;

    // If all categories used, reset
    if (availableCategories.length === 0) {
      availableCategories = categories;
    }

    // Select category based on weights
    const totalWeight = availableCategories.reduce(
      (sum, cat) => sum + this.tweetCategories[cat].weight,
      0
    );
    
    let random = Math.random() * totalWeight;
    let selectedCategory = availableCategories[0];
    
    for (const category of availableCategories) {
      random -= this.tweetCategories[category].weight;
      if (random <= 0) {
        selectedCategory = category;
        break;
      }
    }

    // Update last used category
    this.lastUsedTweetCategory = selectedCategory;

    // Select random template from category
    const templates = this.tweetCategories[selectedCategory].templates;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private benefitTemplates = [
    "resulting in 30-50% efficiency improvements",
    "leading to significant cost savings and ROI",
    "boosting productivity by up to 40%",
    "reducing manual work by 60%",
    "accelerating time-to-market by weeks",
    "improving customer satisfaction by 45%",
    "cutting operational costs by 35%",
    "increasing team productivity by 50%",
    "delivering 3x faster results",
    "achieving 99.9% accuracy rates",
    "saving 20+ hours per week",
    "reducing errors by 90%",
    "scaling operations by 200%",
    "improving decision-making by 70%",
    "enhancing user experience significantly",
    "generating 2x more qualified leads",
    "streamlining workflows dramatically",
    "providing real-time insights 24/7",
    "ensuring 100% compliance",
    "maximizing resource utilization by 65%"
  ];

  constructor(
    groqApiKey: string,
    twitterConfig: TwitterConfig
  ) {
    this.groqApiKey = groqApiKey;
    this.twitterConfig = twitterConfig;
  }

  public setConfig(config: PostConfig) {
    this.config = { ...this.config, ...config };
    if (config.maxTweetsPerDay) {
      this.maxTweetsPerDay = Math.min(config.maxTweetsPerDay, this.MAX_TWEETS_PER_DAY);
    }
  }

  public getStatus(): any {
    return {
      isRunning: !!this.postingInterval,
      tweetsPostedToday: this.tweetsPostedToday,
      lastTweetTime: this.lastTweetTime,
      maxTweetsPerDay: this.maxTweetsPerDay,
      config: this.config
    };
  }

  private async postTweet(content: string, hashtags: string[]): Promise<TwitterApiResponse | null> {
    try {
      const tweet = `${content}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`;
      
      const API_URL = getEnvVar('VITE_API_URL', 'http://localhost:3000');
      const response = await fetch(`${API_URL}/api/twitter/tweet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text: tweet })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60');
          console.log(`Rate limit hit. Will skip to next scheduled posting time. (Rate limit resets in ${retryAfter} seconds)`);
          // Don't retry immediately, return null to skip this attempt
          return null;
        }

        const errorMessage = data.detail || (data.errors && data.errors[0]?.message) || 'Failed to post tweet';
        throw new Error(`Twitter API error: ${errorMessage}`);
      }

      this.tweetsPostedToday++;
      this.lastTweetTime = new Date();
      console.log('Tweet posted successfully:', tweet);
      return data as TwitterApiResponse;
    } catch (error) {
      console.error('Error posting tweet:', error);
      return null;
    }
  }

  private canPostTweet(): boolean {
    const now = new Date();
    const hoursSinceLastTweet = (now.getTime() - this.lastTweetTime.getTime()) / (1000 * 60 * 60);
    
    // Reset daily counter if it's a new day
    if (now.getDate() !== this.lastTweetTime.getDate()) {
      this.tweetsPostedToday = 0;
    }
    
    const canPost = (
      this.tweetsPostedToday < this.maxTweetsPerDay &&
      hoursSinceLastTweet >= this.MIN_HOURS_BETWEEN_TWEETS
    );

    if (!canPost) {
      console.log(`Cannot post tweet: ${this.tweetsPostedToday}/${this.maxTweetsPerDay} tweets posted today, ${hoursSinceLastTweet.toFixed(1)} hours since last tweet`);
    }

    return canPost;
  }

  public async startScheduledPosts(): Promise<void> {
    if (this.postingInterval) {
      clearInterval(this.postingInterval);
    }

    const postIfPossible = async (): Promise<void> => {
      if (this.canPostTweet()) {
        try {
          const topic = await this.generateRandomTopic();
          const post = await this.generateContent(topic);
          
          // Single attempt to post, no retries on rate limit
          const result = await this.postTweet(post.content, post.hashtags);
          if (result?.data) {
            console.log(`Tweet posted successfully with ID: ${result.data.id}`);
          } else {
            console.log('Tweet posting skipped. Will try again at next scheduled time.');
          }
        } catch (error) {
          console.error('Error in posting cycle:', error);
        }
      }
    };

    // Initial post with delay to allow environment variables to be set
    setTimeout(async () => {
      await postIfPossible();
    }, 5000);

    // Calculate optimal interval based on maxTweetsPerDay
    const interval = Math.max(
      this.MIN_HOURS_BETWEEN_TWEETS * 60 * 60 * 1000,
      (24 * 60 * 60 * 1000) / this.maxTweetsPerDay
    );
    
    // Schedule regular posts
    this.postingInterval = setInterval(postIfPossible, interval);
    console.log(`Scheduled to post ${this.maxTweetsPerDay} tweets per day, one every ${interval / (60 * 60 * 1000)} hours`);
  }

  public stopScheduledPosts() {
    if (this.postingInterval) {
      clearInterval(this.postingInterval);
      this.postingInterval = undefined;
    }
  }

  private async generateRandomTopic(): Promise<string> {
    const categories = Object.keys(this.topicCategories);
    
    // Filter out the last used category if it exists
    const availableCategories = this.lastUsedCategory 
      ? categories.filter(cat => cat !== this.lastUsedCategory)
      : categories;
    
    // If all categories have been used, reset the last used category
    const randomCategory = availableCategories.length > 0
      ? availableCategories[Math.floor(Math.random() * availableCategories.length)]
      : categories[Math.floor(Math.random() * categories.length)];
    
    this.lastUsedCategory = randomCategory;
    const category = this.topicCategories[randomCategory];
    
    const subcategories = Object.keys(category);
    const randomSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
    const topics = category[randomSubcategory];
    
    // Filter out previously used topics
    const availableTopics = topics.filter(topic => !this.usedTopics.has(topic));
    
    // If all topics in this category/subcategory have been used, reset the used topics
    if (availableTopics.length === 0) {
      this.usedTopics.clear();
      const randomIndex = Math.floor(Math.random() * topics.length);
      return topics[randomIndex];
    }
    
    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    this.usedTopics.add(randomTopic);
    
    return randomTopic;
  }

  private async generateContent(topic: string): Promise<Post> {
    const template = this.selectTweetTemplate();
    const benefit = this.benefitTemplates[Math.floor(Math.random() * this.benefitTemplates.length)];

    const prompt = `You are a tech professional sharing your genuine insights and experiences. Write a ${this.config.tone} tweet about ${topic} that sounds natural, engaging, and human, as if you're sharing a real insight or tip with your followers. 

Some guidelines:
- Use the following template but make it sound natural and conversational: "${template}"
- Replace {feature} with a specific feature, tool, or technique related to ${topic}
- Replace {context} with a relevant use case or scenario
- Replace {benefit} with: "${benefit}"
- Keep it authentic and relatable
- Add personality and genuine enthusiasm
- Include real-world context or examples
- Feel free to use appropriate emojis naturally
- Make it sound like a real person tweeting, not a corporate message
- Focus on providing value to the reader
- If it's a promotional tweet, keep it subtle and focus on real benefits
- If it's an educational/helpful tweet, make it actionable and specific
- Avoid jargon unless it's commonly used in the field

Format the response as a JSON object with:
- content: the main tweet text (excluding hashtags)
- hashtags: an array of 2-3 most relevant hashtag words (without the # symbol)`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.9,
          max_tokens: 350,
          top_p: 1
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Groq API');
      }

      let result;
      try {
        // Try to parse the response as JSON
        const content = data.choices[0].message.content.trim();
        result = JSON.parse(content);
      } catch (error) {
        console.error('Error parsing Groq response as JSON:', error);
        // Fallback: Generate a simple tweet format
        const text = data.choices[0].message.content;
        const hashtags = topic.split(' ').map(word => word.replace(/[^a-zA-Z0-9]/g, ''));
        result = {
          content: `Just explored ${topic} - ${benefit}`,
          hashtags: [...new Set([...hashtags, 'Tech', 'Innovation'])]
        };
      }

      return {
        content: result.content,
        hashtags: result.hashtags,
        platform: 'twitter'
      };
    } catch (error) {
      console.error('Error generating content:', error);
      // Provide a fallback tweet in case of any errors
      return {
        content: `Exploring the latest developments in ${topic}. ${benefit}`,
        hashtags: ['Tech', 'Innovation', topic.replace(/[^a-zA-Z0-9]/g, '')],
        platform: 'twitter'
      };
    }
  }

  public async generateTestTweet(topic: string = 'AI'): Promise<string> {
    try {
      const post = await this.generateContent(topic);
      const tweet = `${post.content}\n\n${post.hashtags.map(tag => `#${tag}`).join(' ')}`;
      console.log('Generated Tweet:', tweet);
      return tweet;
    } catch (error) {
      console.error('Error generating test tweet:', error);
      throw error;
    }
  }
}

export default SocialMediaAgent; 