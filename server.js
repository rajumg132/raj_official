import express from 'express';
import cors from 'cors';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';
import path from 'path';

// Load environment variables before importing SocialMediaAgent
dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  'GROQ_API_KEY': process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
  'TWITTER_API_KEY': process.env.TWITTER_API_KEY || process.env.VITE_TWITTER_API_KEY,
  'TWITTER_API_SECRET': process.env.TWITTER_API_SECRET || process.env.VITE_TWITTER_API_SECRET,
  'TWITTER_ACCESS_TOKEN': process.env.TWITTER_ACCESS_TOKEN || process.env.VITE_TWITTER_ACCESS_TOKEN,
  'TWITTER_ACCESS_SECRET': process.env.TWITTER_ACCESS_SECRET || process.env.VITE_TWITTER_ACCESS_SECRET
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Error: Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Set environment variables that would normally come from Vite
process.env.VITE_API_URL = process.env.API_URL || 'http://localhost:3000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Also set non-VITE versions for server-side use
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
process.env.TWITTER_API_KEY = process.env.TWITTER_API_KEY || process.env.VITE_TWITTER_API_KEY;
process.env.TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || process.env.VITE_TWITTER_API_SECRET;
process.env.TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || process.env.VITE_TWITTER_ACCESS_TOKEN;
process.env.TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET || process.env.VITE_TWITTER_ACCESS_SECRET;

import SocialMediaAgent from './dist/services/SocialMediaAgent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configure CORS for production
const allowedOrigins = [
  'http://localhost:5173',  // Development
  'http://localhost:3000',  // Local production build
  process.env.FRONTEND_URL  // Production URL (will be set in deployment)
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Initialize nodemailer with secure configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'rajumgjobs@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD // App password from Gmail
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Initialize OAuth 1.0a
const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_API_KEY || process.env.VITE_TWITTER_API_KEY,
    secret: process.env.TWITTER_API_SECRET || process.env.VITE_TWITTER_API_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  }
});

// Initialize and start SocialMediaAgent
const twitterConfig = {
  apiKey: process.env.VITE_TWITTER_API_KEY,
  apiSecret: process.env.VITE_TWITTER_API_SECRET,
  accessToken: process.env.VITE_TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.VITE_TWITTER_ACCESS_SECRET
};

const agent = new SocialMediaAgent(
  process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
  twitterConfig
);

// Configure and start the agent
agent.setConfig({
  maxTweetsPerDay: 12,
  frequency: 'daily'
});

// Start automated posting
agent.startScheduledPosts();
console.log('Automated posting has started. Will post 12 tweets per day.');

// Send daily stats email with better error handling
async function sendDailyStats() {
  const status = agent.getStatus();
  const now = new Date();
  const uptime = process.uptime();
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);

  // Calculate time until next tweet
  const hoursSinceLastTweet = status.lastTweetTime ? 
    (now.getTime() - new Date(status.lastTweetTime).getTime()) / (1000 * 60 * 60) : 0;
  const interval = Math.max(1.5 * 60 * 60 * 1000, (24 * 60 * 60 * 1000) / status.maxTweetsPerDay);
  const hoursUntilNextTweet = Math.max(0, (interval / (1000 * 60 * 60)) - hoursSinceLastTweet);

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1da1f2; border-bottom: 2px solid #1da1f2; padding-bottom: 10px;">Daily Twitter Bot Stats Report</h2>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #333; margin-top: 0;">Tweet Statistics</h3>
        <p><strong>Tweets Posted Today:</strong> ${status.tweetsPostedToday} / ${status.maxTweetsPerDay}</p>
        <p><strong>Last Tweet Time:</strong> ${status.lastTweetTime ? new Date(status.lastTweetTime).toLocaleString() : 'Never'}</p>
        <p><strong>Hours Since Last Tweet:</strong> ${hoursSinceLastTweet.toFixed(1)} hours</p>
        <p><strong>Estimated Time Until Next Tweet:</strong> ${hoursUntilNextTweet.toFixed(1)} hours</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #333; margin-top: 0;">System Status</h3>
        <p><strong>Bot Status:</strong> ${status.isRunning ? '🟢 Active' : '🔴 Inactive'}</p>
        <p><strong>Server Uptime:</strong> ${uptimeHours} hours, ${uptimeMinutes} minutes</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>Memory Usage:</strong> ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</p>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3 style="color: #333; margin-top: 0;">Configuration</h3>
        <p><strong>Posting Frequency:</strong> ${status.config.frequency}</p>
        <p><strong>Tweet Tone:</strong> ${status.config.tone}</p>
        <p><strong>Topics:</strong> ${status.config.topics?.join(', ')}</p>
      </div>

      <div style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
        Generated on ${now.toLocaleString()}
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || 'rajumgjobs@gmail.com',
    to: 'rajumgjobs@gmail.com',
    subject: `Twitter Bot Stats Report - ${now.toLocaleDateString()}`,
    html: emailContent
  };

  try {
    if (!process.env.EMAIL_APP_PASSWORD) {
      console.warn('Email app password not configured. Skipping email send.');
      return;
    }

    await transporter.sendMail(mailOptions);
    console.log('Daily stats email sent successfully');
  } catch (error) {
    console.error('Error sending stats email:', error);
    // Don't throw the error to prevent the application from crashing
  }
}

// Schedule daily stats email
setInterval(sendDailyStats, 24 * 60 * 60 * 1000); // Send every 24 hours
// Also send initial stats
sendDailyStats();

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
      twitterBot: {
        isRunning: true,
        tweetsPostedToday: 0,
        lastTweetTime: null
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve static files from the dist directory
app.use(express.static('dist'));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // This ensures the server listens on all network interfaces

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
  console.log('Environment:', process.env.NODE_ENV);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  
  // Stop the social media agent
  agent.stopScheduledPosts();
  
  // Send final stats email
  try {
    await sendDailyStats();
  } catch (error) {
    console.error('Error sending final stats:', error);
  }

  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown); 