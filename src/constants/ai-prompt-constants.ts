//academic , business , casual , creative, conversational , emotional , humorous, informative , inspirational , memeify , narrative, objective , persuasive, poetic
/*  simplify ,fix grammar and spelling , make shorter , make longer , change tone , emojify , translate, complete sentence */

import {
  Wand2,
  SpellCheck,
  AlignVerticalDistributeStart, // for make_shorter
  AlignVerticalDistributeEnd, // for make_longer
  Palette,
  Smile,
  Languages,
  ScanText,
} from 'lucide-react';

// Tone prompts
export const TONE_PROMPTS = {
  academic:
    'Please write this in an academic tone with formal language, scholarly references, and well-structured arguments.',
  business:
    'Please write this in a professional business tone suitable for corporate communications and formal workplace environments.',
  casual:
    'Please write this in a casual, conversational tone as if talking to a friend.',
  creative:
    'Please write this in a creative, imaginative tone with vivid descriptions and original expressions.',
  conversational:
    'Please write this in a natural, dialogue-like tone that mimics everyday speech patterns.',
  emotional:
    'Please write this in an emotional tone that conveys strong feelings and creates an affective connection.',
  humorous:
    'Please write this in a humorous tone with jokes, puns, and playful language.',
  informative:
    'Please write this in an informative tone that clearly presents facts and information in an educational manner.',
  inspirational:
    'Please write this in an inspirational tone that motivates and uplifts the reader.',
  memeify:
    'Please write this in a meme-like tone with internet humor, references, and contemporary online speech patterns.',
  narrative:
    'Please write this in a storytelling tone with narrative elements like scene-setting and character development.',
  objective:
    'Please write this in an objective, balanced tone that presents information without bias or personal opinion.',
  persuasive:
    'Please write this in a persuasive tone designed to convince the reader of a particular viewpoint.',
  poetic:
    'Please write this in a poetic tone with rhythm, metaphor, and other literary devices.',
};

// Modification prompts
export const MODIFICATION_PROMPTS = {
  simplify: {
    label: 'Simplify',
    prompt:
      'Simplify this content to make it easier to understand, using clearer language and shorter sentences.',
    icon: Wand2,
  },
  fix_grammar_and_spelling: {
    label: 'Fix grammar and spelling',
    prompt:
      'Fix any grammar and spelling errors in this content while maintaining its meaning.',
    icon: SpellCheck,
  },
  make_shorter: {
    label: 'Make shorter',
    prompt:
      'Make this content shorter while preserving the key information and main points.',
    icon: AlignVerticalDistributeStart,
  },
  make_longer: {
    label: 'Make longer',
    prompt:
      'Expand this content with more details, examples, and explanations.',
    icon: AlignVerticalDistributeEnd,
  },
  change_tone: {
    label: 'Change tone',
    prompt: 'Change the tone of this content according to the specified style.',
    icon: Palette,
  },
  emojify: {
    label: 'Add emojis',
    prompt:
      "Add emojis to this content. Don't write anything else. Just add emojis!",
    icon: Smile,
  },
  translate: {
    label: 'Translate',
    prompt:
      'Translate this content to the specified language while preserving its meaning.',
    icon: Languages,
  },
  complete_sentence: {
    label: 'Complete sentence',
    prompt:
      'Complete any unfinished sentences in this content in a natural way.',
    icon: ScanText,
  },
};
