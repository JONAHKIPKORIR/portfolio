import { motion } from 'framer-motion';
import { FiHeart, FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowUp } from 'react-icons/fi';
import { Link } from 'react-scroll';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative glass-card mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Jonah Kiplimo
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Building scalable web applications with modern technologies. 
              Let's create something amazing together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Skills', 'Blog', 'Contact'].map(item => (
                <li key={item}>
                  <Link to={item} smooth offset={-70} className="text-gray-500 hover:text-purple-600 cursor-pointer transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Connect</h4>
            <div className="flex gap-4">
              {[
                { icon: FiGithub, href: "https://github.com/JONAHKIPKORIR", label: "GitHub" },
                { icon: FiLinkedin, href: "#", label: "LinkedIn" },
                { icon: FiTwitter, href: "#", label: "Twitter" },
                { icon: FiMail, href: "mailto:jonahkiplimo8@gmail.com", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all hover:scale-110"
                >
                  <social.icon className="text-gray-600 dark:text-gray-300 hover:text-white transition" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
            Made with <FiHeart className="text-red-500 animate-pulse" /> by Jonah Kiplimo © {currentYear}
          </p>
          
          <Link to="Home" smooth className="cursor-pointer">
            <motion.button
              whileHover={{ y: -5 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center hover:shadow-lg transition"
            >
              <FiArrowUp className="text-white" />
            </motion.button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;