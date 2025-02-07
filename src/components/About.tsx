import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Database, Layout, Terminal, Smartphone, Brain, Cog } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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
    icon: <Cog className="w-6 h-6" />,
    items: [
      { name: 'CI/CD', level: 86 },
      { name: 'Docker/Kubernetes', level: 83 },
      { name: 'Git/Version Control', level: 90 }
    ]
  }
];

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section entrance
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center+=100',
          end: 'top center-=100',
          toggleActions: 'play none none reverse'
        }
      });

      // Animate skill bars
      const skillBars = document.querySelectorAll('.skill-bar');
      skillBars.forEach((bar) => {
        gsap.from(bar, {
          width: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top center+=200',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Create floating background elements
      const grid = gridRef.current;
      if (grid) {
        for (let i = 0; i < 50; i++) {
          const dot = document.createElement('div');
          dot.className = 'absolute w-1 h-1 bg-indigo-500 rounded-full opacity-20';
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          dot.style.left = `${x}%`;
          dot.style.top = `${y}%`;
          grid.appendChild(dot);

          gsap.to(dot, {
            x: 'random(-20, 20)',
            y: 'random(-20, 20)',
            duration: 'random(3, 5)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-900 py-24 overflow-hidden">
      {/* Animated background grid */}
      <div ref={gridRef} className="absolute inset-0 overflow-hidden" />
      
      <div ref={sectionRef} className="relative container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
            <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Raju Guruvannavar</h3>
            <div className="text-lg text-gray-300 mb-6">
              <a href="mailto:rajumgjobs@gmail.com" className="hover:text-indigo-400 transition-colors">
                rajumgjobs@gmail.com
              </a>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
                className="skill-card bg-gray-800 rounded-xl p-6 shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    {skillGroup.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {skillGroup.category}
                  </h3>
                </div>

                <div className="space-y-6">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <div key={skillIndex}>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="skill-bar h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
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
            <div className="skill-card bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-semibold text-white">Modern Development</h3>
              </div>
              <p className="text-gray-400">
                Leveraging cutting-edge technologies and frameworks to build robust, 
                scalable applications. From responsive web apps to native mobile 
                experiences and AI integrations.
              </p>
            </div>

            <div className="skill-card bg-gray-800 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-indigo-500" />
                <h3 className="text-xl font-semibold text-white">Innovation Focus</h3>
              </div>
              <p className="text-gray-400">
                Combining traditional development with modern AI capabilities to create 
                intelligent, automated solutions that solve real-world problems efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;