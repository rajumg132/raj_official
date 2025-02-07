const GROQ_API_KEY = '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';

async function generateTweet(topic: string = 'AI'): Promise<string> {
  const prompt = `You are a tech professional sharing your genuine insights and experiences. Write a professional tweet about ${topic} that sounds natural and helpful, as if you're sharing a real insight or tip with your followers. Avoid corporate or AI-like language. Make it conversational and authentic.

Some guidelines:
- Write as if you're talking to a friend or colleague
- Share practical insights, tips, or real-world observations
- Use natural language and a conversational tone
- Include relevant hashtags that real people use
- Keep it genuine and avoid marketing-speak

Format the response as a JSON object with:
- content: the main tweet text (excluding hashtags)
- hashtags: an array of 2-3 most relevant hashtag words (without the # symbol)

Example of a natural tweet:
{
  "content": "Just discovered a game-changing VS Code extension for AI development - it's cutting my coding time in half! Happy to share more details if anyone's interested",
  "hashtags": ["DevTools", "CodingTips"]
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-r1-distill-llama-70b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 350,
        stop: ['}'],
        top_p: 1
      })
    });

    const data = await response.json();
    console.log('Raw response:', JSON.stringify(data, null, 2));

    let result;
    try {
      const contentStr = data.choices[0].message.content.trim() + '}';
      result = JSON.parse(contentStr);
    } catch (error) {
      console.error('Error parsing Groq response:', error);
      // Fallback format in case of parsing error
      result = {
        content: data.choices[0].message.content.split('#')[0].trim(),
        hashtags: data.choices[0].message.content
          .split('#')
          .slice(1)
          .map(tag => tag.trim())
          .filter(Boolean)
      };
    }

    const tweet = `${result.content}\n\n${result.hashtags.map(tag => `#${tag}`).join(' ')}`;
    return tweet;
  } catch (error) {
    console.error('Error generating tweet:', error);
    throw error;
  }
}

// Test the tweet generation with different topics
async function test() {
  const topics = [
    'AI and Web Development',
    'React Performance Tips',
    'Cloud Computing Cost Savings',
    'Mobile App Development Workflow'
  ];

  for (const topic of topics) {
    try {
      console.log(`\nGenerating tweet about: ${topic}`);
      console.log('----------------------------------------');
      const tweet = await generateTweet(topic);
      console.log(tweet);
      console.log('----------------------------------------');
    } catch (error) {
      console.error(`Test failed for topic "${topic}":`, error);
    }
  }
}

test(); 