# AI Suggestions Extension Documentation

The AI Suggestions extension provides intelligent content improvement capabilities for your Notion-like editor. This document outlines the available commands and their parameters.

## Configuration Options

```typescript
interface AiSuggestionOptions {
  rules?: Rule[]; // Array of suggestion rules
  loadOnStart?: boolean; // Whether to load suggestions when editor starts
  reloadOnUpdate?: boolean; // Whether to reload suggestions on content change
  debounceTimeout?: number; // Debounce timeout in milliseconds
}

interface Rule {
  id: string; // Unique identifier for the rule
  title: string; // Title displayed to users
  prompt: string; // AI prompt for generating suggestions
  color: string; // Border color for highlighted suggestions
  backgroundColor: string; // Background color for highlighted suggestions
}
```

## Commands Reference

### setAiSuggestionRules

Defines or updates the rules used for generating suggestions.

```typescript
editor.commands.setAiSuggestionRules(rules: Rule[]): boolean
```

Parameters:

- `rules`: Array of rule objects

### loadAiSuggestions

Generates suggestions based on the current content and defined rules.

```typescript
editor.commands.loadAiSuggestions(): Promise<void>
```

No parameters.

### loadAiSuggestionsDebounced

Loads suggestions with a debounce timer to prevent excessive API calls.

```typescript
editor.commands.loadAiSuggestionsDebounced(): boolean
```

No parameters.

### selectAiSuggestion

Selects a specific suggestion in the editor.

```typescript
editor.commands.selectAiSuggestion(suggestionId: string): boolean
```

Parameters:

- `suggestionId`: ID of the suggestion to select

### applyAiSuggestion

Applies a specific suggestion with a selected replacement option.

```typescript
editor.commands.applyAiSuggestion(options: {
  suggestionId: string;
  replacementOptionId: string;
  format?: 'plain-text' | 'html';
}): boolean
```

Parameters:

- `suggestionId`: ID of the suggestion to apply
- `replacementOptionId`: ID of the replacement option to use
- `format`: Format of the replacement text (default: 'plain-text')

### applyAllAiSuggestions

Applies all suggestions at once using their first replacement option.

```typescript
editor.commands.applyAllAiSuggestions(): boolean
```

No parameters.

## Storage Access

```typescript
// Get all current suggestions
const suggestions = editor.storage.aiSuggestion.getSuggestions();

// Get the currently selected suggestion (if any)
const selectedSuggestion = editor.storage.aiSuggestion.getSelectedSuggestion();
```

## Data Structures

```typescript
interface Suggestion {
  id: string; // Unique identifier for the suggestion
  ruleId: string; // ID of the rule that generated this suggestion
  deleteText: string; // Text to be replaced
  deleteRange: {
    // Position range in the document
    from: number;
    to: number;
  };
  replacementOptions: ReplacementOption[]; // Available replacement options
}

interface ReplacementOption {
  id: string; // Unique identifier for this option
  addText: string; // Text to add as replacement
}
```
