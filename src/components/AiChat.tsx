import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface AiChatProps {
  onClose: () => void;
}

const systemPrompt = `You are a helpful AI assistant for Raj. You help visitors learn about services and expertise.

Key Services:
1. Website Development
   - E-commerce Solutions
   - Corporate Websites
   - Custom Web Applications
   - Blog & Content Platforms

2. Mobile App Development
   - Native and Cross-platform Apps
   - iOS and Android Development

3. AI & Automation Solutions
   - Custom AI Agents & Assistants
     * Task-specific AI agents
     * Customer service bots
     * AI-powered workflow automation
     * Natural language processing
   - ChatGPT Integration
     * Custom GPT models
     * API implementations
     * Conversational interfaces
   - Process Automation
     * Workflow optimization
     * Business process automation
     * Automated testing
   - Educational AI Tools
     * Learning assistants
     * Content generation
     * Assessment systems

Technical Expertise:
- AI Technologies:
  * Large Language Models (GPT)
  * Natural Language Processing
  * API Integration
- Development Stack:
  * Python, Node.js, TypeScript
  * React/Next.js
  * Cloud Services (AWS, Azure)

Pricing Guidelines (Only share when specifically asked about costs):
- Website Development: $500 - $10,000 (based on complexity, features, design requirements)
- Mobile App Development: $1,000 - $15,000 (based on platform, features, complexity)
- AI Solutions: $1,000 - $15,000 (based on AI complexity, data requirements)

Contact Information (Share when users ask about getting in touch):
- Email: rajumgjobs@gmail.com
- WhatsApp: Available via QR code

Response Guidelines:
1. Format responses using markdown for better readability
2. Only discuss pricing when explicitly asked
3. For technical questions, provide specific examples based on expertise
4. Encourage direct contact for detailed project discussions
5. Keep responses friendly but professional
6. Use bullet points and headings for clarity
7. If unsure about any specific detail, encourage contacting Raj directly

When discussing AI agents and solutions:
1. Emphasize customization possibilities
2. Explain how AI can solve specific business problems
3. Highlight integration capabilities with existing systems
4. Share relevant use cases and examples
5. Focus on practical business benefits
6. Discuss data privacy and security considerations

Remember to maintain context from previous messages and refer to information available throughout the website when answering questions.`;

const ContactInfo: React.FC = () => (
  <div className="flex flex-col items-center gap-4 p-6 bg-gray-700/30 rounded-lg border border-gray-600">
    <h3 className="text-lg font-semibold text-white">Contact Raj Directly</h3>
    <div className="flex flex-col items-center gap-3">
      <a 
        href="mailto:rajumgjobs@gmail.com"
        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
      >
        <Mail className="w-4 h-4" />
        rajumgjobs@gmail.com
      </a>
      <div className="mt-2">
        <p className="text-sm text-gray-300 mb-3">Scan QR Code for WhatsApp</p>
        <img 
          src="/whatsapp_qr.svg" 
          alt="WhatsApp QR Code"
          className="w-32 h-32 rounded-lg shadow-lg transition-transform hover:scale-105"
        />
      </div>
    </div>
  </div>
);

const AiChat: React.FC<AiChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hello! I'm here to help you learn about our development and AI integration services. How can I assist you today?",
    id: 'welcome'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [messages]);

  const handleClose = () => {
    onClose();
  };

  const showContactInfo = () => {
    const newMessage = {
      role: 'assistant' as const,
      content: "Here's how you can contact Raj directly:\n\n" +
        "📧 **Email**: rajumgjobs@gmail.com\n\n" +
        "💬 **Telegram**: [t.me/rajumg132](http://t.me/rajumg132)\n\n" +
        "📱 **WhatsApp**: Scan the QR code below\n\n" +
        "Feel free to reach out for detailed quotes or to discuss your project requirements!",
      id: Date.now().toString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      id: Date.now().toString()
    };
    setInput('');
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: 'user', content: userMessage.content }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: data.choices[0].message.content,
          id: Date.now().toString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'I apologize, but I encountered an error. Please try again or contact directly for assistance.',
        id: Date.now().toString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-gray-900/90 backdrop-blur-sm">
      <div className="bg-gray-800/95 rounded-xl w-full sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-3 border-b border-gray-700 bg-gray-800/90 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-semibold text-white">AI Assistant</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={showContactInfo}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Show Contact Information"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatRef}
          className="p-3 sm:p-4 h-[60vh] sm:h-[70vh] md:h-[60vh] overflow-y-auto space-y-4 bg-gray-800/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex items-start gap-2 sm:gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {message.role === 'assistant' ? (
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 p-1 sm:p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                  U
                </div>
              )}
              <div
                className={`flex flex-col min-w-[60px] max-w-[85%] sm:max-w-[75%] text-sm sm:text-base leading-relaxed p-2 sm:p-3 border border-gray-700/50 ${
                  message.role === 'user'
                    ? 'bg-indigo-600/90 rounded-xl rounded-tr-sm shadow-lg ml-auto'
                    : 'bg-gray-700/50 rounded-xl rounded-tl-sm shadow-lg mr-auto'
                }`}
              >
                <div className="prose prose-sm sm:prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                  {message.content.includes("Here's how you can contact Raj directly") && (
                    <div className="mt-4">
                      <ContactInfo />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-2 sm:p-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base
                focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 sm:p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiChat; 