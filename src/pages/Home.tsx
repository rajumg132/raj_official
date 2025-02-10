import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  ChevronDown,
  Globe,
  Code2,
  Store,
  BookOpen,
  Building2,
  Smartphone,
  Brain,
  Bot,
  Linkedin,
  Twitter,
  Layout,
  Database,
  Terminal,
  MessageSquare,
  MessageCircle,
  Send
} from 'lucide-react';
import LoadingAnimation from '../components/shared/LoadingAnimation';
import AiChat from '../components/AiChat';
import ThemeToggle from '../components/ThemeToggle';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const services: Service[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'AI Agents & Assistants',
    description: 'Custom AI solutions that automate tasks and enhance business operations',
    features: [
      'Task-specific AI agents',
      'Customer service bots',
      'Workflow automation',
      'Natural language processing'
    ]
  },
  {
    icon: <Bot className="w-8 h-8" />,
    title: 'ChatGPT Integration',
    description: 'Powerful AI integration solutions using latest GPT models',
    features: [
      'Custom GPT implementations',
      'API integrations',
      'Conversational interfaces',
      'Knowledge base systems'
    ]
  },
  {
    icon: <Store className="w-8 h-8" />,
    title: 'E-commerce Websites',
    description: 'Custom online stores with seamless shopping experiences',
    features: [
      'Secure payment integration',
      'Inventory management',
      'Mobile-responsive design',
      'Order tracking system'
    ]
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Corporate Websites',
    description: 'Professional web presence for businesses and organizations',
    features: [
      'Modern UI/UX design',
      'Content management system',
      'Analytics integration',
      'SEO optimization'
    ]
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps for iOS and Android',
    features: [
      'React Native development',
      'Native performance',
      'Push notifications',
      'Offline functionality'
    ]
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: 'Educational AI Tools',
    description: 'Intelligent learning systems and educational platforms',
    features: [
      'Learning assistants',
      'Content generation',
      'Assessment systems',
      'Progress tracking'
    ]
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Process Automation',
    description: 'Streamline operations with intelligent automation',
    features: [
      'Workflow optimization',
      'Business automation',
      'System integration',
      'Performance monitoring'
    ]
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Cloud & DevOps',
    description: 'Scalable cloud infrastructure and deployment solutions',
    features: [
      'AWS/Azure deployment',
      'Docker containerization',
      'CI/CD pipelines',
      'Infrastructure as code'
    ]
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: 'API Development',
    description: 'Custom API solutions and integrations for seamless connectivity',
    features: [
      'RESTful APIs',
      'GraphQL endpoints',
      'API documentation',
      'Third-party integrations'
    ]
  }
];

const heroBackgroundImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600";

// Skills data for About section
const skills = [
  {
    category: 'Frontend Development',
    icon: <Layout className="w-6 h-6" />,
    items: [
      { name: 'React/Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'CSS/Tailwind', level: 92 }
    ]
  },
  {
    category: 'Backend Development',
    icon: <Terminal className="w-6 h-6" />,
    items: [
      { name: 'Node.js', level: 88 },
      { name: 'Python', level: 85 },
      { name: 'GraphQL', level: 82 }
    ]
  },
  {
    category: 'Mobile Development',
    icon: <Smartphone className="w-6 h-6" />,
    items: [
      { name: 'React Native', level: 88 },
      { name: 'Mobile UI/UX', level: 85 },
      { name: 'App Performance', level: 84 }
    ]
  },
  {
    category: 'AI & Automation',
    icon: <Brain className="w-6 h-6" />,
    items: [
      { name: 'ChatGPT Integration', level: 90 },
      { name: 'Machine Learning', level: 82 },
      { name: 'Process Automation', level: 88 }
    ]
  },
  {
    category: 'Database & Cloud',
    icon: <Database className="w-6 h-6" />,
    items: [
      { name: 'PostgreSQL/MongoDB', level: 87 },
      { name: 'AWS Services', level: 84 },
      { name: 'Cloud Architecture', level: 83 }
    ]
  },
  {
    category: 'DevOps & Tools',
    icon: <Bot className="w-6 h-6" />,
    items: [
      { name: 'CI/CD', level: 86 },
      { name: 'Docker/Kubernetes', level: 83 },
      { name: 'Git/Version Control', level: 90 }
    ]
  }
];

// Contact form state interface
interface FormState {
  name: string;
  email: string;
  message: string;
}

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPTimeline>();
  const [imageError, setImageError] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: ''
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    
    const timer = setTimeout(() => setIsLoading(false), 1500);

    // Preload hero image
    const img = new Image();
    img.src = heroBackgroundImage;
    img.onerror = () => setImageError(true);

    if (!isLoading) {
      const ctx = gsap.context(() => {
        // Hero section animations sequence
        const tl = gsap.timeline({
          defaults: { duration: 0.8, ease: 'power3.out' }
        });

        // Sequence all animations
        tl.from('.hero-background', {
          opacity: 0,
          duration: 1
        })
        .from('.hero-title', {
          opacity: 0,
          y: 50,
          duration: 0.8
        }, '-=0.3')
        .from('.hero-name', {
          opacity: 0,
          scale: 1.2,
          duration: 0.8
        }, '-=0.5')
        .from('.hero-role', {
          opacity: 0,
          y: 30,
        }, '-=0.4')
        .from('.hero-tech-stack span', {
          opacity: 0,
          y: 20,
          stagger: 0.1,
        }, '-=0.2')
        .from('.hero-description', {
          opacity: 0,
          y: 30,
        }, '-=0.2')
        .from('.hero-highlights span', {
          opacity: 0,
          y: 20,
          stagger: 0.1,
        }, '-=0.2')
        .from('.hero-buttons', {
          opacity: 0,
          y: 30,
        }, '-=0.2')
        .from('.hero-button', {
          opacity: 0,
          x: -30,
          stagger: 0.2,
        }, '-=0.4')
        .from('.scroll-indicator', {
          opacity: 0,
          y: -20,
        }, '-=0.2');

        // Enhanced services section animations
        const servicesSection = servicesRef.current;
        if (servicesSection) {
          // Animate section title and subtitle
          const title = servicesSection.querySelector('h2');
          const subtitle = servicesSection.querySelector('p');
          
          if (title) {
            const text = title.textContent || '';
            title.innerHTML = '';
            text.split('').forEach((char, i) => {
              const span = document.createElement('span');
              span.textContent = char === ' ' ? '\u00A0' : char;
              span.style.opacity = '0';
              span.style.display = 'inline-block';
              title.appendChild(span);

              gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.03,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: title,
                  start: 'top center+=100',
                  toggleActions: 'play none none reverse'
                }
              });
            });
          }

          if (subtitle) {
            gsap.from(subtitle, {
              opacity: 0,
              y: 20,
              duration: 0.8,
              delay: 0.3,
              scrollTrigger: {
                trigger: subtitle,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
              }
            });
          }

          // Enhanced service card animations
          const serviceCards = servicesSection.querySelectorAll('.service-card');
          serviceCards.forEach((card, index) => {
            // Card entry animation
            gsap.to(card, {
              opacity: 1,
              x: 0,
              duration: 0.8,
              delay: index * 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
              }
            });

            // Animate card icon with bounce
            const icon = card.querySelector('.service-icon');
            gsap.from(icon, {
              scale: 0,
              rotate: -180,
              duration: 0.8,
              delay: index * 0.2 + 0.3,
              ease: 'elastic.out(1, 0.5)',
              scrollTrigger: {
                trigger: card,
                start: 'top center+=150',
                toggleActions: 'play none none reverse'
              }
            });

            // Smooth feature animations
            const features = card.querySelectorAll('.feature-item');
            features.forEach((feature, featureIndex) => {
              gsap.to(feature, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.2 + featureIndex * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: feature,
                  start: 'top center+=150',
                  toggleActions: 'play none none reverse'
                }
              });
            });

            // Enhanced hover animation
            card.addEventListener('mouseenter', () => {
              gsap.to(card, {
                y: -10,
                scale: 1.02,
                rotateY: 5,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                duration: 0.4,
                ease: 'power2.out'
              });
            });

            card.addEventListener('mouseleave', () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                rotateY: 0,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                duration: 0.4,
                ease: 'power2.inOut'
              });
            });
          });
        }

        // About section animations
        const aboutSection = aboutRef.current;
        if (aboutSection) {
          // Animate about section entrance
          gsap.from(aboutSection.querySelector('.about-content'), {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
              trigger: aboutSection,
              start: 'top center+=100',
              end: 'center center',
              toggleActions: 'play none none reverse'
            }
          });

          // Animate section title with split text effect
          const title = aboutSection.querySelector('h2');
          if (title) {
            const text = title.textContent || '';
            title.innerHTML = '';
            text.split('').forEach((char, i) => {
              const span = document.createElement('span');
              span.textContent = char;
              span.style.opacity = '0';
              span.style.display = 'inline-block';
              title.appendChild(span);

              gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.05,
                scrollTrigger: {
                  trigger: title,
                  start: 'top center+=100',
                  toggleActions: 'play none none reverse'
                }
              });
            });
          }

          // Animate skill cards
          const skillCards = aboutSection.querySelectorAll('.skill-card');
          skillCards.forEach((card, index) => {
            // Card entry animation
            gsap.from(card, {
              opacity: 0,
              y: 30,
              rotateX: -15,
              duration: 0.8,
              delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
                start: 'top center+=150',
                toggleActions: 'play none none reverse'
              }
            });

            // Animate progress bars
            const progressBars = card.querySelectorAll('.skill-bar');
            progressBars.forEach((bar) => {
              const width = bar.style.width;
              gsap.set(bar, { width: 0 });
              
              gsap.to(bar, {
                width: width,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: bar,
                  start: 'top center+=200',
                  toggleActions: 'play none none reverse'
                }
              });
            });
          });
        }

        // Contact section animations
        const contactSection = contactRef.current;
        if (contactSection) {
          // Animate section title
          const title = contactSection.querySelector('h2');
          if (title) {
            gsap.from(title, {
              opacity: 0,
              y: 30,
              duration: 0.8,
              scrollTrigger: {
                trigger: title,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
              }
            });
          }

          // Animate form containers with stagger
          const formContainers = contactSection.querySelectorAll('form > div');
          gsap.from(formContainers, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contactSection.querySelector('form'),
              start: 'top center+=100',
              toggleActions: 'play none none reverse'
            }
          });

          // Animate submit button
          const submitButton = contactSection.querySelector('button[type="submit"]');
          if (submitButton) {
            gsap.from(submitButton, {
              opacity: 0,
              y: 20,
              scale: 0.95,
              duration: 0.6,
              delay: 0.6,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: submitButton,
                start: 'top center+=150',
                toggleActions: 'play none none reverse'
              }
            });
          }

          // Add focus animations for form fields
          const formFields = contactSection.querySelectorAll('input, textarea');
          formFields.forEach((field) => {
            if (field instanceof HTMLElement) {
              field.addEventListener('focus', () => {
                gsap.to(field, {
                  scale: 1.02,
                  borderColor: '#6366f1',
                  duration: 0.3,
                  ease: 'power2.out'
                });
              });

              field.addEventListener('blur', () => {
                gsap.to(field, {
                  scale: 1,
                  borderColor: '#374151',
                  duration: 0.3,
                  ease: 'power2.in'
                });
              });
            }
          });

          // Contact cards animations and hover effects
          const contactCards = contactSection.querySelectorAll('.contact-card-left, .contact-card-right');
          contactCards.forEach(card => {
            // Initial slide-in animation
            gsap.to(card, {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                end: 'top center',
                toggleActions: 'play none none reverse',
                scrub: false
              }
            });
          });

          // Animate social icons
          const socialIcons = contactSection.querySelectorAll('.contact-card a');
          socialIcons.forEach((icon, index) => {
            gsap.from(icon, {
              opacity: 0,
              scale: 0,
              duration: 0.5,
              delay: 0.8 + (index * 0.1),
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: icon,
                start: 'top center+=150',
                toggleActions: 'play none none reverse'
              }
            });

            // Add hover animation for social icons
            icon.addEventListener('mouseenter', () => {
              gsap.to(icon, {
                scale: 1.2,
                duration: 0.3,
                ease: 'back.out(1.7)'
              });
            });

            icon.addEventListener('mouseleave', () => {
              gsap.to(icon, {
                scale: 1,
                duration: 0.3,
                ease: 'back.in(1.7)'
              });
            });
          });
        }

        // Enhanced hover animations for all cards
        const allCards = document.querySelectorAll('.service-card, .skill-card, .contact-card');
        allCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              rotateY: 5,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              duration: 0.4,
              ease: 'power2.out'
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotateY: 0,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              duration: 0.4,
              ease: 'power2.inOut'
            });
          });
        });

        // Add floating animation to icons
        const icons = document.querySelectorAll('.service-icon, .skill-card .p-2');
        icons.forEach(icon => {
          gsap.to(icon, {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          });
        });

        // Add pulse animation to skill bars
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
          gsap.to(bar, {
            scale: 1.02,
          duration: 1,
          repeat: -1,
          yoyo: true,
            ease: 'power1.inOut'
          });
        });

        // Add shine effect to buttons
        const buttons = document.querySelectorAll('button, a.bg-indigo-600');
        buttons.forEach(button => {
          button.addEventListener('mouseenter', () => {
            gsap.to(button, {
              background: 'linear-gradient(45deg, #4f46e5, #6366f1)',
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out'
            });
          });

          button.addEventListener('mouseleave', () => {
            gsap.to(button, {
              background: '#4f46e5',
              scale: 1,
              duration: 0.3,
              ease: 'power2.in'
            });
          });
        });
      });

      return () => {
        ctx.revert();
        tl.current?.kill();
      };
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formState.name,
          from_email: formState.email,
          message: formState.message,
          to_name: 'Portfolio Owner',
          reply_to: formState.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        toast.success('Message sent successfully!', {
          duration: 3000,
          position: 'top-center',
          icon: '✅',
        });

        setFormState({
          name: '',
          email: '',
          message: ''
        });
      }
    } catch {
      toast.error('Failed to send message. Please try again.', {
        duration: 3000,
        position: 'top-center',
        icon: '❌',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative bg-white dark:bg-background-dark transition-colors duration-300">
      <ThemeToggle />
      {/* Hero Section with performance optimizations and error handling */}
      <div ref={heroRef} className="relative h-screen">
        <div className="hero-background absolute inset-0 origin-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/95 via-primary-light/10 to-gray-100/95 dark:from-gray-900/95 dark:via-indigo-900/95 dark:to-gray-900/95 z-10 transition-colors duration-300" />
          {!imageError ? (
            <img
              src={heroBackgroundImage}
              alt="Code Background"
              className="w-full h-full object-cover opacity-5 dark:opacity-40 transition-opacity duration-300"
              loading="eager"
              decoding="async"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300" />
          )}
        </div>

        <div className="hero-content relative z-20 h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-300">
              Hi, I'm
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-dark mx-3">
                RAJ
              </span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-10 transition-colors duration-300">
              Full Stack Developer
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto transition-colors duration-300">
              Transforming ideas into powerful web solutions with modern technologies
              and clean, efficient code. Specialized in building scalable applications
              with cutting-edge tech stacks.
            </p>

            {/* Highlight Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              
              <span className="text-sm text-primary-dark dark:text-primary-light">🌐 Web Development</span>
              
              <span className="text-sm text-primary-dark dark:text-primary-light">📱 Mobile Apps</span>
              
              <span className="text-sm text-primary-dark dark:text-primary-light">🤖 AI Integration</span>
              
              <span className="text-sm text-primary-dark dark:text-primary-light">🛒 E-commerce</span>
              
              <span className="text-sm text-primary-dark dark:text-primary-light">⚡ Process Automation</span>
              

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-primary-dark hover:bg-primary text-white rounded-lg font-medium transform hover:scale-105 transition-all inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                aria-label="View My Services"
              >
                View My Services
                <ChevronDown className="w-5 h-5" />
              </button>
              <a
                href="mailto:rajumgjobs@gmail.com"
                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transform hover:scale-105 transition-all w-full sm:w-auto text-center"
                aria-label="Contact Me"
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 dark:text-white z-20 will-change-transform flex flex-col items-center gap-2 transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-400">Scroll down to explore</p>
          <ChevronDown className="w-8 h-8" aria-hidden="true" />
        </div>
      </div>

      {/* Services Section */}
      <section ref={servicesRef} className="relative py-24 px-4 bg-gray-50 dark:bg-background-dark transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white text-center mb-4 transition-colors duration-300">
            Services We Offer
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-3xl mx-auto transition-colors duration-300">
            Transforming ideas into powerful digital experiences with cutting-edge technology
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card bg-white dark:bg-gray-800 rounded-xl p-6 transform transition-all duration-500 opacity-0 translate-x-[-50px]
                  shadow-lg hover:shadow-xl dark:shadow-gray-900/30
                  border border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="service-icon p-3 bg-primary-light/20 dark:bg-primary-dark/30 rounded-lg">
                    <div className="text-primary-dark dark:text-primary-light/90 transition-colors duration-300">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="feature-item flex items-center gap-2 text-gray-700 dark:text-gray-300 opacity-0 translate-x-[-20px] transition-colors duration-300"
                    >
                      <div className="w-1.5 h-1.5 bg-primary-light dark:bg-primary rounded-full transition-colors duration-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <div ref={aboutRef} className="relative min-h-screen bg-white dark:bg-background-dark py-24 overflow-hidden transition-colors duration-300">
        <div className="about-content relative container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">About Me</h2>
              <h3 className="text-2xl font-semibold text-primary-dark dark:text-primary-light mb-4 transition-colors duration-300">RAJ</h3>
              <div className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                <a href="mailto:rajumgjobs@gmail.com" 
                   className="hover:text-primary-dark dark:hover:text-primary-light transition-colors">
                  rajumgjobs@gmail.com
                </a>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-colors duration-300">
                Full-stack developer with expertise in web, mobile, and AI technologies. 
                Passionate about creating innovative solutions that combine beautiful interfaces 
                with powerful functionality. Specialized in building scalable applications 
                with modern tech stacks and best practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skillGroup, index) => (
                <div
                  key={index}
                  className="skill-card bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg dark:shadow-gray-900/30 
                    border border-gray-200 dark:border-gray-700/50 transform hover:scale-[1.02] 
                    transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-light/10 dark:bg-primary-dark rounded-lg">
                      <div className="text-primary-dark dark:text-primary-light transition-colors duration-300">
                        {skillGroup.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                      {skillGroup.category}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <div key={skillIndex}>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-300">
                          <div
                            className="skill-bar h-full bg-gradient-to-r from-primary-light to-primary dark:from-primary-dark dark:to-primary rounded-full transition-colors duration-300"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="skill-card bg-gray-50 dark:bg-gray-800 rounded-xl p-8 
                border border-gray-200 dark:border-gray-700/50 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary-dark dark:text-primary-light transition-colors duration-300">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    Modern Development
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Leveraging cutting-edge technologies and frameworks to build robust, 
                  scalable applications. From responsive web apps to native mobile 
                  experiences and AI integrations.
                </p>
              </div>

              <div className="skill-card bg-gray-50 dark:bg-gray-800 rounded-xl p-8
                border border-gray-200 dark:border-gray-700/50 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary-dark dark:text-primary-light transition-colors duration-300">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    Innovation Focus
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Combining traditional development with modern AI capabilities to create 
                  intelligent, automated solutions that solve real-world problems efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="min-h-screen bg-gray-50 dark:bg-background-dark py-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden transition-colors duration-300" 
        ref={contactRef}
      >
        <Toaster />
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-colors duration-300">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg dark:shadow-gray-900/30 
              transform transition-all duration-500 opacity-0 translate-x-[-100px] contact-card-left
              border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                Send me a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    placeholder="Your Message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-primary-dark hover:bg-primary text-white rounded-lg font-medium 
                    transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* WhatsApp QR Code */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg dark:shadow-gray-900/30 
              transform transition-all duration-500 opacity-0 translate-x-[100px] contact-card-right
              border border-gray-200 dark:border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                Connect on WhatsApp
              </h3>
              <img src="/whatsapp_qr.svg" alt="WhatsApp QR Code" className="mx-auto w-48 h-48 mb-4 
                dark:invert dark:brightness-90 transition-all duration-300" />
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Scan the QR code to chat with me on WhatsApp
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex justify-center space-x-6">
            <a 
              href="http://t.me/rajumg132" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
            >
              <MessageCircle className="w-8 h-8" />
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
            >
              <Linkedin className="w-8 h-8" />
            </a>
            <a 
              href="https://x.com/raj132_official" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
            >
              <Twitter className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-dark hover:bg-primary text-white rounded-full p-4 
          shadow-lg transition-all duration-300 z-50 flex items-center gap-2 transform hover:scale-105"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="hidden sm:inline">Chat with AI</span>
      </button>

      {/* Chat Interface */}
      {isChatOpen && <AiChat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Home; 