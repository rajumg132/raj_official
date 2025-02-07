import SocialMediaAgent from '../services/SocialMediaAgent';

const GROQ_API_KEY = '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';

async function testTweetGeneration() {
  const agent = new SocialMediaAgent(GROQ_API_KEY);

  try {
    const tweet = await agent.generateTestTweet('AI and Web Development');
    console.log('Generated Tweet:', tweet);
  } catch (error) {
    console.error('Error:', error);
  }
}

testTweetGeneration(); 