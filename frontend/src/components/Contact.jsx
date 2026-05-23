import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/contact', form);  // ← Uses env variable
      if (response.data.success) {
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMail, label: "Email", value: "jonahkiplimo8@gmail.com", href: "mailto:jonahkiplimo8@gmail.com" },
    { icon: FiPhone, label: "Phone", value: "+254 752 452 199", href: "tel:+254752452199" },
    { icon: FiMapPin, label: "Location", value: "Nairobi, Kenya", href: "#" },
  ];

  return (
    <section id="Contact" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">
            Have a project in mind? Let's work together!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="glass-card p-8"
              >
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Let's Talk</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  I'm currently available for freelance work or full-time positions. 
                  If you have a project that needs attention, feel free to reach out.
                </p>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                        <info.icon className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{info.label}</p>
                        <p className="text-gray-700 dark:text-gray-300">{info.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              onSubmit={handleSubmit}
              className="glass-card p-8 space-y-6"
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-primary pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-primary pl-10"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-primary pl-10"
                    rows="5"
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FiSend /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;