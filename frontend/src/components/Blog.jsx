import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCalendar, FiUser, FiTag, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const Blog = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/blog')
      .then(res => setPosts(res.data))
      .catch(() => setPosts(demoPosts))
      .finally(() => setLoading(false));
  }, []);

  const demoPosts = [
    {
      _id: 1,
      title: "Building Real-Time Apps with Socket.io and React",
      excerpt: "Learn how to create interactive real-time applications using Socket.io and React hooks...",
      image: "https://via.placeholder.com/600x300/667eea/ffffff?text=Socket.io",
      tags: ["WebSockets", "React", "Node.js"],
      createdAt: new Date(),
      views: 234
    },
    {
      _id: 2,
      title: "JWT Authentication Best Practices",
      excerpt: "Secure your Node.js applications with JSON Web Tokens. Learn about refresh tokens, blacklisting, and security...",
      image: "https://via.placeholder.com/600x300/764ba2/ffffff?text=JWT",
      tags: ["Authentication", "Security", "Node.js"],
      createdAt: new Date(),
      views: 189
    },
    {
      _id: 3,
      title: "Mastering Tailwind CSS v4",
      excerpt: "Explore the new features in Tailwind CSS v4 including the Vite plugin and improved performance...",
      image: "https://via.placeholder.com/600x300/ec4899/ffffff?text=Tailwind",
      tags: ["CSS", "Tailwind", "Frontend"],
      createdAt: new Date(),
      views: 156
    },
  ];

  return (
    <section id="Blog" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Latest Articles</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Sharing knowledge and experiences from my development journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass-card overflow-hidden group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-black/50 backdrop-blur rounded text-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser size={14} /> Admin
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-purple-600 transition">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <button className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <FiArrowRight />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;