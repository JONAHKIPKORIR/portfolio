import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiDownload, FiChevronDown } from 'react-icons/fi';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {
  return (
    <section id="Home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-6 shadow-2xl"
          >
            <span className="text-5xl animate-float">👨‍💻</span>
          </motion.div>
          
          {/* Animated Name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              Jonah Kiplimo
            </span>
          </motion.h1>
          
          {/* Typing Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 h-12"
          >
            <TypeAnimation
              sequence={[
                'Full-Stack Developer',
                2000,
                'React & Node.js Specialist',
                2000,
                'Problem Solver',
                2000,
                'Tech Enthusiast',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-lg"
          >
            Building scalable web applications with modern technologies. 
            Experienced in MERN stack, real-time apps, and cloud deployment.
            Let's bring your ideas to life!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link to="Contact" smooth className="btn-primary cursor-pointer">
              Hire Me
            </Link>
            <a href="/resume.pdf" download className="btn-secondary inline-flex items-center gap-2">
              <FiDownload /> Download Resume
            </a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-6 mb-16"
          >
            {[
              { icon: FiGithub, href: "https://github.com/JONAHKIPKORIR", label: "GitHub" },
              { icon: FiLinkedin, href: "#", label: "LinkedIn" },
              { icon: FiTwitter, href: "#", label: "Twitter" },
              { icon: FiMail, href: "mailto:jonahkiplimo8@gmail.com", label: "Email" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all text-2xl"
              >
                <social.icon />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <Link to="About" smooth className="cursor-pointer">
              <FiChevronDown className="text-gray-400 text-3xl hover:text-purple-600 transition" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;