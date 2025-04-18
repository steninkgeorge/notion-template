import { Editor, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { GoogleGenerativeAI } from '@google/generative-ai';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    aiSuggestion: {
      /**
       * Set AI suggestion rules
       * @param rules Array of rules for AI suggestions
       * @example editor.commands.setAiSuggestionRules([{ id: '1', title: 'Spelling', prompt: 'Fix spelling errors', color: '#ff0000', backgroundColor: '#ffeeee' }])
       */
      setAiSuggestionRules: (rules: Rule[]) => ReturnType;

      /**
       * Load AI suggestions based on current content and rules
       * @example editor.commands.loadAiSuggestions()
       */
      loadAiSuggestions: () => (args: { editor: Editor }) => Promise<void>;

      /**
       * Load AI suggestions with debounce (used internally)
       * @example editor.commands.loadAiSuggestionsDebounced()
       */
      loadAiSuggestionsDebounced: () => ReturnType;

      /**
       * Select an AI suggestion by ID
       * @param suggestionId The ID of the suggestion to select
       * @example editor.commands.selectAiSuggestion('suggestion-1')
       */
      selectAiSuggestion: (suggestionId: string) => ReturnType;

      /**
       * Apply a specific AI suggestion
       * @param options Object containing suggestion ID, replacement option ID, and format
       * @example editor.commands.applyAiSuggestion({ suggestionId: 'suggestion-1', replacementOptionId: 'option-1', format: 'plain-text' })
       */
      applyAiSuggestion: (options: {
        suggestionId: string;
        replacementOptionId: string;
        format?: 'plain-text' | 'html';
      }) => ReturnType;

      /**
       * Apply all AI suggestions at once
       * @example editor.commands.applyAllAiSuggestions()
       */
      applyAllAiSuggestions: () => ReturnType;
    };
  }
}

// Define interfaces for our suggestion system
interface Rule {
  id: string;
  title: string;
  prompt: string;
  color: string;
  backgroundColor: string;
}

interface ReplacementOption {
  id: string;
  addText: string;
}

interface Suggestion {
  id: string;
  ruleId: string;
  deleteText: string;
  deleteRange: {
    from: number;
    to: number;
  };
  replacementOptions: ReplacementOption[];
}

interface AiSuggestionOptions {
  rules?: Rule[];
  loadOnStart?: boolean;
  debounceTimeout?: number;
  reloadOnUpdate?: boolean;
}

interface AiSuggestionStorage {
  rules: Rule[];
  suggestions: Suggestion[];
  selectedSuggestionId: string | null;
  getSuggestions: () => Suggestion[];
  getSelectedSuggestion: () => Suggestion | null;
}

function mapTextToDocPosition(editor: Editor, text: string, startFrom = 0) {
  if (text.length > 300 || text.split(' ').length > 80) {
    return null;
  }
  const doc = editor.state.doc;
  let foundPositions: { from: number; to: number } | null = null;

  // Search through the document nodes
  doc.descendants((node, pos) => {
    if (foundPositions) return false; // Stop if already found

    if (node.isText) {
      const nodeText = node.text || '';
      const textIndex = nodeText.indexOf(text);

      if (textIndex !== -1) {
        foundPositions = {
          from: pos + textIndex,
          to: pos + textIndex + text.length,
        };
        return false; // Stop searching
      }
    }
  });

  return foundPositions;
}

// Define the plugin key
const AiSuggestionPluginKey = new PluginKey('aiSuggestion');

export const AiSuggestion = Extension.create<AiSuggestionOptions>({
  name: 'aiSuggestion',

  addOptions() {
    return {
      rules: [],
      loadOnStart: false,
      debounceTimeout: 1000,
      reloadOnUpdate: false,
    };
  },

  addStorage() {
    return {
      rules: this.options.rules || [],
      suggestions: [],
      selectedSuggestionId: null,
      _debounceTimerMap: new Map<Editor, ReturnType<typeof setTimeout>>(),
      getSuggestions() {
        return this.suggestions;
      },
      getSelectedSuggestion() {
        if (!this.selectedSuggestionId) return null;
        return (
          this.suggestions.find(
            (suggestion) => suggestion.id === this.selectedSuggestionId
          ) || null
        );
      },
    } as AiSuggestionStorage & {
      _debounceTimerMap: Map<Editor, ReturnType<typeof setTimeout>>;
    };
  },

  addCommands() {
    return {
      setAiSuggestionRules:
        (rules: Rule[]) =>
        ({ editor }) => {
          editor.storage.aiSuggestion.rules = rules;
          editor.view.dispatch(
            editor.state.tr.setMeta('aiSuggestionRulesUpdated', rules)
          );

          return true;
        },

      loadAiSuggestions:
        () =>
        async ({ editor }) => {
          try {
            const content = editor.getHTML();

            //TOOD: AI implementation

            const genAI = new GoogleGenerativeAI(
              process.env.NEXT_PUBLIC_GEMINI_API_KEY!
            );
            const model = genAI.getGenerativeModel({
              model: 'gemini-2.0-flash',
            });

            // Generate suggestions for each rule
            const suggestionsPromises = editor.storage.aiSuggestion.rules.map(
              async (rule: Rule) => {
                try {
                  // Create prompt for the AI
                  const prompt = `
            You are an AI agent that helps in making suggestions to the text based on user defined rules.
            Make changes according to the rule only. 
            Dont select entire paragraphs or the entire content itself to change. 

            Document content: ${content}
            
            Task: ${rule.prompt}
            
            Provide suggestions in the following JSON format:
            [
              {
                "deleteText": "text to replace",
                "deleteRange": {"from": startPosition, "to": endPosition},
                "replacementOptions": [
                  {"id": "1", "addText": "suggested replacement 1"},
                  {"id": "2", "addText": "suggested replacement 2"}
                ]
              }
            ]
            
            Return only the JSON array, nothing else.
          `;

                  const result = await model.generateContent(prompt);
                  const responseText = result.response.text();

                  // Extract JSON from response (handle potential text wrapping)
                  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
                  if (!jsonMatch) return [];
                  // Add validation to filter out overly broad suggestions
                  const isValidSuggestion = (suggestion: any) => {
                    const text = suggestion.deleteText;
                    return (
                      text &&
                      text.length < 250 && // Limit suggestion length
                      text.split(' ').length < 80
                    ); // Max 20 words
                  };

                  let suggestionsData = JSON.parse(jsonMatch[0]).filter(
                    isValidSuggestion
                  );

                  // Map suggestions to our format and add IDs
                  return suggestionsData
                    .map((suggestion: any, index: number) => {
                      const textToReplace = suggestion.deleteText;
                      const positions = mapTextToDocPosition(
                        editor,
                        textToReplace
                      );
                      if (!positions) return null;
                      const data = {
                        id: `${rule.id}-${Date.now()}-${index}`,
                        ruleId: rule.id,
                        deleteText: textToReplace,
                        deleteRange: positions,
                        replacementOptions: suggestion.replacementOptions,
                      };
                      return data;
                    })
                    .filter(Boolean);
                } catch (error) {
                  console.error(
                    `Error generating suggestions for rule ${rule.id}:`,
                    error
                  );
                  return [];
                }
              }
            );

            // Wait for all suggestions to be generated
            const allSuggestions = await Promise.all(suggestionsPromises);

            // Flatten the array of arrays
            const suggestions = allSuggestions.flat();
            console.log(suggestions);
            // Update the storage with new suggestions
            editor.storage.aiSuggestion.suggestions = suggestions;

            // Trigger an update to refresh decorations
            editor.view.dispatch(
              editor.state.tr.setMeta(AiSuggestionPluginKey, { updated: true })
            );
          } catch (error) {
            console.error('Error loading AI suggestions:', error);
          }
        },

      loadAiSuggestionsDebounced:
        () =>
        ({ editor }) => {
          const timerMap = editor.storage.aiSuggestion._debounceTimerMap;
          const debounceTimeout = this.options.debounceTimeout ?? 1000;
          if (timerMap.has(editor)) {
            clearTimeout(timerMap.get(editor));
          }
          const timer = setTimeout(() => {
            editor.commands.loadAiSuggestions();
            console.log('debounced loading in progree');
            timerMap.delete(editor);
          }, debounceTimeout);

          timerMap.set(editor, timer);

          return true;
        },

      selectAiSuggestion:
        (suggestionId: string) =>
        ({ editor }) => {
          editor.storage.aiSuggestion.selectedSuggestionId = suggestionId;
          return true;
        },

      applyAiSuggestion:
        ({
          suggestionId,
          replacementOptionId,
          format = 'plain-text',
        }: {
          suggestionId: string;
          replacementOptionId: string;
          format?: 'plain-text' | 'html';
        }) =>
        ({ editor }) => {
          const suggestion = editor.storage.aiSuggestion.suggestions.find(
            (s: { id: string }) => s.id === suggestionId
          );
          if (!suggestion) return false;

          const replacementOption = suggestion.replacementOptions.find(
            (option: { id: string }) => option.id === replacementOptionId
          );
          if (!replacementOption) return false;

          const { from, to } = suggestion.deleteRange;

          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContent(
              format === 'html'
                ? replacementOption.addText
                : { type: 'text', text: replacementOption.addText }
            )
            .run();

          // Filter out the applied suggestion
          editor.storage.aiSuggestion.suggestions =
            editor.storage.aiSuggestion.suggestions.filter(
              (s: { id: string }) => s.id !== suggestionId
            );

          return true;
        },

      applyAllAiSuggestions:
        () =>
        ({ editor }) => {
          const suggestions = [...editor.storage.aiSuggestion.suggestions];

          // Sort suggestions by range.from in descending order to avoid position shifts
          suggestions.sort((a, b) => b.deleteRange.from - a.deleteRange.from);

          suggestions.forEach((suggestion) => {
            if (suggestion.replacementOptions.length > 0) {
              // Apply the first replacement option for each suggestion
              editor.commands.applyAiSuggestion({
                suggestionId: suggestion.id,
                replacementOptionId: suggestion.replacementOptions[0].id,
              });
            }
          });

          return true;
        },
    };
  },

  onUpdate() {
    if (this.options.reloadOnUpdate) {
      this.editor.commands.loadAiSuggestionsDebounced();
    }
  },

  onSelectionUpdate() {
    // Update selected suggestion based on cursor position
    const { from } = this.editor.state.selection;

    const suggestions = this.editor.storage.aiSuggestion.suggestions;
    const selectedSuggestion = suggestions.find(
      (suggestion: { deleteRange: { from: number; to: number } }) =>
        from >= suggestion.deleteRange.from && from <= suggestion.deleteRange.to
    );

    this.editor.storage.aiSuggestion.selectedSuggestionId =
      selectedSuggestion?.id || null;
  },

  onCreate() {
    if (this.options.loadOnStart) {
      this.editor.commands.loadAiSuggestions();
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      new Plugin({
        key: AiSuggestionPluginKey,

        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, decorationSet) {
            // Map decorations to new document positions
            const newSet = decorationSet.map(tr.mapping, tr.doc);

            // If the transaction updates the aiSuggestion meta, then rebuild decorations
            const suggestionsUpdate = tr.getMeta(AiSuggestionPluginKey);
            if (suggestionsUpdate) {
              const decorations: Decoration[] = [];

              editor.storage.aiSuggestion.suggestions.forEach(
                (suggestion: {
                  ruleId: any;
                  id: any;
                  deleteRange: { from: number; to: number };
                }) => {
                  const rule = editor.storage.aiSuggestion.rules.find(
                    (r: { id: string }) => r.id === suggestion.ruleId
                  );
                  if (!rule) return;
                  // Add the maximum decoration length check here
                  if (
                    suggestion.deleteRange.to - suggestion.deleteRange.from >
                    300
                  ) {
                    console.warn('Suggestion too long, skipping:', suggestion);
                    return; // Skip this suggestion
                  }

                  const isSelected =
                    suggestion.id ===
                    editor.storage.aiSuggestion.selectedSuggestionId;

                  // Create decoration for the suggestion
                  decorations.push(
                    Decoration.inline(
                      suggestion.deleteRange.from,
                      suggestion.deleteRange.to,
                      {
                        class: `ai-suggestion ${isSelected ? 'ai-suggestion-selected' : ''}`,
                        style: `
                        background-color: ${rule.backgroundColor};
                        border-bottom: 2px solid ${rule.color};
                        cursor: pointer;
                      `,
                        'data-suggestion-id': suggestion.id, // Add this line
                      }
                    )
                  );
                }
              );

              return DecorationSet.create(tr.doc, decorations);
            }

            return newSet;
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleClick(view, pos, event) {
            console.log('popover clicked');
            const suggestions = editor.storage.aiSuggestion.suggestions;
            console.log(`suggestions: ${JSON.stringify(suggestions)}`);

            const clickedSuggestion = suggestions.find((suggestion: any) => {
              return (
                pos >= suggestion.deleteRange.from &&
                pos <= suggestion.deleteRange.to
              );
            });

            if (clickedSuggestion) {
              console.log(`clicked suggestion: ${clickedSuggestion.id}`);
              editor.storage.aiSuggestion.selectedSuggestionId =
                clickedSuggestion.id;

              // Prevent default behavior and stop propagation
              event.stopPropagation();
              event.preventDefault();
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

// Export the configuration function for convenience
export function configureSuggestions(options: AiSuggestionOptions) {
  return AiSuggestion.configure(options);
}
