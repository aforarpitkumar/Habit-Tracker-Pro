import type { Habit } from '@/types';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: Habit['frequency'];
  category: 'health' | 'productivity' | 'mindfulness' | 'learning' | 'social' | 'creative';
  tags: string[];
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health & Fitness - General Fitness
  {
    id: 'daily-water',
    name: 'Drink Water',
    description: 'Stay hydrated by drinking 8 glasses of water daily',
    icon: 'water',
    color: '#06B6D4',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['health', 'hydration', 'daily']
  },
  {
    id: 'morning-exercise',
    name: 'Morning Exercise',
    description: 'Start your day with 30 minutes of physical activity',
    icon: 'muscle',
    color: '#EF4444',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['fitness', 'morning', 'energy']
  },
  {
    id: 'workout-schedule',
    name: 'Workout (3x/week)',
    description: 'Strength training or cardio workout 3 times per week',
    icon: 'dumbbell',
    color: '#F97316',
    frequency: { type: 'weekly', target: 3, period: 7, daysOfWeek: [1, 3, 5] },
    category: 'health',
    tags: ['fitness', 'strength', 'cardio']
  },
  {
    id: 'daily-run',
    name: 'Daily Run',
    description: 'Go for a 30-minute run or jog',
    icon: 'running',
    color: '#DC2626',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['running', 'cardio', 'endurance']
  },
  {
    id: 'walk-10k-steps',
    name: '10,000 Steps',
    description: 'Walk at least 10,000 steps daily',
    icon: 'walking',
    color: '#059669',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['walking', 'steps', 'movement']
  },
  {
    id: 'gym-session',
    name: 'Gym Session',
    description: 'Complete a full gym workout with weights',
    icon: 'legs',
    color: '#7C2D12',
    frequency: { type: 'weekly', target: 4, period: 7 },
    category: 'health',
    tags: ['gym', 'weights', 'strength']
  },
  {
    id: 'yoga-practice',
    name: 'Yoga Practice',
    description: 'Practice yoga for flexibility and mindfulness',
    icon: 'yoga',
    color: '#8B5CF6',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['yoga', 'flexibility', 'mindfulness']
  },
  {
    id: 'swimming',
    name: 'Swimming',
    description: 'Swim laps for cardiovascular health',
    icon: 'swimming',
    color: '#0891B2',
    frequency: { type: 'weekly', target: 2, period: 7 },
    category: 'health',
    tags: ['swimming', 'cardio', 'full-body']
  },

  // Health & Fitness - Nutrition
  {
    id: 'healthy-meal',
    name: 'Eat Healthy Meal',
    description: 'Consume at least one nutritious, home-cooked meal',
    icon: 'utensils',
    color: '#84CC16',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['nutrition', 'cooking', 'wellness']
  },
  {
    id: 'eat-fruit',
    name: 'Eat Fruit Daily',
    description: 'Include fresh fruit in your daily diet',
    icon: 'apple',
    color: '#EF4444',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['fruit', 'vitamins', 'nutrition']
  },
  {
    id: 'vegetables',
    name: 'Eat Vegetables',
    description: 'Include vegetables in every meal',
    icon: 'broccoli',
    color: '#10B981',
    frequency: { type: 'daily', target: 3, period: 1 },
    category: 'health',
    tags: ['vegetables', 'nutrition', 'fiber']
  },
  {
    id: 'no-junk-food',
    name: 'No Junk Food',
    description: 'Avoid processed and fast food',
    icon: 'no_burger',
    color: '#DC2626',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['no-junk', 'healthy-eating', 'discipline']
  },
  {
    id: 'track-weight',
    name: 'Track Weight',
    description: 'Monitor weight progress weekly',
    icon: 'scale',
    color: '#6B7280',
    frequency: { type: 'weekly', target: 1, period: 7 },
    category: 'health',
    tags: ['weight', 'tracking', 'goals']
  },

  // Health & Fitness - Sleep & Recovery
  {
    id: 'sleep-schedule',
    name: 'Quality Sleep',
    description: 'Get 7-8 hours of quality sleep',
    icon: 'moon',
    color: '#8B5CF6',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['sleep', 'recovery', 'wellness']
  },
  {
    id: 'wake-early',
    name: 'Wake Up Early',
    description: 'Wake up at 6 AM every day',
    icon: 'sunrise',
    color: '#F59E0B',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['morning', 'routine', 'discipline']
  },

  // Productivity & Study
  {
    id: 'daily-planning',
    name: 'Plan My Day',
    description: 'Spend 10 minutes planning priorities for the day',
    icon: 'target',
    color: '#3B82F6',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['planning', 'organization', 'goals']
  },
  {
    id: 'deep-work',
    name: 'Deep Work Session',
    description: 'Focus on important tasks for 2+ hours without distractions',
    icon: 'search',
    color: '#10B981',
    frequency: { type: 'weekly', target: 5, period: 7, daysOfWeek: [1, 2, 3, 4, 5] },
    category: 'productivity',
    tags: ['focus', 'work', 'productivity']
  },
  {
    id: 'code-daily',
    name: 'Code Daily',
    description: 'Write code or work on programming projects',
    icon: 'code',
    color: '#6B7280',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['programming', 'skill', 'development']
  },
  {
    id: 'daily-reading',
    name: 'Read for 30 minutes',
    description: 'Read books, articles, or educational content',
    icon: 'book',
    color: '#F59E0B',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'learning',
    tags: ['reading', 'knowledge', 'growth']
  },
  {
    id: 'journaling',
    name: 'Daily Journaling',
    description: 'Write in your journal for reflection and growth',
    icon: 'writing',
    color: '#EC4899',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['journaling', 'reflection', 'writing']
  },
  {
    id: 'learn-skill',
    name: 'Learn New Skill',
    description: 'Dedicate time to learning something new',
    icon: 'bulb',
    color: '#CA8A04',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'learning',
    tags: ['learning', 'skill', 'growth']
  },
  {
    id: 'no-procrastination',
    name: 'Beat Procrastination',
    description: 'Complete important tasks without delay',
    icon: 'clock',
    color: '#DC2626',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['productivity', 'discipline', 'focus']
  },

  // Mental Wellbeing & Self-Care
  {
    id: 'meditation',
    name: 'Meditate',
    description: 'Practice mindfulness meditation for 10-20 minutes',
    icon: 'brain',
    color: '#8B5CF6',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'mindfulness',
    tags: ['meditation', 'mindfulness', 'stress']
  },
  {
    id: 'gratitude-journal',
    name: 'Gratitude Journal',
    description: 'Write down 3 things you are grateful for',
    icon: 'pray',
    color: '#F59E0B',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'mindfulness',
    tags: ['gratitude', 'journaling', 'mental-health']
  },
  {
    id: 'breathing-exercise',
    name: 'Breathing Exercise',
    description: 'Practice deep breathing for 5-10 minutes',
    icon: 'wind',
    color: '#06B6D4',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'mindfulness',
    tags: ['breathing', 'relaxation', 'stress-relief']
  },
  {
    id: 'digital-detox',
    name: 'Digital Detox',
    description: 'Spend 1 hour without any digital devices',
    icon: 'no_phone',
    color: '#065F46',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'mindfulness',
    tags: ['detox', 'mindfulness', 'balance']
  },
  {
    id: 'affirmations',
    name: 'Daily Affirmations',
    description: 'Practice positive self-talk and affirmations',
    icon: 'star',
    color: '#CA8A04',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'mindfulness',
    tags: ['affirmations', 'positivity', 'self-care']
  },

  // Personal & Life Admin
  {
    id: 'make-bed',
    name: 'Make Bed',
    description: 'Start the day by making your bed',
    icon: 'bed',
    color: '#8B5CF6',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['routine', 'organization', 'morning']
  },
  {
    id: 'budget-review',
    name: 'Budget Review',
    description: 'Review and track daily expenses',
    icon: 'money',
    color: '#059669',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['finance', 'budgeting', 'money']
  },
  {
    id: 'cleaning',
    name: 'Daily Cleaning',
    description: 'Tidy up living space for 15 minutes',
    icon: 'cleaning',
    color: '#14B8A6',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'productivity',
    tags: ['cleaning', 'organization', 'maintenance']
  },
  {
    id: 'laundry',
    name: 'Do Laundry',
    description: 'Keep up with laundry weekly',
    icon: 'shirt',
    color: '#7C3AED',
    frequency: { type: 'weekly', target: 2, period: 7 },
    category: 'productivity',
    tags: ['laundry', 'maintenance', 'organization']
  },

  // Social & Relationships
  {
    id: 'connect-friends',
    name: 'Connect with Friends',
    description: 'Reach out to or spend time with friends/family',
    icon: 'heart',
    color: '#EF4444',
    frequency: { type: 'weekly', target: 2, period: 7 },
    category: 'social',
    tags: ['relationships', 'social', 'connection']
  },
  {
    id: 'call-family',
    name: 'Call Family',
    description: 'Have a meaningful conversation with family',
    icon: 'phone',
    color: '#BE185D',
    frequency: { type: 'weekly', target: 2, period: 7 },
    category: 'social',
    tags: ['family', 'communication', 'relationships']
  },
  {
    id: 'socializing',
    name: 'Social Activity',
    description: 'Engage in social activities or events',
    icon: 'group',
    color: '#7E22CE',
    frequency: { type: 'weekly', target: 1, period: 7 },
    category: 'social',
    tags: ['socializing', 'events', 'community']
  },
  {
    id: 'date-night',
    name: 'Date Night',
    description: 'Spend quality time with your partner',
    icon: 'couple',
    color: '#EC4899',
    frequency: { type: 'weekly', target: 1, period: 7 },
    category: 'social',
    tags: ['relationship', 'romance', 'quality-time']
  },

  // Creativity & Hobbies
  {
    id: 'creative-time',
    name: 'Creative Time',
    description: 'Spend time on creative projects or hobbies',
    icon: 'art',
    color: '#EC4899',
    frequency: { type: 'weekly', target: 3, period: 7 },
    category: 'creative',
    tags: ['creativity', 'hobby', 'art']
  },
  {
    id: 'music-practice',
    name: 'Music Practice',
    description: 'Practice playing an instrument or singing',
    icon: 'music',
    color: '#8B5CF6',
    frequency: { type: 'weekly', target: 4, period: 7 },
    category: 'creative',
    tags: ['music', 'skill', 'practice']
  },
  {
    id: 'piano-practice',
    name: 'Piano Practice',
    description: 'Practice piano for 30 minutes',
    icon: 'piano',
    color: '#374151',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'creative',
    tags: ['piano', 'music', 'skill']
  },
  {
    id: 'guitar-practice',
    name: 'Guitar Practice',
    description: 'Practice guitar chords and songs',
    icon: 'guitar',
    color: '#8B5A2B',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'creative',
    tags: ['guitar', 'music', 'practice']
  },
  {
    id: 'drawing',
    name: 'Drawing/Painting',
    description: 'Create art through drawing or painting',
    icon: 'brush',
    color: '#F97316',
    frequency: { type: 'weekly', target: 3, period: 7 },
    category: 'creative',
    tags: ['drawing', 'painting', 'art']
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Take photos and practice photography skills',
    icon: 'camera',
    color: '#1F2937',
    frequency: { type: 'weekly', target: 2, period: 7 },
    category: 'creative',
    tags: ['photography', 'visual-arts', 'creativity']
  },

  // Bad Habits to Stop
  {
    id: 'no-smoking',
    name: 'No Smoking',
    description: 'Stay smoke-free for the entire day',
    icon: 'no_smoking',
    color: '#DC2626',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['quit-smoking', 'health', 'discipline']
  },
  {
    id: 'no-alcohol',
    name: 'No Alcohol',
    description: 'Avoid alcoholic beverages',
    icon: 'no_alcohol',
    color: '#7C2D12',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['no-alcohol', 'health', 'sobriety']
  },
  {
    id: 'limit-screen-time',
    name: 'Limit Screen Time',
    description: 'Keep recreational screen time under 2 hours',
    icon: 'no_mobile',
    color: '#374151',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'mindfulness',
    tags: ['screen-time', 'balance', 'mindfulness']
  },
  {
    id: 'no-sugar',
    name: 'No Added Sugar',
    description: 'Avoid foods and drinks with added sugar',
    icon: 'no_donut',
    color: '#BE185D',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'health',
    tags: ['no-sugar', 'healthy-eating', 'discipline']
  },

  // Additional Learning
  {
    id: 'language-practice',
    name: 'Practice Language',
    description: 'Study or practice a foreign language',
    icon: 'book',
    color: '#EC4899',
    frequency: { type: 'daily', target: 1, period: 1 },
    category: 'learning',
    tags: ['language', 'communication', 'culture']
  },

  // Weekly Review
  {
    id: 'weekly-review',
    name: 'Weekly Review',
    description: 'Reflect on the week and plan for the next one',
    icon: 'target',
    color: '#3B82F6',
    frequency: { type: 'weekly', target: 1, period: 7, daysOfWeek: [0] },
    category: 'productivity',
    tags: ['reflection', 'planning', 'growth']
  }
];

export const TEMPLATE_CATEGORIES = [
  { value: 'health', label: 'Health & Fitness', color: '#10B981' },
  { value: 'productivity', label: 'Productivity', color: '#3B82F6' },
  { value: 'mindfulness', label: 'Mindfulness', color: '#8B5CF6' },
  { value: 'learning', label: 'Learning', color: '#F59E0B' },
  { value: 'creative', label: 'Creative', color: '#EC4899' },
  { value: 'social', label: 'Social', color: '#EF4444' }
] as const;

export function getTemplatesByCategory(category: string): HabitTemplate[] {
  return HABIT_TEMPLATES.filter(template => template.category === category);
}

export function searchTemplates(query: string): HabitTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return HABIT_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}