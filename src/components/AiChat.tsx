import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatProps {
  onClose: () => void;
}

const systemPrompt = `You are a helpful AI assistant for Raj's portfolio website. You help visitors learn about Raj's services and expertise.

Key Services:
1. Website Development
   - E-commerce Websites
   - Corporate Websites
   - Portfolio Websites
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
3. For technical questions, provide specific examples based on Raj's expertise
4. Encourage direct contact for detailed project discussions
5. Reference relevant portfolio projects and skills from the website
6. Keep responses friendly but professional
7. Use bullet points and headings for clarity
8. If unsure about any specific detail, encourage contacting Raj directly

When discussing AI agents and solutions:
1. Emphasize customization possibilities
2. Explain how AI can solve specific business problems
3. Highlight integration capabilities with existing systems
4. Share relevant use cases and examples
5. Focus on practical business benefits
6. Discuss data privacy and security considerations

Remember to maintain context from previous messages and refer to information available throughout the website when answering questions.`;

const ContactInfo: React.FC = () => (
  <div className="flex flex-col items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
    <h3 className="text-lg font-semibold text-white">Contact Raj Directly</h3>
    <div className="flex flex-col items-center gap-2">
      <a 
        href="mailto:rajumgjobs@gmail.com"
        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        rajumgjobs@gmail.com
      </a>
      <div className="mt-2">
        <p className="text-sm text-gray-300 mb-2">Scan QR Code for WhatsApp</p>
        <img 
          src="/whatsapp_qr.svg" 
          alt="WhatsApp QR Code"
          className="w-32 h-32 rounded-lg"
        />
      </div>
    </div>
  </div>
);

const AiChat: React.FC<AiChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClose = () => {
    onClose();
  };

  const showContactInfo = () => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "Here's how you can contact Raj directly:\n\n" +
        "📧 **Email**: rajumgjobs@gmail.com\n\n" +
        "📱 **WhatsApp**: Scan the QR code below\n\n" +
        "Feel free to reach out for detailed quotes or to discuss your project requirements!"
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
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
            ...messages,
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact directly for assistance.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-gray-800/95 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-indigo-500" />
                <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={showContactInfo}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                  title="Show Contact Information"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatRef}
              className="p-4 h-[400px] overflow-y-auto space-y-4 bg-gray-800/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              <div className="flex items-start gap-2.5">
                <Bot className="w-8 h-8 p-1.5 bg-indigo-600 text-white rounded-lg" />
                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-700 bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-normal text-gray-300">
                    Hello! I'm here to help you learn about our services. What would you like to know? You can also click the email icon above to see contact information.
                  </p>
                </div>
              </div>

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-8 h-8 p-1.5 bg-indigo-600 text-white rounded-lg" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                      U
                    </div>
                  )}
                  <div
                    className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-700 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 rounded-lg'
                        : 'bg-gray-700/50 rounded-lg'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="text-sm font-normal text-white">{message.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({...props}) => <p className="text-sm text-gray-300 mb-2" {...props} />,
                            h1: ({...props}) => <h1 className="text-lg font-bold text-white mb-2" {...props} />,
                            h2: ({...props}) => <h2 className="text-md font-semibold text-white mb-2" {...props} />,
                            h3: ({...props}) => <h3 className="text-sm font-semibold text-white mb-2" {...props} />,
                            ul: ({...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                            ol: ({...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                            li: ({...props}) => <li className="text-gray-300 mb-1" {...props} />,
                            code: ({inline, ...props}) => 
                              inline ? (
                                <code className="bg-gray-600/50 px-1 py-0.5 rounded text-gray-200" {...props} />
                              ) : (
                                <code className="block bg-gray-600/50 p-2 rounded text-gray-200 mb-2 overflow-x-auto" {...props} />
                              ),
                            pre: ({...props}) => <pre className="bg-transparent" {...props} />,
                            a: ({...props}) => <a className="text-indigo-400 hover:text-indigo-300" {...props} />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        {message.content.includes('Scan the QR code below') && <ContactInfo />}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our services..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
  );
};

export default AiChat; 