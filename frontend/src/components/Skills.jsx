import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiTailwindcss, 
  SiJavascript, SiTypescript, SiGit, SiDocker, SiPostgresql,
  SiRedux, SiNextdotjs, SiFirebase, SiGraphql, SiJest
} from 'react-icons/si';

const skills = [
  { name: "React.js", icon: SiReact, color: "#61DAFB", level: 92, category: "Frontend" },
  { name: "Next.js", icon: SiNextdotjs, color: "#000000", level: 85, category: "Frontend" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", level: 90, category: "Language" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", level: 80, category: "Language" },
  { name: "Node.js", icon: SiNodedotjs, color: "#339933", level: 88, category: "Backend" },
  { name: "Express.js", icon: SiExpress, color: "#000000", level: 85, category: "Backend" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", level: 85, category: "Database" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", level: 75, category: "Database" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", level: 90, category: "Frontend" },
  { name: "Redux", icon: SiRedux, color: "#764ABC", level: 85, category: "Frontend" },
  { name: "Git", icon: SiGit, color: "#F05032", level: 88, category: "Tools" },
  { name: "Docker", icon: SiDocker, color: "#2496ED", level: 75, category: "Tools" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28", level: 80, category: "Backend" },
  { name: "GraphQL", icon: SiGraphql, color: "#E10098", level: 70, category: "Backend" },
  { name: "Jest", icon: SiJest, color: "#C21325", level: 75, category: "Testing" },
];

const SkillCard = ({ skill, index, inView }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={inView ? { opacity: 1, scale: 1 } : {}}
    transition={{ delay: index * 0.05 }}
    className="glass-card p-4 group hover:scale-105 transition-all"
  >
    <div className="flex items-center gap-3 mb-3">
      <skill.icon className="text-3xl" style={{ color: skill.color }} />
      <div>
        <h3 className="font-semibold dark:text-white">{skill.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{skill.category}</p>
      </div>
    </div>
    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${skill.level}%` } : {}}
        transition={{ duration: 1, delay: index * 0.05 }}
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)` }}
      />
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-xs text-gray-500">{skill.level}%</span>
    </div>
  </motion.div>
);

const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="Skills" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-float"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Technical Skills</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Technologies and tools I work with to build amazing digital experiences
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} inView={inView} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;