import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, FiFileText, FiMail, FiEye, FiPlus, FiEdit2, FiTrash2, 
  FiRefreshCw, FiLogOut, FiGrid, FiStar, FiTrendingUp,
  FiMessageCircle, FiCheckCircle, FiUser, FiCalendar,
  FiSave, FiX, FiUsers, FiShield, FiUserPlus, FiUserMinus,
  FiSettings, FiDownload, FiCopy, FiUploadCloud
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

// ============================================
// IMAGE UPLOADER COMPONENT
// ============================================
const ImageUploader = ({ currentImage, onUpload, onRemove }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${API_URL}/admin/upload`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
            if (res.data.success) {
                // Build the full URL for preview
                const fullUrl = `${API_URL.replace('/api', '')}${res.data.url}`;
                onUpload(fullUrl);
                toast.success('Image uploaded successfully!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Project Image</label>
            <div className="flex items-center gap-4">
                {currentImage && (
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            type="button" 
                            onClick={onRemove} 
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                        >
                            <FiX size={12} />
                        </button>
                    </div>
                )}
                <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()} 
                    disabled={uploading} 
                    className="btn-secondary flex items-center gap-2 text-sm py-2"
                >
                    <FiUploadCloud /> {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </div>
            <p className="text-xs text-gray-400">Or paste an image URL below</p>
            <input 
                type="text" 
                value={currentImage} 
                onChange={(e) => onUpload(e.target.value)} 
                className="input-primary" 
                placeholder="https://example.com/image.jpg" 
            />
        </div>
    );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const AdminDashboard = () => {
  const [stats, setStats] = useState({ projects: 0, blogPosts: 0, messages: 0, unreadMessages: 0, totalAdmins: 0, isSuperAdmin: false });
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  
  // UPDATED: formData includes status
  const [formData, setFormData] = useState({
    title: '', description: '', fullDescription: '', image: '',
    techStack: [], githubUrl: '', liveUrl: '', category: 'fullstack', 
    featured: false, status: 'published'
  });

  const token = localStorage.getItem('adminToken');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  // ============================================
  // PROJECT TEMPLATES (Including Vanilla JS)
  // ============================================
  const projectTemplates = [
    // --- Full Stack Projects ---
    {
      title: "URL Shortener API",
      description: "Production-ready URL shortener with analytics, click tracking, and custom short codes.",
      fullDescription: "A high-performance URL shortening service that generates unique codes, tracks click analytics, and provides detailed statistics. Built with Node.js, Express, and MongoDB.",
      image: "https://via.placeholder.com/600x400/764ba2/ffffff?text=URL+Shortener",
      techStack: ["Node.js", "Express", "MongoDB", "Redis", "JWT"],
      githubUrl: "https://github.com/JONAHKIPKORIR/url-shortener",
      liveUrl: "https://url-shortener-mny6.onrender.com",
      category: "backend",
      featured: true,
      status: "published"
    },
    {
      title: "TaskFlow - Real-time PM Tool",
      description: "Real-time task management with WebSockets, JWT auth, and MongoDB.",
      fullDescription: "TaskFlow is a comprehensive project management tool that helps teams organize tasks, track progress, and collaborate in real-time. Built with the MERN stack and Socket.io for instant updates.",
      image: "https://via.placeholder.com/600x400/667eea/ffffff?text=TaskFlow",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind", "JWT"],
      githubUrl: "https://github.com/JONAHKIPKORIR/taskflow",
      liveUrl: "https://taskflow-demo.onrender.com",
      category: "fullstack",
      featured: true,
      status: "published"
    },
    {
      title: "PipForge",
      description: "Free professional forex trading tools — pip calculators, position sizing, risk management, and a trading journal.",
      fullDescription: "PipForge is a full-stack forex trading tools platform offering 10+ free calculators including pip value, position size, margin, risk/reward, profit/loss, lot size, compound growth, pivot points, drawdown, and Fibonacci retracement. It features a free trading journal with Supabase authentication, trade logging with emotion tagging, P&L auto-calculation, performance statistics, and cumulative P&L charting. Built with a monetization strategy combining Google AdSense, broker affiliate programs, and a future freemium SaaS tier.",
      image: "https://via.placeholder.com/600x400/16a34a/ffffff?text=PipForge",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS v4", "Supabase", "PostgreSQL", "Recharts", "Vercel"],
      githubUrl: "https://github.com/JONAHKIPKORIR/pipforge",
      liveUrl: "https://pipforge-tau.vercel.app/",
      category: "fullstack",
      featured: true,
      status: "published"
    },
    {
      title: "Flux — Fintech Dashboard Kit",
      description: "A React + TypeScript + Tailwind CSS v4 UI kit with 15 production-ready components for fintech and SaaS dashboards.",
      fullDescription: "Flux is a commercial fintech dashboard component kit built with React, TypeScript, and Tailwind CSS v4. It includes a full auth flow (login, signup, OTP, forgot password), a dashboard shell with responsive sidebar, stat cards, and a typed data table, plus wallet components including a balance widget, transaction list, and top-up card. Every component is theme-aware with real light and dark mode driven by a single CSS token file.",
      image: "https://via.placeholder.com/600x400/1e293b/ffffff?text=Flux+Kit",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      githubUrl: "https://github.com/JONAHKIPKORIR/flux-kit",
      liveUrl: "https://flux-kit.vercel.app/",
      category: "frontend",
      featured: true,
      status: "published"
    },
    {
      title: "PesaTools — Kenyan Financial Tools",
      description: "Free Kenya-specific financial tools including a verified 2026 PAYE calculator, loan comparator, and PDF invoice generator.",
      fullDescription: "PesaTools is a full-stack Next.js financial tools platform built specifically for Kenyan professionals and SMEs. It features a PAYE calculator verified against real KRA 2026 tax bands (SHIF at 2.75% replacing NHIF, NSSF Phase 4 at 6%, Housing Levy at 1.5%), a loan comparator with reducing-balance calculations across 8 Kenyan lenders, a browser-side PDF invoice generator using jsPDF, and a programmatic SEO engine that auto-generates 47 county-specific loan pages. The platform also includes a 10-article MDX blog system, a rent affordability calculator, and all pages required for Google AdSense approval.",
      image: "https://via.placeholder.com/600x400/0a3d30/ffffff?text=PesaTools",
      techStack: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "MDX", "jsPDF", "Vercel"],
      githubUrl: "https://github.com/JONAHKIPKORIR/pesatools",
      liveUrl: "https://pesatools-nu.vercel.app",
      category: "fullstack",
      featured: true,
      status: "published"
    },
    // --- Vanilla JS Mini Projects ---
    {
      title: "Tip Calculator",
      description: "A simple tip calculator built with HTML, CSS, and Vanilla JavaScript.",
      fullDescription: "A pure Vanilla JS project demonstrating DOM manipulation, event listeners, and basic arithmetic logic. Perfect for showcasing core JavaScript fundamentals without any framework.",
      image: "https://via.placeholder.com/600x400/16a34a/ffffff?text=Tip+Calculator",
      techStack: ["HTML5", "CSS3", "JavaScript", "DOM Manipulation"],
      githubUrl: "https://github.com/JONAHKIPKORIR/100-js-projects/tree/main/01-tip-calculator",
      liveUrl: "https://100-js-projects.vercel.app/01-tip-calculator",
      category: "vanilla-js",
      featured: false,
      status: "published"
    },
    {
      title: "Pomodoro Timer",
      description: "A Pomodoro timer using Vanilla JS with LocalStorage persistence.",
      fullDescription: "A productivity timer built with Vanilla JS. It uses setInterval/clearInterval for timing and LocalStorage to persist state between sessions. A great example of managing state and timers without a framework.",
      image: "https://via.placeholder.com/600x400/dc2626/ffffff?text=Pomodoro+Timer",
      techStack: ["HTML5", "CSS3", "JavaScript", "LocalStorage", "setInterval"],
      githubUrl: "https://github.com/JONAHKIPKORIR/100-js-projects/tree/main/02-pomodoro",
      liveUrl: "https://100-js-projects.vercel.app/02-pomodoro",
      category: "vanilla-js",
      featured: false,
      status: "published"
    },
    {
      title: "Recipe Book App",
      description: "A dynamic recipe search app that consumes a third-party API using fetch and async/await.",
      fullDescription: "A Vanilla JS application that fetches recipes from TheMealDB API. It handles asynchronous data fetching, error states, dynamic rendering, and user search input without a framework. Demonstrates clean API integration using fetch and async/await.",
      image: "https://via.placeholder.com/600x400/1e40af/ffffff?text=Recipe+Book",
      techStack: ["HTML5", "CSS3", "JavaScript", "Fetch API", "async/await"],
      githubUrl: "https://github.com/JONAHKIPKORIR/100-js-projects/tree/main/03-recipe-book",
      liveUrl: "https://100-js-projects.vercel.app/03-recipe-book",
      category: "vanilla-js",
      featured: false,
      status: "published"
    },
    {
      title: "Rock Paper Scissors Game",
      description: "A classic Rock Paper Scissors game built with clean Vanilla JS conditional logic.",
      fullDescription: "A logic-heavy Vanilla JS game. Demonstrates clean conditional logic, event handling, score tracking, and randomized computer choices. A recruiter favorite for showing core programming fundamentals.",
      image: "https://via.placeholder.com/600x400/7c3aed/ffffff?text=Rock+Paper+Scissors",
      techStack: ["HTML5", "CSS3", "JavaScript", "Game Logic"],
      githubUrl: "https://github.com/JONAHKIPKORIR/100-js-projects/tree/main/04-rock-paper-scissors",
      liveUrl: "https://100-js-projects.vercel.app/04-rock-paper-scissors",
      category: "vanilla-js",
      featured: false,
      status: "published"
    },
    {
      title: "Testimonial Slider",
      description: "A smooth testimonial slider using setTimeout and setInterval for auto-rotation.",
      fullDescription: "A UI/Animation project built with Vanilla JS. Demonstrates timing functions (setTimeout, setInterval), state management, and dynamic DOM updates. No frameworks or libraries used.",
      image: "https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Testimonial+Slider",
      techStack: ["HTML5", "CSS3", "JavaScript", "setTimeout", "DOM Manipulation"],
      githubUrl: "https://github.com/JONAHKIPKORIR/100-js-projects/tree/main/05-testimonial-slider",
      liveUrl: "https://100-js-projects.vercel.app/05-testimonial-slider",
      category: "vanilla-js",
      featured: false,
      status: "published"
    }
  ];

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) setAdmin(JSON.parse(adminData));
    if (!token) window.location.href = '/admin/login';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, projectsRes, postsRes, messagesRes, adminsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/projects'),
        api.get('/admin/blog'),
        api.get('/admin/messages'),
        api.get('/admin/admins').catch(() => ({ data: { admins: [] } }))
      ]);
      setStats(statsRes.data.data);
      setProjects(projectsRes.data.data);
      setPosts(postsRes.data.data);
      setMessages(messagesRes.data.data);
      setAdmins(adminsRes.data.admins || []);
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
      setFormData({ title: '', description: '', fullDescription: '', image: '', techStack: [], githubUrl: '', liveUrl: '', category: 'fullstack', featured: false, status: 'published' });
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

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/admins', newAdmin);
      if (res.data.success) {
        toast.success('Admin created successfully!');
        setShowAdminModal(false);
        setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    try {
      await api.delete(`/admin/admins/${adminId}`);
      toast.success('Admin deleted successfully');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete admin');
    }
  };

  const handleQuickAddTemplate = (template) => {
    setFormData({
      title: template.title,
      description: template.description,
      fullDescription: template.fullDescription,
      image: template.image,
      techStack: template.techStack,
      githubUrl: template.githubUrl,
      liveUrl: template.liveUrl,
      category: template.category || 'fullstack',
      featured: template.featured || false,
      status: template.status || 'published'
    });
    setShowTemplateDropdown(false);
    setShowModal(true);
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 relative overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold dark:text-white">{value}</p>
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
    { id: 'admins', label: 'Admins', icon: FiUsers, color: 'from-indigo-500 to-purple-500' },
    { id: 'settings', label: 'Settings', icon: FiSettings, color: 'from-gray-500 to-gray-600' },
  ];

  const renderSettingsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold mb-6 dark:text-white">Settings</h2>
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">CV / Resume</h3>
        <p className="text-gray-500 text-sm mb-4">Upload your CV as a PDF file. This will be available for download on your portfolio.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('cv', file);
              try {
                toast.loading('Uploading CV...');
                await api.post('/admin/cv/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.dismiss();
                toast.success('CV uploaded successfully!');
                loadData();
              } catch (err) {
                toast.dismiss();
                toast.error(err.response?.data?.error || 'Upload failed');
              }
            }}
            className="input-primary"
          />
          <button onClick={() => window.open(`${API_URL.replace('/api','')}/api/admin/cv/download`, '_blank')} className="btn-secondary flex items-center gap-2">
            <FiDownload /> Download Current CV
          </button>
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => { setActiveTab('projects'); setShowModal(true); setEditingItem(null); }} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center hover:bg-purple-100 transition">
            <FiPlus className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Project</span>
          </button>
          <button onClick={() => { setActiveTab('blog'); setShowModal(true); setEditingItem(null); }} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center hover:bg-green-100 transition">
            <FiFileText className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Blog Post</span>
          </button>
          <button onClick={() => { setActiveTab('stats'); loadData(); }} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center hover:bg-blue-100 transition">
            <FiRefreshCw className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm font-medium">Refresh Data</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

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
      <aside className="fixed left-0 top-0 h-full w-72 glass-card rounded-none border-l-0 border-t-0 border-b-0 z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <FiGrid className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-xl dark:text-white">Portfolio CMS</h1>
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
                  activeTab === tab.id ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800'
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
                  {admin?.role && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600">
                      {admin.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-72 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio content</p>
          </div>
          <button onClick={loadData} className="btn-secondary">
            <FiRefreshCw className="inline mr-2" /> Refresh
          </button>
        </div>

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard icon={FiFolder} label="Total Projects" value={stats.projects} color="from-blue-500 to-cyan-500" />
              <StatCard icon={FiFileText} label="Blog Posts" value={stats.blogPosts} color="from-green-500 to-emerald-500" />
              <StatCard icon={FiMail} label="Messages" value={stats.messages} color="from-orange-500 to-red-500" />
              <StatCard icon={FiEye} label="Unread Messages" value={stats.unreadMessages} color="from-purple-500 to-pink-500" />
              {stats.isSuperAdmin && <StatCard icon={FiUsers} label="Admin Users" value={stats.totalAdmins} color="from-indigo-500 to-purple-500" />}
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => { setEditingItem(null); setFormData({ title: '', description: '', fullDescription: '', image: '', techStack: [], githubUrl: '', liveUrl: '', category: 'fullstack', featured: false, status: 'published' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                <FiPlus className="inline" /> Add New Project
              </button>
              <div className="relative">
                <button onClick={() => setShowTemplateDropdown(!showTemplateDropdown)} className="btn-secondary flex items-center gap-2">
                  <FiCopy className="inline" /> Quick Add from Template <span className="text-xs">▼</span>
                </button>
                {showTemplateDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-80 glass-card rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {projectTemplates.map((template, index) => (
                      <button key={index} onClick={() => handleQuickAddTemplate(template)} className="w-full text-left px-4 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="font-medium dark:text-white">{template.title}</div>
                        <div className="text-xs text-gray-500 truncate">{template.description}</div>
                        <span className="text-[10px] uppercase text-purple-500">{template.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map(project => (
                <motion.div key={project._id} whileHover={{ y: -5 }} className="glass-card p-5 group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg dark:text-white">{project.title}</h3>
                    <div className="flex gap-2">
                      {project.featured && <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full flex items-center gap-1"><FiStar className="w-3 h-3" /> Featured</span>}
                      {project.status === 'draft' && <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-600 rounded-full">Draft</span>}
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.slice(0, 3).map(tech => <span key={tech} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded-full">{tech}</span>)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(project); setFormData({ ...project, status: project.status || 'published' }); setShowModal(true); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"><FiEdit2 /></button>
                    <button onClick={() => handleDelete('projects', project._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"><FiTrash2 /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'blog' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => { setEditingItem(null); setFormData({ title: '', content: '', excerpt: '', image: '', tags: [] }); setShowModal(true); }} className="btn-primary mb-6">
              <FiPlus className="inline mr-2" /> Add New Post
            </button>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post._id} className="glass-card p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500">{post.excerpt?.substring(0, 100)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(post); setFormData(post); setShowModal(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><FiEdit2 /></button>
                    <button onClick={() => handleDelete('blog', post._id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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

        {activeTab === 'admins' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Admin Users</h2>
              {stats.isSuperAdmin && <button onClick={() => setShowAdminModal(true)} className="btn-primary flex items-center gap-2"><FiUserPlus /> Add Admin</button>}
            </div>
            {!stats.isSuperAdmin ? (
              <div className="glass-card p-8 text-center">
                <FiShield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Super Admin privileges required to manage admin users.</p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                {admins.length === 0 ? <div className="p-8 text-center text-gray-500">No admin users found</div> : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-purple-50 dark:bg-purple-900/30">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">Role</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {admins.map((a) => (
                          <tr key={a._id} className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition">
                            <td className="px-4 py-3 font-medium dark:text-white">{a.name}</td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{a.email}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${a.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{a.role}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.isActive ? 'Active' : 'Inactive'}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => handleDeleteAdmin(a._id)} className="p-1 text-red-500 hover:bg-red-50 rounded transition"><FiUserMinus size={18} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && renderSettingsTab()}
      </main>

      {/* ========== PROJECT MODAL (UPDATED with ImageUploader, Status, and Vanilla JS) ========== */}
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
                    <option value="vanilla-js">Vanilla JS</option>
                  </select>
                </div>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-primary" rows="2" placeholder="Short Description" required />
                <textarea value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} className="input-primary" rows="4" placeholder="Full Description" required />
                
                {/* Image Uploader */}
                <ImageUploader 
                  currentImage={formData.image} 
                  onUpload={(url) => setFormData({ ...formData, image: url })} 
                  onRemove={() => setFormData({ ...formData, image: '' })} 
                />

                <input type="text" value={formData.techStack.join(', ')} onChange={(e) => setFormData({ ...formData, techStack: e.target.value.split(',').map(s => s.trim()) })} className="input-primary" placeholder="Tech Stack (comma separated)" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="input-primary" placeholder="GitHub URL" required />
                  <input type="text" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="input-primary" placeholder="Live Demo URL" />
                </div>

                {/* Status and Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-primary">
                      <option value="published">Published (Visible on site)</option>
                      <option value="draft">Draft (Hidden from public)</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mt-6">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4" />
                    <span className="text-gray-700 dark:text-gray-300">Feature this project</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary flex items-center gap-2"><FiSave /> {editingItem ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-white">Add New Admin</h2>
                <button onClick={() => setShowAdminModal(false)} className="p-1 hover:bg-gray-100 rounded"><FiX size={24} /></button>
              </div>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Full Name *</label>
                  <input type="text" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} className="input-primary" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Email *</label>
                  <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="input-primary" placeholder="admin@example.com" required />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Password *</label>
                  <input type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} className="input-primary" placeholder="Min 6 characters" required minLength={6} />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">Role</label>
                  <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })} className="input-primary">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAdminModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary"><FiUserPlus className="inline mr-2" /> Create Admin</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;