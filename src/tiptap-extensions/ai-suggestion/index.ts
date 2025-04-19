export * from './ai-suggestion';

export type {
  Rule,
  ReplacementOption,
  Suggestion,
  AiSuggestionOptions,
  AiSuggestionStorage,
} from './types';

export { configureSuggestions } from './ai-suggestion';

// Export components
export { AiSuggestionPopover } from './suggestion/popover/ai-suggestion-popover';
export { AiSuggestionPopoverWrapper } from './suggestion/popover/popover-wrapper';
