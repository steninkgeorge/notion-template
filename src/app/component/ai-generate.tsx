import { useAIAssistant } from "@/ai-extension/hooks/use-ai-hook";
import { useAiAssistantState } from "@/ai-extension/store/ai-state-store";
import { AImodel } from "@/ai-extension/types/index ";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TONE_PROMPTS, MODIFICATION_PROMPTS } from "@/constants/ai-prompt-constants";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { MessageSquareIcon, CheckIcon, PenIcon } from "lucide-react";
import { useState } from "react";
import { useEditorStore } from "../store/use-editor-store";
import { MarkdownEditor } from "./preview-editor";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import React from "react";

interface props {
  tone: string;
  prompt: string;
  modify: string | undefined;
  content: string | undefined;
}
export const AIGenerateToolbarComponent = () => {
      const { editor } = useEditorStore();

  const { generateContent, ...state } = useAIAssistant({ editor: editor! });
  const { setConfig } = useAiAssistantState();
  const [isOpen, setIsOpen] = useState(state.isProcessing);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(AImodel.Gemini as string);
  const [tone, setTone] = useState(TONE_PROMPTS.casual as string);
  const [preview, setPreview] = useState<undefined | string>(undefined);
  const [modify, setModify] = useState<undefined | string>(undefined);
  const [insert, setInsertContent] = useState(false);
  const [regenerate, setRegenerate] = useState(false);

  //agent tone
  //preview , regenerate and insert options
  //modify option enabled if preview is true

  const handleGenerate = async (e: React.MouseEvent, props: props) => {
    e.preventDefault();
    console.log("handle click");

    await generateContent(props)
      .then((content) => {
        setPreview(content);
      })
      .finally(() => {
        setInsertContent(true);
        setRegenerate(true);
      });
  };

  const handleConfig = (model: string) => {
    setConfig({ model: model });
    setModel(model);
  };

  const handleTone = (tone: string) => {
    setTone(tone);
  };
  const handleModify = (modify: string) => {
    setModify(modify);
  };

  return (
    
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="hover:bg-neutral-300">
            <MessageSquareIcon className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col  ">
          <DialogHeader>
            <DialogTitle>Write your thoughts here.. </DialogTitle>
          </DialogHeader>
          {preview && <MarkdownEditor content={preview} />}
          <Input
            className="w-full border-1   truncate focus-visible:border-none focus-visible:outline-0 outline-none px-1.5"
            placeholder="Tell us a dad joke! , write a story..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <DialogFooter className="flex gap-x-4 justify-end item-cente overflow-x-auto">
            <Select value={tone} onValueChange={(tone) => handleTone(tone)}>
              <SelectTrigger className="w-[180px]">
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
              disabled={!insert}
              value={modify}
              onValueChange={(modify) => handleModify(modify)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={modify || "modify"} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MODIFICATION_PROMPTS).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={model}
              onValueChange={(model) => handleConfig(model)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`${model}`} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AImodel).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {insert && (
              <Button
                disabled={state.isProcessing}
                onClick={() => {
                  editor?.commands.insertContent(preview as string);

                  setInsertContent(false);
                  setPreview(undefined);
                  setRegenerate(false);
                  setInput("");
                  setIsOpen(false);
                }}
                variant={"ghost"}
              >
                <CheckIcon className="size-4" />
                <span className="text-neutral-400">Insert</span>
              </Button>
            )}

            <div className="flex item-center justify-center">
              <Button
                disabled={state.isProcessing}
                onClick={(e) =>
                  handleGenerate(e, {
                    prompt: input.trim(),
                    tone: tone,
                    modify: modify,
                    content: preview,
                  })
                }
              >
                <PenIcon className="size-4" />
                {state.isProcessing
                  ? "Generating..."
                  : regenerate
                  ? "Regenerate"
                  : "Generate"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};
