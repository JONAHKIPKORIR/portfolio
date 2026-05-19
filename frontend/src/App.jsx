import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence>
        <CustomCursor />
        <ScrollProgress />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
            },
          }}
        />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Blog />
          <Contact />
        </main>
        <Footer />
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;