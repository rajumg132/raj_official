# Modern Portfolio with AI Integration

A full-stack portfolio application with automated social media posting capabilities using AI.

## Features

- Modern, responsive portfolio website
- AI-powered social media automation
- Twitter integration for automated posting
- Email contact form
- Dark/Light theme support
- Real-time chat with AI

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS
- Backend: Node.js, Express
- AI Integration: Groq API
- Social Media: Twitter API v2
- Email: Nodemailer with Gmail

## Prerequisites

- Node.js >= 18
- npm or yarn
- Twitter Developer Account
- Groq API Key
- Gmail Account (for email notifications)

## Environment Variables

1. Copy `.env.example` to create your `.env` file:
```bash
cp .env.example .env
```

2. Fill in your environment variables:

### Server Configuration
```env
PORT=3000                     # Port for the server to run on
NODE_ENV=development         # development or production
API_URL=http://localhost:3000 # Backend API URL
```

### Frontend Configuration
```env
VITE_API_URL=http://localhost:3000  # Must match API_URL in development
```

### Groq API Configuration
```env
GROQ_API_KEY=your_groq_api_key          # Server-side key
VITE_GROQ_API_KEY=your_groq_api_key     # Client-side key (same as above)
```

### Twitter API Configuration
Get these from your Twitter Developer Portal:
```env
# Server-side keys
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# Client-side keys (same as above)
VITE_TWITTER_API_KEY=your_twitter_api_key
VITE_TWITTER_API_SECRET=your_twitter_api_secret
VITE_TWITTER_ACCESS_TOKEN=your_twitter_access_token
VITE_TWITTER_ACCESS_SECRET=your_twitter_access_secret
```

### Email Configuration
For Gmail, use an App Password (not your regular password):
```env
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
```

### Production Only
```env
FRONTEND_URL=https://your-frontend-url.com  # For CORS in production
```

> **Note**: Never commit your `.env` file. It's already added to `.gitignore`.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build:all
```

4. Start the development server:
```bash
npm start
```

## Deployment

### Railway Deployment Steps

1. **Prepare Your Repository**
   ```bash
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit"
   
   # Add your GitHub repository
   git remote add origin <your-github-repo-url>
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Railway Setup**
   - Go to [Railway.app](https://railway.app/)
   - Sign in with GitHub
   - Create a new project
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Environment Variables**
   Set the following in Railway's environment variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=production
   API_URL=https://<your-railway-app-url>

   # Frontend Configuration
   VITE_API_URL=https://<your-railway-app-url>

   # Groq API
   GROQ_API_KEY=your_groq_api_key
   VITE_GROQ_API_KEY=your_groq_api_key

   # Twitter API
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_SECRET=your_twitter_access_secret

   # Email
   EMAIL_USER=your_gmail_address
   EMAIL_APP_PASSWORD=your_gmail_app_password

   # CORS
   FRONTEND_URL=https://<your-railway-app-url>
   ```

4. **Deployment**
   - Railway will automatically:
     - Detect the Node.js project
     - Install dependencies
     - Run the build command (`npm run build:all`)
     - Start the server (`npm start`)

5. **Monitoring**
   - Watch deployment logs in Railway dashboard
   - Check the health endpoint at `/health`
   - Monitor email notifications for daily stats
   - Watch Twitter posting activity in logs

6. **Troubleshooting**
   - Verify all environment variables are set correctly
   - Check Railway logs for build or runtime errors
   - Ensure Twitter API keys have correct permissions
   - Verify Groq API key is valid with sufficient credits
   - Check Gmail app password is correct

7. **Custom Domain (Optional)**
   - Add your domain in Railway's project settings
   - Configure DNS settings as per Railway's instructions
   - Update `FRONTEND_URL` environment variable with your custom domain

## Scripts

- `npm run dev`: Start development server
- `npm run build:server`: Build server files
- `npm run build:all`: Build both frontend and server
- `npm run server`: Run the server
- `npm start`: Run both frontend and server
- `npm run preview`: Preview production build

## License

MIT 