import SocialMediaAgent from '../services/SocialMediaAgent';

const GROQ_API_KEY = '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';

// Twitter API credentials
const TWITTER_CONFIG = {
  apiKey: 'U3tqLtb6nwXt24q7vGH421E6D',
  apiSecret: 'dlA3fWbcmyUUdVmNmy8d6GHvioB347Wu8cjAn0WbHEKDiO7Wwx',
  accessToken: '1887382296908734464-DpYAsNFCPvBFM0IOdTnSag4jx0Y9eP',
  accessSecret: 'VB1wCM5ancMu2xXAousnPp9jPw3OlfUbb3Q0Jk6bVQBFG'
};

async function startContinuousPosting() {
  console.log('Starting continuous social media posting service...');
  
  const agent = new SocialMediaAgent(GROQ_API_KEY, TWITTER_CONFIG);
  
  // Configure for 12 tweets per day
  agent.setConfig({ 
    maxTweetsPerDay: 12,
    frequency: 'daily'
  });

  // Log initial status
  console.log('\nInitial Status:');
  console.log(agent.getStatus());

  // Start automated posting
  agent.startScheduledPosts();
  console.log('\nAutomated posting has started. Will post 12 tweets per day.');
  console.log('Press Ctrl+C to stop the service.\n');

  // Keep the script running and log status every hour
  setInterval(() => {
    console.log('\nCurrent Status:');
    console.log(agent.getStatus());
    console.log('Service is running. Press Ctrl+C to stop.\n');
  }, 60 * 60 * 1000); // Log status every hour

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nStopping social media posting service...');
    agent.stopScheduledPosts();
    console.log('Service stopped. Final status:');
    console.log(agent.getStatus());
    process.exit(0);
  });
}

// Start the service
startContinuousPosting().catch(error => {
  console.error('Error running social media service:', error);
  process.exit(1);
}); 