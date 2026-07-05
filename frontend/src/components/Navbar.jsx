import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiSun, FiMoon, FiCode, FiLayout } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');

  // 👇 Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('adminToken');

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setIsDark(saved);
    if (saved) document.documentElement.classList.add('dark');

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['Home', 'About', 'Projects', 'Skills', 'Blog', 'Contact'];
      const scrollPos = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !isDark);
  };

  const navItems = [
    { name: 'Home', id: 'Home' },
    { name: 'About', id: 'About' },
    { name: 'Projects', id: 'Projects' },
    { name: 'Skills', id: 'Skills' },
    { name: 'Blog', id: 'Blog' },
    { name: 'Contact', id: 'Contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled ? 'glass-card py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <ScrollLink to="Home" smooth offset={-70} className="cursor-pointer group">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiCode className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Jonah Kiplimo
                </span>
              </div>
            </ScrollLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <ScrollLink
                  key={item.name}
                  to={item.id}
                  smooth
                  offset={-70}
                  className={`cursor-pointer transition-all duration-300 relative ${
                    activeSection === item.id
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </ScrollLink>
              ))}

              {/* 👇 DASHBOARD LINK - Smart conditional navigation */}
              <RouterLink
                to={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition"
              >
                <FiLayout size={16} />
                {isLoggedIn ? "Dashboard" : "Login"}
              </RouterLink>
              
              <button
                onClick={toggleDark}
                className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm hover:scale-110 transition-transform"
              >
                {isDark ? <FiSun className="text-yellow-500" /> : <FiMoon className="text-gray-700" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg glass-card"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden glass-card mt-3 mx-4 overflow-hidden"
            >
              <div className="py-4 flex flex-col items-center gap-4">
                {navItems.map((item) => (
                  <ScrollLink
                    key={item.name}
                    to={item.id}
                    smooth
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                    className={`cursor-pointer px-4 py-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {item.name}
                  </ScrollLink>
                ))}
                
                {/* 👇 DASHBOARD LINK - Mobile version */}
                <RouterLink
                  to={isLoggedIn ? "/admin/dashboard" : "/admin/login"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white w-full justify-center"
                >
                  <FiLayout size={16} /> {isLoggedIn ? "Dashboard" : "Login"}
                </RouterLink>
                
                <button
                  onClick={toggleDark}
                  className="p-2 rounded-lg bg-gray-200/50 dark:bg-gray-700/50"
                >
                  {isDark ? <FiSun /> : <FiMoon />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;