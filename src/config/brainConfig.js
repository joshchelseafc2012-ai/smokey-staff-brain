/**
 * Brain Configuration - Phase 6 Enhanced
 * Defines metadata, system prompts, and behavior for all three brains
 */

export const BRAIN_CONFIGS = {
  staff: {
    id: 'staff',
    name: 'Smokey Staff Brain',
    subtitle: 'Internal Knowledge System',
    color: '#C9A84C',
    accentColor: 'rgba(201, 168, 76, 0.3)',
    maxTokens: 1024,
    model: 'claude-opus-4-1',
    quickTopics: [
      'How do I do a skin fade?',
      'What\'s the consultation script?',
      'Show me the daily checklist',
      'What\'s the late client policy?',
      'How do I clean down properly?'
    ],
    suggestions: [
      'Show me the daily checklist',
      'Explain the consultation process',
      'What are our standards?',
      'Product knowledge'
    ]
  },

  owner: {
    id: 'owner',
    name: 'Smokey Owner Brain',
    subtitle: 'Business Intelligence',
    color: '#C9A84C',
    accentColor: 'rgba(201, 168, 76, 0.3)',
    maxTokens: 2048,
    model: 'claude-opus-4-1',
    quickTopics: [
      'What\'s our revenue this week?',
      'Which staff member is top performer?',
      'What\'s our customer retention rate?',
      'Show me low stock items',
      'How can we improve margins?'
    ],
    suggestions: [
      'Show revenue breakdown',
      'Staff performance metrics',
      'Client retention analysis',
      'Inventory alerts'
    ]
  },

  client: {
    id: 'client',
    name: 'Smokey Client Brain',
    subtitle: 'Your Personal Assistant',
    color: '#4A90E2',
    accentColor: 'rgba(74, 144, 226, 0.3)',
    maxTokens: 512,
    model: 'claude-3-5-sonnet-latest',
    quickTopics: [
      'Book me an appointment',
      'What\'s my next booking?',
      'How many loyalty points do I have?',
      'What do you recommend for my next cut?',
      'Can I reschedule my appointment?'
    ],
    suggestions: [
      'Book an appointment',
      'Check my bookings',
      'View loyalty points',
      'Get recommendations'
    ]
  }
};

export function getBrainConfig(brainType) {
  return BRAIN_CONFIGS[brainType] || BRAIN_CONFIGS.staff;
}

export function getQuickTopics(brainType) {
  const config = getBrainConfig(brainType);
  return config.quickTopics;
}

export function getSuggestions(brainType) {
  const config = getBrainConfig(brainType);
  return config.suggestions;
}

export function getBrainSettings(brainType) {
  const config = getBrainConfig(brainType);
  return {
    model: config.model,
    maxTokens: config.maxTokens
  };
}

export function getSystemPrompt(brainType) {
  const config = getBrainConfig(brainType);
  // System prompts are handled by backend, but this function
  // provides access to brain config metadata for frontend
  return config;
}
