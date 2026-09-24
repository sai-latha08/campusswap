const Skill = require('../models/Skill');

const defaultSkills = [
  { name: 'React.js', category: 'Programming', description: 'Modern frontend development with React, hooks, and state management.' },
  { name: 'Python', category: 'Programming', description: 'General-purpose programming, scripting, and automation.' },
  { name: 'Java', category: 'Programming', description: 'Object-oriented programming, Spring Boot, and enterprise backend.' },
  { name: 'Node.js & Express', category: 'Programming', description: 'REST APIs, server architecture, and async JavaScript.' },
  { name: 'Data Structures & Algorithms', category: 'Programming', description: 'Arrays, Trees, Graphs, Dynamic Programming for technical interviews.' },
  { name: 'UI/UX Design & Figma', category: 'Design', description: 'Wireframing, prototyping, user journeys, and component systems in Figma.' },
  { name: 'Graphic Design & Photoshop', category: 'Design', description: 'Posters, social media graphics, branding, and photo manipulation.' },
  { name: 'Machine Learning & AI', category: 'Data Science', description: 'Supervised learning, neural networks, PyTorch, and Scikit-learn.' },
  { name: 'Data Analysis & SQL', category: 'Data Science', description: 'Data querying, Pandas, data visualization, and reporting.' },
  { name: 'Video Editing (Premiere / DaVinci)', category: 'Video & Media', description: 'Timeline cutting, color grading, sound design, and reels/shorts creation.' },
  { name: 'Music Production & FL Studio', category: 'Music', description: 'Beat making, mixing, mastering, and MIDI recording.' },
  { name: 'Calculus & Linear Algebra', category: 'Mathematics', description: 'University calculus, matrices, eigenvalues, and engineering math.' },
  { name: 'Conversational Spanish', category: 'Language', description: 'Grammar, everyday conversation, pronunciation, and vocabulary.' },
  { name: 'Public Speaking & Debate', category: 'Other', description: 'Speech delivery, impromptu speaking, confidence building, and arguments.' },
];

const seedSkills = async () => {
  try {
    const count = await Skill.countDocuments();
    if (count === 0) {
      await Skill.insertMany(defaultSkills);
      console.log(`🌱 Seeded ${defaultSkills.length} default campus skills into MongoDB Atlas.`);
    }
  } catch (error) {
    console.warn('⚠️  Could not seed default skills:', error.message);
  }
};

module.exports = seedSkills;
