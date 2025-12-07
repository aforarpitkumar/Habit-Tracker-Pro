export interface MotivationalQuote {
  id: string;
  text: string;
  author?: string;
  category: 'motivation' | 'persistence' | 'progress' | 'success' | 'mindset';
  tags: string[];
}

export interface MotivationalTip {
  id: string;
  title: string;
  content: string;
  category: 'habit-building' | 'productivity' | 'wellness' | 'mindset' | 'strategy';
  icon: string;
  tags: string[];
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    id: 'quote-1',
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: 'Aristotle',
    category: 'mindset',
    tags: ['excellence', 'repetition', 'philosophy']
  },
  {
    id: 'quote-2',
    text: "The secret of getting ahead is getting started.",
    author: 'Mark Twain',
    category: 'motivation',
    tags: ['start', 'action', 'progress']
  },
  {
    id: 'quote-3',
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: 'Robert Collier',
    category: 'persistence',
    tags: ['consistency', 'small-steps', 'success']
  },
  {
    id: 'quote-4',
    text: "Don't watch the clock; do what it does. Keep going.",
    author: 'Sam Levenson',
    category: 'persistence',
    tags: ['persistence', 'time', 'endurance']
  },
  {
    id: 'quote-5',
    text: "The way to get started is to quit talking and begin doing.",
    author: 'Walt Disney',
    category: 'motivation',
    tags: ['action', 'start', 'execution']
  },
  {
    id: 'quote-6',
    text: "Progress, not perfection, is the goal.",
    category: 'progress',
    tags: ['progress', 'perfection', 'growth']
  },
  {
    id: 'quote-7',
    text: "Every expert was once a beginner. Every pro was once an amateur.",
    category: 'mindset',
    tags: ['growth', 'expertise', 'journey']
  },
  {
    id: 'quote-8',
    text: "It always seems impossible until it's done.",
    author: 'Nelson Mandela',
    category: 'mindset',
    tags: ['possibility', 'achievement', 'determination']
  },
  {
    id: 'quote-9',
    text: "The compound effect of small, consistent actions creates extraordinary results.",
    category: 'persistence',
    tags: ['compound-effect', 'consistency', 'results']
  },
  {
    id: 'quote-10',
    text: "Your current habits are perfectly designed to deliver your current results.",
    category: 'success',
    tags: ['habits', 'results', 'design']
  }
];

export const MOTIVATIONAL_TIPS: MotivationalTip[] = [
  {
    id: 'tip-1',
    title: 'Start with 2-Minute Rule',
    content: 'When building a new habit, make it so easy you can do it in 2 minutes. Want to read more? Start with one page. Want to exercise? Put on your workout clothes.',
    category: 'habit-building',
    icon: '⏱️',
    tags: ['2-minute-rule', 'easy-start', 'momentum']
  },
  {
    id: 'tip-2',
    title: 'Stack Your Habits',
    content: 'Link your new habit to an existing one. "After I pour my morning coffee, I will write in my journal for 5 minutes." Use your established routines as triggers.',
    category: 'strategy',
    icon: '🔗',
    tags: ['habit-stacking', 'triggers', 'routine']
  },
  {
    id: 'tip-3',
    title: 'Design Your Environment',
    content: 'Make good habits obvious and bad habits invisible. Want to drink more water? Place a water bottle on your desk. Want to avoid junk food? Keep it out of sight.',
    category: 'strategy',
    icon: '🏠',
    tags: ['environment', 'cues', 'design']
  },
  {
    id: 'tip-4',
    title: 'Track Your Progress Visually',
    content: 'Use a habit tracker, calendar, or journal to mark your daily wins. Seeing your streak grow is incredibly motivating and helps you stay consistent.',
    category: 'productivity',
    icon: '📊',
    tags: ['tracking', 'visual', 'progress']
  },
  {
    id: 'tip-5',
    title: 'Focus on Identity Change',
    content: 'Instead of "I want to run," say "I am a runner." Each habit completion is a vote for your new identity. Focus on who you want to become.',
    category: 'mindset',
    icon: '🎯',
    tags: ['identity', 'mindset', 'self-image']
  },
  {
    id: 'tip-6',
    title: 'Plan for Obstacles',
    content: 'Use "if-then" planning: "If I miss my morning workout, then I will do 10 minutes of exercise after lunch." Prepare for setbacks in advance.',
    category: 'strategy',
    icon: '🛡️',
    tags: ['planning', 'obstacles', 'if-then']
  },
  {
    id: 'tip-7',
    title: 'Celebrate Small Wins',
    content: 'Acknowledge every victory, no matter how small. Completed day 1? Celebrate! Finished week 1? Celebrate bigger! Positive emotions reinforce habits.',
    category: 'mindset',
    icon: '🎉',
    tags: ['celebration', 'wins', 'reinforcement']
  },
  {
    id: 'tip-8',
    title: 'Use the Power of Community',
    content: 'Share your habits with friends or join a community. Social accountability increases your chances of success by up to 95%.',
    category: 'strategy',
    icon: '👥',
    tags: ['community', 'accountability', 'social']
  },
  {
    id: 'tip-9',
    title: 'Quality Over Quantity',
    content: 'Better to do one habit consistently than five habits sporadically. Master one habit at a time before adding new ones to your routine.',
    category: 'strategy',
    icon: '💎',
    tags: ['quality', 'focus', 'mastery']
  },
  {
    id: 'tip-10',
    title: 'Recovery is Part of Progress',
    content: 'Missing one day is not failure—it\'s being human. The key is to get back on track quickly. Never miss twice in a row.',
    category: 'mindset',
    icon: '🔄',
    tags: ['recovery', 'resilience', 'comeback']
  }
];

export function getRandomQuote(category?: MotivationalQuote['category']): MotivationalQuote {
  const quotes = category 
    ? MOTIVATIONAL_QUOTES.filter(q => q.category === category)
    : MOTIVATIONAL_QUOTES;
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export function getRandomTip(category?: MotivationalTip['category']): MotivationalTip {
  const tips = category 
    ? MOTIVATIONAL_TIPS.filter(t => t.category === category)
    : MOTIVATIONAL_TIPS;
  
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

export function getDailyMotivation(): { quote: MotivationalQuote; tip: MotivationalTip } {
  // Use date as seed for consistent daily content
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
  const tipIndex = dayOfYear % MOTIVATIONAL_TIPS.length;
  
  return {
    quote: MOTIVATIONAL_QUOTES[quoteIndex],
    tip: MOTIVATIONAL_TIPS[tipIndex]
  };
}