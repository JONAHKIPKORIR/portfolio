import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiAward, FiUsers, FiCode, FiCoffee } from 'react-icons/fi';
import { Link } from 'react-scroll';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { icon: FiCode, value: '20+', label: 'Projects Completed', color: 'from-blue-500 to-cyan-500' },
    { icon: FiUsers, value: '10+', label: 'Happy Clients', color: 'from-green-500 to-emerald-500' },
    { icon: FiAward, value: '5+', label: 'Certifications', color: 'from-yellow-500 to-orange-500' },
    { icon: FiCoffee, value: '1000+', label: 'Coffee Cups', color: 'from-red-500 to-pink-500' },
  ];

  return (
    <section id="About" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed"
              >
                I'm a passionate Full-Stack Developer with a focus on building exceptional digital experiences. 
                With a strong foundation in modern web technologies, I help businesses transform their ideas 
                into powerful web applications.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                My journey in web development started with WordPress, and over time I've evolved into a 
                full-stack JavaScript developer. I specialize in React.js for frontend and Node.js for backend, 
                creating seamless, scalable, and performant applications.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link to="Contact" smooth className="btn-primary">Get In Touch</Link>
                <a href="/resume.pdf" download className="btn-secondary">View Resume</a>
              </motion.div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card p-6 text-center group hover:scale-105 transition-transform"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-3 group-hover:animate-float`}>
                    <stat.icon className="text-white text-2xl" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent" 
                       style={{ backgroundImage: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;