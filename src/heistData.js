// Master Configuration & Game Content for The Time Heist ⏳💻

export const STAGE_NAMES = [
  "Security PIN Entry",
  "The Fractured Memory",
  "Relationship Crossword",
  "The Dark Archive",
  "Temporal Footprint",
  "Couple's Authenticator",
  "Neural Photo Match"
];

export const STAGE_HINTS = [
  {
    // Stage 1: Passcode / PIN Entry
    cryptic: "The security console requires a familiar 6-digit key. Think of the most important birthday on your calendar.",
    literal: "Enter '220305' (Mythri's birthday & Ajay's phone PIN) on the glowing keypad and press UNLOCK.",
  },
  {
    // Stage 2: Photo Jigsaw
    cryptic: "A memory fractured across 9 Polaroid shards. Click any two pieces to slide and swap them into place.",
    literal: "Click two tiles to swap their positions until the full photo is restored. The B&W photo will burst into color!",
  },
  {
    // Stage 3: Relationship Crossword
    cryptic: "Fourteen words weave together our inside banter, favorite orders, and daily habits. Look at the clues on the left.",
    literal: "Solve the Across and Down clues (e.g., 1-Across is MYTHRI, 2-Across is RIDES, 1-Down is BITE, 4-Down is UNO).",
  },
  {
    // Stage 4: The Dark Archive
    cryptic: "Scrub the lantern light over the dark fairy-light wall to discover four hanging Polaroids with Roman numeral stamps.",
    literal: "Find the four Roman numeral digits: [I]=1, [II]=2, [III]=1, [IV]=0. Enter '1210' on the keypad.",
  },
  {
    // Stage 5: Timeline Sequencer
    cryptic: "Chronological truth is the only biometric key. Re-order the 5 scrapbook memories from earliest to latest.",
    literal: "Drag and drop (or use Up/Down arrows) to sort our milestones from earliest date (top) to most recent (bottom), then click 'Verify'.",
  },
  {
    // Stage 6: Couple's Authenticator
    cryptic: "Seven questions testing your memory of our favorite places, orders, songs, and moments.",
    literal: "Select the correct option for each of the 7 relationship questions to verify your identity.",
  },
  {
    // Stage 7: Neural Photo Match
    cryptic: "Twenty memory tokens are shuffled across the 5x4 neural matrix. Pair up all 10 matching moments.",
    literal: "Flip cards two at a time to find all 10 matching photo pairs and restore the core drive.",
  }
];

export const DEFAULT_PASSCODE = "220305";
export const DEFAULT_DARK_ARCHIVE_CODE = "1210";

// 14 Relationship Crossword Questions (7 Across + 7 Down) in 2D Interlocking Grid (13 rows x 12 cols)
export const CROSSWORD_DATA = {
  rows: 13,
  cols: 12,
  across: [
    {
      id: "a5",
      number: 2,
      word: "KETCHUP",
      length: 7,
      r: 1,
      c: 0,
      clue: "The condiment Mythri would put on literally every single meal if nobody stopped her."
    },
    {
      id: "a6",
      number: 5,
      word: "SHOPPING",
      length: 8,
      r: 3,
      c: 3,
      clue: "Mythri's #1 therapy and official weekend sport."
    },
    {
      id: "a4",
      number: 9,
      word: "REPLY",
      length: 5,
      r: 5,
      c: 7,
      clue: "What takes Mythri 4 business days to send, but expects back from Ajay in 4 seconds."
    },
    {
      id: "a2",
      number: 10,
      word: "RIDES",
      length: 5,
      r: 6,
      c: 1,
      clue: "Her absolute favorite thing to do with Ajay—being ridden around everywhere on the two-wheeler."
    },
    {
      id: "a3",
      number: 12,
      word: "EYES",
      length: 4,
      r: 8,
      c: 2,
      clue: "The feature on her face that made Ajay weak in the knees first."
    },
    {
      id: "a1",
      number: 13,
      word: "MYTHRI",
      length: 6,
      r: 9,
      c: 6,
      clue: "Ajay's daily craving, main course, and favorite snack."
    },
    {
      id: "a7",
      number: 14,
      word: "ASS",
      length: 3,
      r: 11,
      c: 7,
      clue: "The view of hers Ajay can never stop staring at."
    }
  ],
  down: [
    {
      id: "d7",
      number: 1,
      word: "BED",
      length: 3,
      r: 0,
      c: 1,
      clue: "Where Ajay famously got stuck after sneaking in."
    },
    {
      id: "d4",
      number: 3,
      word: "UNO",
      length: 3,
      r: 1,
      c: 5,
      clue: "The card game that instantly destroys peace and triggers ruthless accusations of cheating."
    },
    {
      id: "d1",
      number: 4,
      word: "BITE",
      length: 4,
      r: 2,
      c: 8,
      clue: "Her involuntary dental response whenever Ajay looks too cute or slightly irritating."
    },
    {
      id: "d6",
      number: 6,
      word: "HATE",
      length: 4,
      r: 3,
      c: 4,
      clue: "Mythri's clear, dramatic feeling toward Ajay whenever he pushes her buttons."
    },
    {
      id: "d3",
      number: 7,
      word: "MYTHRI",
      length: 6,
      r: 4,
      c: 11,
      clue: "What Ajay is hopelessly fixated on / Ajay's ultimate obsession."
    },
    {
      id: "d5",
      number: 8,
      word: "FIVE",
      length: 4,
      r: 5,
      c: 2,
      clue: "The ambitious number of kids Mythri claimed she wanted to have."
    },
    {
      id: "d2",
      number: 11,
      word: "JAYJAY",
      length: 6,
      r: 7,
      c: 7,
      clue: "The name given to her pair / favorite person whenever she wants his attention."
    }
  ]
};

// 7 Non-Binary Couple's Trivia Questions (Specific Shared Memories)
export const DEFAULT_TRIVIA_QUESTIONS = [
  {
    id: "t1",
    question: "Where did we sit for our very first coffee date together?",
    options: [
      "A quiet corner table tucked away from the crowd",
      "Near the front glass window watching the street outside",
      "An open-air garden terrace under warm fairy lights",
      "A cozy leather booth where hours felt like minutes"
    ],
    correctAnswerIndex: 0,
    hint: "Think about the quiet corner where our first nervous conversations started!"
  },
  {
    id: "t2",
    question: "What is our undisputed signature café order whenever we sit down together?",
    options: [
      "Two piping hot cappuccinos with extra froth",
      "Rich hazelnut lattes and a warm pastry to share",
      "Iced coffees paired with extra crispy fries",
      "Hot chocolate with whipped cream and cookies"
    ],
    correctAnswerIndex: 2,
    hint: "The comfort combination we order automatically without opening the menu!"
  },
  {
    id: "t3",
    question: "Which track officially feels like 'our song' on long late-night rides?",
    options: [
      "The slow acoustic track that always loops on our playlist",
      "The nostalgic retro melody we both know every lyric to",
      "The indie anthem we sing along to with the windows rolled down",
      "The late-night mellow track that played on our first road trip"
    ],
    correctAnswerIndex: 1,
    hint: "City breeze, late-night quiet streets, and singing the chorus together!"
  },
  {
    id: "t4",
    question: "Where were we sitting when we had our very first deep, hours-long heart-to-heart talk?",
    options: [
      "Parked on the quiet side road with the engine off",
      "In the rooftop café overlooking the city lights",
      "On the lakefront bench late in the cool evening",
      "Sitting on the floor surrounded by takeout boxes"
    ],
    correctAnswerIndex: 0,
    hint: "Hours flew by in the quiet car and neither of us wanted to look at the clock."
  },
  {
    id: "t5",
    question: "What was the very first treat or meal we actually shared across the table?",
    options: [
      "Splitting a warm dessert with two spoons",
      "Hot pizza slices straight from the box",
      "Burgers and a single basket of fries",
      "Cold coffee and a slice of chocolate cake"
    ],
    correctAnswerIndex: 2,
    hint: "Think about the gentle hesitation before taking the very last fry!"
  },
  {
    id: "t6",
    question: "What is the go-to midnight snack we always end up craving after 12:00 AM?",
    options: [
      "Spicy instant noodles with extra cheese",
      "Hot street-style rolls grabbed on the way home",
      "Warm brownies with vanilla ice cream",
      "Loaded fries eaten straight out of the paper bag"
    ],
    correctAnswerIndex: 0,
    hint: "Quick, steaming hot, and best eaten at 1 AM while talking about everything."
  },
  {
    id: "t7",
    question: "Where were we standing when we took our very first candid selfie together?",
    options: [
      "Outside the café under the soft entrance lights",
      "In the car waiting out the sudden rain",
      "Along the quiet walkway under the streetlights",
      "In front of the mirror before heading out"
    ],
    correctAnswerIndex: 1,
    hint: "Look back at the background rain, the dashboard light, and the awkward smiles!"
  }
];

// 5 Milestone Memories for Layer 05
export const TIMELINE_MEMORIES = [
  {
    id: "m1",
    title: "First Coffee Under the Rain",
    year: "Day 01",
    order: 1,
    desc: "That first nervous coffee meetup where hours felt like ten minutes.",
    photo: "https://images.unsplash.com/photo-1517256673805-adc3f4a9b634?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "m2",
    title: "The Midnight Two-Wheeler Ride",
    year: "Month 03",
    order: 2,
    desc: "Riding through empty night streets with the cold wind in our hair.",
    photo: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "m3",
    title: "The Day We Talked Until Sunrise",
    year: "Month 06",
    order: 3,
    desc: "When we realized we never run out of things to say to each other.",
    photo: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "m4",
    title: "The Airport Goodbye & Promise",
    year: "Month 12",
    order: 4,
    desc: "Counting down miles and time zones, promising to always find our way back.",
    photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "m5",
    title: "Holding Onto Forever",
    year: "Today",
    order: 5,
    desc: "Breaking the Time Warden because our story was written to last.",
    photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
  }
];

// 10 Pairs (20 Cards Total) for Layer 07 (5x4 Grid)
export const DEFAULT_MEMORY_PAIRS = [
  { pairKey: "p1", label: "First Coffee", icon: "☕", photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p2", label: "Bike Rides", icon: "🛵", photo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p3", label: "Midnight Talks", icon: "🌙", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p4", label: "Favorite Fries", icon: "🍟", photo: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p5", label: "Shopping Day", icon: "🛍️", photo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p6", label: "Inside Jokes", icon: "😂", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p7", label: "Warm Hugs", icon: "🫂", photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p8", label: "UNO Battles", icon: "🃏", photo: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p9", label: "Stolen Hoodies", icon: "🧥", photo: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80" },
  { pairKey: "p10", label: "Forever & Always", icon: "💖", photo: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80" },
];

export const DEFAULT_STORY = {
  recipient: "Mythri",
  passcode: DEFAULT_PASSCODE,
  archiveCode: DEFAULT_DARK_ARCHIVE_CODE,
  revealTitle: "You Broke The Time Warden!",
  revealMessage:
    "Through every locked dial, every dark corridor, and every scrambled memory, you proved that what we have is impossible to erase. Happy Anniversary, Mythri! Forever and always. ❤️",
  memories: TIMELINE_MEMORIES,
  triviaQuestions: DEFAULT_TRIVIA_QUESTIONS,
  jigsawPhoto: "/jigsaw.jpg"
};
