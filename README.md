# RAJ's Development Services

A modern, responsive frontend website showcasing development and AI integration services. Built with React, TypeScript, and Tailwind CSS. This is a static site that runs entirely in the browser with no backend dependencies.

## Features

- 🎨 Modern UI with dark/light mode
- 💬 AI Chat integration using Groq API
- 📱 Fully responsive design
- ⚡ High performance animations with GSAP
- 📧 Contact form with EmailJS integration
- 🌐 WhatsApp integration
- 🔒 Environment variable configuration
- 🚀 Static site deployment ready

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- GSAP (GreenSock Animation Platform)
- Vite (Build tool)
- EmailJS (Contact form)
- Groq API (AI Chat)
- Lucide Icons

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd [your-repo-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables:
   - EmailJS configuration for the contact form
   - Groq API key for the AI chat feature

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Environment Variables

Required environment variables:
- `VITE_GROQ_API_KEY` - Groq API key for AI chat
- `VITE_EMAILJS_PUBLIC_KEY` - EmailJS public key
- `VITE_EMAILJS_SERVICE_ID` - EmailJS service ID
- `VITE_EMAILJS_TEMPLATE_ID` - EmailJS template ID

## Deployment

This is a static site that can be deployed to any static hosting service:

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Deploy the `dist` directory to your preferred hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - Firebase Hosting
   - Any static file hosting

### Example: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Raj - rajumgjobs@gmail.com
- Telegram: [@rajumg132](http://t.me/rajumg132)
- Twitter: [@raj132_official](https://x.com/raj132_official) 