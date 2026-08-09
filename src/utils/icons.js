// A broad, searchable set of emoji for habit/fixed-spend icons. Each entry's keywords
// cover the habit names people are likely to type, not just the literal emoji meaning.
export const HABIT_ICONS = [
  // Fitness & movement
  { emoji: '🏋️', keywords: ['workout', 'gym', 'weights', 'lift', 'strength', 'exercise'] },
  { emoji: '🏃', keywords: ['run', 'running', 'jog', 'cardio', 'sprint'] },
  { emoji: '🚴', keywords: ['bike', 'cycling', 'ride'] },
  { emoji: '🏊', keywords: ['swim', 'swimming', 'pool'] },
  { emoji: '🧘', keywords: ['yoga', 'meditate', 'meditation', 'mindfulness', 'calm', 'breathe'] },
  { emoji: '🤸', keywords: ['stretch', 'gymnastics', 'flexibility', 'mobility'] },
  { emoji: '⚽', keywords: ['soccer', 'football', 'sport'] },
  { emoji: '🏀', keywords: ['basketball', 'sport'] },
  { emoji: '🎾', keywords: ['tennis', 'sport'] },
  { emoji: '🥊', keywords: ['boxing', 'fight', 'martial arts'] },
  { emoji: '🧗', keywords: ['climbing', 'climb', 'bouldering'] },
  { emoji: '🚶', keywords: ['walk', 'walking', 'steps', 'stroll'] },
  { emoji: '💪', keywords: ['strength', 'muscle', 'strong', 'flex'] },
  { emoji: '🤾', keywords: ['handball', 'sport'] },
  { emoji: '🏌️', keywords: ['golf'] },
  { emoji: '⛷️', keywords: ['ski', 'skiing'] },
  { emoji: '🏂', keywords: ['snowboard'] },
  { emoji: '🤺', keywords: ['fencing'] },
  { emoji: '🚣', keywords: ['row', 'rowing', 'kayak'] },

  // Health & self-care
  { emoji: '🦷', keywords: ['teeth', 'dental', 'brush', 'brushing', 'floss'] },
  { emoji: '🧴', keywords: ['skincare', 'lotion', 'moisturize'] },
  { emoji: '🚿', keywords: ['shower', 'hygiene'] },
  { emoji: '🛁', keywords: ['bath', 'soak'] },
  { emoji: '🧼', keywords: ['soap', 'wash', 'hands', 'clean'] },
  { emoji: '💊', keywords: ['medicine', 'pill', 'vitamin', 'supplement'] },
  { emoji: '🩺', keywords: ['health', 'checkup', 'doctor', 'appointment'] },
  { emoji: '😴', keywords: ['sleep', 'nap', 'rest', 'oversleep'] },
  { emoji: '🛏️', keywords: ['bed', 'bedtime', 'make bed'] },
  { emoji: '⏰', keywords: ['alarm', 'wake', 'early', 'snooze'] },
  { emoji: '💇', keywords: ['haircut', 'hair', 'grooming'] },
  { emoji: '🧖', keywords: ['spa', 'self-care', 'relax'] },
  { emoji: '👁️', keywords: ['eyes', 'vision', 'screen break'] },
  { emoji: '🩹', keywords: ['injury', 'recovery', 'heal'] },

  // Food & drink
  { emoji: '🥗', keywords: ['salad', 'healthy', 'eating', 'diet'] },
  { emoji: '🍎', keywords: ['apple', 'fruit', 'snack'] },
  { emoji: '🥦', keywords: ['broccoli', 'vegetable', 'veggies'] },
  { emoji: '💧', keywords: ['water', 'drink', 'hydrate', 'hydration'] },
  { emoji: '🍵', keywords: ['tea', 'green tea'] },
  { emoji: '☕', keywords: ['coffee', 'caffeine'] },
  { emoji: '🍳', keywords: ['breakfast', 'cooking', 'eggs', 'cook'] },
  { emoji: '🍱', keywords: ['meal prep', 'lunch', 'bento'] },
  { emoji: '🍕', keywords: ['pizza', 'junk food', 'takeout'] },
  { emoji: '🍔', keywords: ['burger', 'fast food'] },
  { emoji: '🍟', keywords: ['fries', 'fast food'] },
  { emoji: '🍦', keywords: ['ice cream', 'dessert', 'sweet'] },
  { emoji: '🍩', keywords: ['donut', 'doughnut', 'sweet'] },
  { emoji: '🍫', keywords: ['chocolate', 'sweet', 'candy'] },
  { emoji: '🍬', keywords: ['candy', 'sweets', 'sugar'] },
  { emoji: '🥤', keywords: ['soda', 'soft drink', 'sugary drink'] },
  { emoji: '🍺', keywords: ['beer', 'alcohol', 'drinking'] },
  { emoji: '🍷', keywords: ['wine', 'alcohol', 'drinking'] },
  { emoji: '🍸', keywords: ['cocktail', 'alcohol', 'drinking'] },
  { emoji: '🚬', keywords: ['smoking', 'cigarette', 'nicotine', 'vape'] },
  { emoji: '🌮', keywords: ['taco', 'takeout'] },
  { emoji: '🍜', keywords: ['noodles', 'ramen', 'takeout'] },
  { emoji: '🍰', keywords: ['cake', 'dessert', 'sweet'] },
  { emoji: '🍿', keywords: ['popcorn', 'snack', 'movie'] },

  // Productivity & learning
  { emoji: '📖', keywords: ['read', 'reading', 'book'] },
  { emoji: '📚', keywords: ['study', 'books', 'homework', 'school'] },
  { emoji: '✍️', keywords: ['write', 'writing', 'journal'] },
  { emoji: '💻', keywords: ['computer', 'work', 'coding', 'programming'] },
  { emoji: '📝', keywords: ['notes', 'to-do', 'todo', 'plan'] },
  { emoji: '📅', keywords: ['calendar', 'schedule', 'plan', 'planning'] },
  { emoji: '⏱️', keywords: ['timer', 'pomodoro', 'focus', 'deep work'] },
  { emoji: '🎯', keywords: ['goal', 'target', 'aim'] },
  { emoji: '💼', keywords: ['work', 'job', 'career'] },
  { emoji: '📧', keywords: ['email', 'inbox', 'mail'] },
  { emoji: '🗂️', keywords: ['organize', 'files', 'declutter'] },
  { emoji: '✅', keywords: ['done', 'complete', 'task', 'checklist'] },
  { emoji: '🎓', keywords: ['learn', 'course', 'graduate', 'education'] },
  { emoji: '🌐', keywords: ['language', 'learning', 'duolingo'] },
  { emoji: '🧮', keywords: ['math', 'budget', 'calculate'] },

  // Mind, creativity & spirit
  { emoji: '🙏', keywords: ['gratitude', 'prayer', 'thankful'] },
  { emoji: '📔', keywords: ['journal', 'diary', 'reflect'] },
  { emoji: '🎨', keywords: ['art', 'creativity', 'drawing', 'paint'] },
  { emoji: '🎵', keywords: ['music', 'listen', 'song'] },
  { emoji: '🎸', keywords: ['guitar', 'instrument', 'practice'] },
  { emoji: '🎹', keywords: ['piano', 'instrument', 'practice'] },
  { emoji: '📷', keywords: ['photography', 'photo', 'camera'] },
  { emoji: '🧠', keywords: ['mind', 'brain', 'learning', 'puzzle'] },
  { emoji: '🧩', keywords: ['puzzle', 'brain training'] },

  // Screens & tech (often "bad" habits)
  { emoji: '📱', keywords: ['phone', 'scrolling', 'social media', 'screen time'] },
  { emoji: '🎮', keywords: ['gaming', 'video games', 'console'] },
  { emoji: '📺', keywords: ['tv', 'television', 'watching', 'binge'] },
  { emoji: '🖥️', keywords: ['monitor', 'desktop', 'screen'] },

  // Money & shopping
  { emoji: '💰', keywords: ['money', 'savings', 'save'] },
  { emoji: '🪙', keywords: ['coin', 'currency'] },
  { emoji: '💳', keywords: ['card', 'spending', 'shopping', 'impulse buy'] },
  { emoji: '🛍️', keywords: ['shopping', 'bags', 'retail'] },
  { emoji: '🛒', keywords: ['groceries', 'cart', 'shopping'] },
  { emoji: '🎰', keywords: ['gambling', 'bet', 'slots'] },

  // Chores & home
  { emoji: '🧹', keywords: ['sweep', 'clean', 'cleaning', 'tidy'] },
  { emoji: '🧺', keywords: ['laundry', 'wash clothes'] },
  { emoji: '🍽️', keywords: ['dishes', 'wash dishes'] },
  { emoji: '🌱', keywords: ['plant', 'garden', 'watering', 'grow'] },
  { emoji: '🐶', keywords: ['dog', 'pet', 'walk the dog'] },
  { emoji: '🐱', keywords: ['cat', 'pet'] },
  { emoji: '🏠', keywords: ['home', 'house', 'rent', 'upkeep'] },
  { emoji: '🔌', keywords: ['electricity', 'utility', 'bills'] },
  { emoji: '📶', keywords: ['internet', 'wifi', 'subscription'] },
  { emoji: '🧾', keywords: ['bill', 'receipt', 'invoice'] },
  { emoji: '🚗', keywords: ['car', 'commute', 'drive'] },
  { emoji: '🚌', keywords: ['bus', 'commute', 'transit'] },
  { emoji: '💡', keywords: ['idea', 'utility', 'electric'] },

  // Social & family
  { emoji: '👨‍👩‍👧', keywords: ['family', 'time with family'] },
  { emoji: '📞', keywords: ['call', 'phone call', 'talk'] },
  { emoji: '💬', keywords: ['chat', 'message', 'text'] },
  { emoji: '🤝', keywords: ['meeting', 'social', 'networking'] },
  { emoji: '🎉', keywords: ['celebrate', 'party', 'reward'] },

  // Outdoors & nature
  { emoji: '🌳', keywords: ['nature', 'outdoors', 'tree'] },
  { emoji: '☀️', keywords: ['sun', 'sunshine', 'outside'] },
  { emoji: '🌧️', keywords: ['rain', 'weather'] },
  { emoji: '⛰️', keywords: ['hike', 'hiking', 'mountain'] },
  { emoji: '🏕️', keywords: ['camping', 'outdoors'] },

  // Vices & avoidance
  { emoji: '🛋️', keywords: ['couch', 'lazy', 'skip', 'procrastinate'] },
  { emoji: '🙅', keywords: ['avoid', 'stop', 'no', 'quit'] },
  { emoji: '🚫', keywords: ['no', 'stop', 'avoid', 'ban'] },

  // Misc / flair
  { emoji: '⭐', keywords: ['star', 'favorite'] },
  { emoji: '🔥', keywords: ['fire', 'streak', 'hot'] },
  { emoji: '❤️', keywords: ['love', 'health', 'heart'] },
  { emoji: '🌟', keywords: ['sparkle', 'achievement', 'shine'] },
  { emoji: '⚠️', keywords: ['warning', 'caution'] },
  { emoji: '🎁', keywords: ['gift', 'reward', 'present'] },
]

export function searchIcons(query) {
  const q = query.trim().toLowerCase()
  if (!q) return HABIT_ICONS
  return HABIT_ICONS.filter((i) => i.emoji === query || i.keywords.some((k) => k.includes(q)))
}
