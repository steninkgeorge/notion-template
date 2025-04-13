import { useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { useAIAssistant } from '@/ai-extension/hooks/use-ai-hook';
import { useAiAssistantState } from '@/ai-extension/store/ai-state-store';
import {
  AImodelConfig,
  AImodelKey,
  AImodels,
  defaultConfig,
} from '@/ai-extension/types/index ';
import { Button } from '@/components/ui/button';
import {
  TONE_PROMPTS,
  MODIFICATION_PROMPTS,
} from '@/constants/ai-prompt-constants';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { MessageSquareIcon, CheckIcon, PenIcon, TrashIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownEditor } from '@/app/component/preview-editor';

export const AIGenerateComponentNode = ({
  editor,
  node,
  getPos,
}: NodeViewProps) => {
  const { generateContent, ...state } = useAIAssistant();
  const { setConfig } = useAiAssistantState();

  const [input, setInput] = useState(node.attrs.initialPrompt || '');
  const [model, setModel] = useState(defaultConfig.model);
  const [tone, setTone] = useState(TONE_PROMPTS.casual as string);
  const [preview, setPreview] = useState<undefined | string>(undefined);
  const [modify, setModify] = useState<undefined | string>(undefined);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    await generateContent({
      prompt: input.trim(),
      tone: tone,
      modify: modify,
      content: preview,
    }).then((content) => {
      setPreview(content);
      setGenerationComplete(true);
    });
  };

  const handleInsert = () => {
    if (typeof getPos === 'function' && preview) {
      // Delete the node
      const pos = getPos();
      editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize });

      // Insert the generated content at the same position
      editor.commands.insertContentAt(pos, preview);
    }
  };

  const handleMistralVertexConfig = (model: AImodelConfig) => {
    // Custom logic for Mistral-Vertex
    const { projectId, location, endpointId } = model;
    if (projectId && location && endpointId) {
      setConfig({
        model: model.id,
        projectId,
        location,
        endpointId,
      });
    }
  };

  const handleConfig = (model: AImodelConfig, key: AImodelKey) => {
    if (model.id === 'Mistral-Vertex') {
      handleMistralVertexConfig(model);
    } else {
      setConfig({ model: model.id, apiKey: model.apiKey! });
    }

    setModel(key);
  };

  const handleTone = (tone: string) => {
    setTone(tone);
  };

  const handleModify = (modify: string) => {
    setModify(modify);
  };

  return (
    <NodeViewWrapper className="ai-assistant-node border-2  border-neutral-300 p-4 my-2 rounded-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="size-4" />
            <span className="font-medium">AI Assistant</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (typeof getPos === 'function') {
                editor.commands.deleteRange({
                  from: getPos(),
                  to: getPos() + node.nodeSize,
                });
              }
            }}
          >
            <TrashIcon className="size-4" />
          </Button>
        </div>

        {preview && <MarkdownEditor content={preview} />}

        <Textarea
          className="w-full border-1 focus-visible:outline-0 max-h-[200px] outline-none focus-visible:ring-0  focus-visible:border-neutral-400"
          placeholder="Tell me a joke! , write a story..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex flex-wrap gap-2 justify-end items-center">
          <Select value={tone} onValueChange={(tone) => handleTone(tone)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={`${tone}`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TONE_PROMPTS).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            disabled={!generationComplete}
            value={modify}
            onValueChange={(modify) => handleModify(modify)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={modify || 'modify'} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(MODIFICATION_PROMPTS).map(
                ([key, { prompt, label, icon: Icon }]) => (
                  <SelectItem key={key} value={prompt} className="flex gap-x-2">
                    <Icon className="size-4" />
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          <Select
            value={model}
            onValueChange={(model) => {
              const key = model as AImodelKey;
              const modelConfig = AImodels[key];

              handleConfig(modelConfig, key);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={`${model}`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AImodels).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.id.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {generationComplete && (
            <Button onClick={handleInsert} variant="outline" className="gap-1">
              <CheckIcon className="size-4" />
              <span>Insert</span>
            </Button>
          )}

          <Button
            disabled={state.isProcessing}
            onClick={handleGenerate}
            className="gap-1"
          >
            <PenIcon className="size-4" />
            {state.isProcessing
              ? 'Generating...'
              : generationComplete
                ? 'Regenerate'
                : 'Generate'}
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
