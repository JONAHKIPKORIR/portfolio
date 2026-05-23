import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, FiFileText, FiMail, FiEye, FiPlus, FiEdit2, FiTrash2, 
  FiRefreshCw, FiLogOut, FiGrid, FiStar, FiTrendingUp,
  FiMessageCircle, FiCheckCircle, FiUser, FiCalendar, FiSave, FiX
} from 'react-icons/fi';
import axios from 'axios';  // ← ADD THIS IMPORT
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ projects: 0, blogPosts: 0, messages: 0, unreadMessages: 0 });
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', fullDescription: '', image: '',
    techStack: [], githubUrl: '', liveUrl: '', category: 'fullstack', featured: false
  });

  const token = localStorage.getItem('adminToken');
  
  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // Create axios instance with auth header
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) setAdmin(JSON.parse(adminData));
    if (!token) window.location.href = '/admin/login';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, projectsRes, postsRes, messagesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/projects'),
        api.get('/admin/blog'),
        api.get('/admin/messages')
      ]);
      setStats(statsRes.data.data);
      setProjects(projectsRes.data.data);
      setPosts(postsRes.data.data);
      setMessages(messagesRes.data.data);
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      toast.success('Deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/admin/projects/${editingItem._id}`, formData);
        toast.success('Project updated');
      } else {
        await api.post('/admin/projects', formData);
        toast.success('Project created');
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', fullDescription: '', image: '', techStack: [], githubUrl: '', liveUrl: '', category: 'fullstack', featured: false });
      loadData();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/read`);
      loadData();
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = '/admin/login';
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold dark:text-white">{value}</p>
          {trend && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><FiTrendingUp /> +12% from last month</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'stats', label: 'Overview', icon: FiGrid, color: 'from-purple-500 to-pink-500' },
    { id: 'projects', label: 'Projects', icon: FiFolder, color: 'from-blue-500 to-cyan-500' },
    { id: 'blog', label: 'Blog Posts', icon: FiFileText, color: 'from-green-500 to-emerald-500' },
    { id: 'messages', label: 'Messages', icon: FiMail, color: 'from-orange-500 to-red-500' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 glass-card rounded-none border-l-0 border-t-0 border-b-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <FiGrid className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-xl dark:text-white">TaskFlow CMS</h1>
              <p className="text-xs text-gray-500">Content Management</p>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {tab.id === 'messages' && stats.unreadMessages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.unreadMessages}</span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="glass-card p-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <FiUser className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold dark:text-white text-sm">{admin?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{admin?.email || 'admin@portfolio.com'}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio content</p>
          </div>
          <button onClick={loadData} className="btn-secondary">
            <FiRefreshCw className="inline mr-2" /> Refresh
          </button>
        </div>

        {/* Stats Overview */}
        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={FiFolder} label="Total Projects" value={stats.projects} color="from-blue-500 to-cyan-500" trend />
              <StatCard icon={FiFileText} label="Blog Posts" value={stats.blogPosts} color="from-green-500 to-emerald-500" />
              <StatCard icon={FiMail} label="Messages" value={stats.messages} color="from-orange-500 to-red-500" />
              <StatCard icon={FiEye} label="Unread Messages" value={stats.unreadMessages} color="from-purple-500 to-pink-500" />
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Activity</h2>
              <div className="space-y-3">
                {projects.slice(0, 5).map(project => (
                  <div key={project._id} className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <FiFolder className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">{project.title}</p>
                        <p className="text-xs text-gray-500">Added {new Date(project.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Projects Manager */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => { setEditingItem(null); setFormData({ title: '', description: '', fullDescription: '', image: '', techStack: [], githubUrl: '', liveUrl: '', category: 'fullstack', featured: false }); setShowModal(true); }} className="btn-primary mb-6">
              <FiPlus className="inline mr-2" /> Add New Project
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map(project => (
                <motion.div key={project._id} whileHover={{ y: -5 }} className="glass-card p-5 group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg dark:text-white">{project.title}</h3>
                    {project.featured && <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full flex items-center gap-1"><FiStar className="w-3 h-3" /> Featured</span>}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.slice(0, 3).map(tech => <span key={tech} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded-full">{tech}</span>)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(project); setFormData(project); setShowModal(true); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"><FiEdit2 /></button>
                    <button onClick={() => handleDelete('projects', project._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"><FiTrash2 /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages Panel */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {messages.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet</p>
              </div>
            ) : (
              messages.map(msg => (
                <motion.div key={msg._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`glass-card p-5 ${!msg.read ? 'border-l-4 border-l-purple-500' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                          <FiUser className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold dark:text-white">{msg.name}</h3>
                          <p className="text-sm text-gray-500">{msg.email}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-auto">
                          {!msg.read && <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-600 rounded-full">New</span>}
                          <FiCalendar className="text-gray-400 text-sm" />
                          <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">{msg.message}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!msg.read && <button onClick={() => markAsRead(msg._id)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition"><FiCheckCircle /></button>}
                      <button onClick={() => handleDelete('messages', msg._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"><FiTrash2 /></button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-white">{editingItem ? 'Edit Project' : 'Create New Project'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FiX /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-primary" placeholder="Project Title" required />
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-primary">
                    <option value="fullstack">Full Stack</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                  </select>
                </div>
                
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-primary" rows="2" placeholder="Short Description (max 100 chars)" required />
                <textarea value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} className="input-primary" rows="4" placeholder="Full Description" required />
                
                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="input-primary" placeholder="Image URL" required />
                
                <input type="text" value={formData.techStack.join(', ')} onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map(s => s.trim()) })} className="input-primary" placeholder="Tech Stack (comma separated: React, Node.js, MongoDB)" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="input-primary" placeholder="GitHub URL" required />
                  <input type="text" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="input-primary" placeholder="Live Demo URL" />
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" />
                  <span className="text-gray-700 dark:text-gray-300">Feature this project (show on homepage)</span>
                </label>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary flex items-center gap-2"><FiSave /> {editingItem ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;