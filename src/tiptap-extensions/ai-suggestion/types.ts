// Define interfaces for our suggestion system
export interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

export interface ReplacementOption {
  id: string;
  addText: string;
}

export interface Suggestion {
  id: string;
  ruleId: string;
  deleteText: string;
  deleteRange: {
    from: number;
    to: number;
  };
  replacementOptions: ReplacementOption[];
}

export interface AiSuggestionOptions {
  rules?: Rule[];
  loadOnStart?: boolean;
  debounceTimeout?: number;
  reloadOnUpdate?: boolean;
}

export interface AiSuggestionStorage {
  rules: Rule[];
  suggestions: Suggestion[];
  selectedSuggestionId: string | null;
  getSuggestions: () => Suggestion[];
  getSelectedSuggestion: () => Suggestion | null;
}
