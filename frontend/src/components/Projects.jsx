import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiCode, FiEye } from 'react-icons/fi';
import axios from 'axios';

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects from backend or use demo data
    axios.get('/api/projects')
      .then(res => setProjects(res.data))
      .catch(() => setProjects(demoProjects))
      .finally(() => setLoading(false));
  }, []);

  const demoProjects = [
    {
      _id: 1,
      title: "TaskFlow - Project Management",
      description: "Real-time task management app with WebSockets, JWT auth, and MongoDB. Features drag-drop tasks, team collaboration, and real-time updates.",
      fullDescription: "TaskFlow is a comprehensive project management tool that helps teams organize tasks, track progress, and collaborate in real-time. Built with the MERN stack and Socket.io for instant updates.",
      image: "https://via.placeholder.com/600x400/667eea/ffffff?text=TaskFlow",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind", "JWT"],
      githubUrl: "https://github.com/JONAHKIPKORIR/taskflow",
      liveUrl: "https://taskflow-demo.onrender.com",
      category: "fullstack",
      featured: true
    },
    {
      _id: 2,
      title: "URL Shortener API",
      description: "Production-ready URL shortener with analytics, click tracking, and custom short codes. Includes rate limiting and caching.",
      fullDescription: "A high-performance URL shortening service that generates unique codes, tracks click analytics, and provides detailed statistics. Built with Node.js, Express, and MongoDB.",
      image: "https://via.placeholder.com/600x400/764ba2/ffffff?text=URL+Shortener",
      techStack: ["Node.js", "Express", "MongoDB", "Redis", "JWT"],
      githubUrl: "https://github.com/JONAHKIPKORIR/url-shortener",
      liveUrl: "https://url-shortener-mny6.onrender.com",
      category: "backend",
      featured: true
    },
    {
      _id: 3,
      title: "E-Commerce Platform",
      description: "Full-featured e-commerce platform with cart, payments, and admin dashboard.",
      fullDescription: "Complete e-commerce solution with product management, shopping cart, Stripe integration, order tracking, and admin panel.",
      image: "https://via.placeholder.com/600x400/ec4899/ffffff?text=E-Commerce",
      techStack: ["React", "Node.js", "Stripe", "MongoDB", "Redux"],
      githubUrl: "#",
      liveUrl: "#",
      category: "fullstack",
      featured: false
    },
  ];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="Projects" className="py-20 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Featured Projects</h2>
          
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  filter === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'glass-card text-gray-600 dark:text-gray-300 hover:scale-105'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition"
                    >
                      <FiGithub className="text-white" />
                    </a>
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition"
                      >
                        <FiExternalLink className="text-white" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{project.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View Details Button */}
                  <button className="text-purple-600 dark:text-purple-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    <FiEye /> View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{selectedProject.title}</h2>
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full rounded-lg mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedProject.fullDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.techStack.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={selectedProject.githubUrl} target="_blank" className="btn-primary inline-flex items-center gap-2">
                    <FiGithub /> View Code
                  </a>
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" className="btn-secondary inline-flex items-center gap-2">
                      <FiExternalLink /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;