import { ToolbarButtonProps, ToolbarItemType } from '@/types';
import { BubbleMenu, Editor } from '@tiptap/react';
import { BoldIcon, ItalicIcon, Strikethrough, Underline } from 'lucide-react';
import { AItools } from './ai-tool';
import { Heirarchy } from './text-formatting';
import { FontFamilyButton } from './font-selection';
import { FontSizeOptionButton } from './text-size';
import { MoreOptions } from './more-options';
import styled from 'styled-components';

const StyledBubbleMenu = styled(BubbleMenu)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  padding: 0.125rem;
  gap: 0.25rem;
  width: fit-content;
`;

const StyledButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .tooltip {
    position: absolute;
    top: 100%;
    margin-top: 0.125rem;
    padding: 0.125rem 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: black;
    color: #d4d4d8;
    border-radius: 0.25rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 10;
  }

  &:hover .tooltip {
    opacity: 1;
  }
`;

const StyledIconButton = styled.button<{ $active?: boolean }>`
  padding: 0.25rem;
  margin: 0.125rem;
  background-color: ${({ $active }) => ($active ? '#f5f5f5' : 'transparent')};
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const StyledSeparator = styled.div`
  height: 1.25rem;
  width: 1px;
  background-color: #e5e7eb;
  margin: 0 0.25rem;
`;

const BubbleMenuButton = ({
  label,
  icon: Icon,
  onClick,
  isActive,
}: ToolbarButtonProps) => {
  return (
    <StyledButtonWrapper>
      <StyledIconButton onClick={onClick} $active={isActive}>
        <Icon />
      </StyledIconButton>
      <span className="tooltip">{label}</span>
    </StyledButtonWrapper>
  );
};

export const TextBubbleMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const item: ToolbarItemType = [
    {
      label: 'Bold',
      icon: BoldIcon,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    {
      label: 'Italic',
      icon: ItalicIcon,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    {
      label: 'Underline',
      icon: Underline,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },
    {
      label: 'Strike',
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
    },

    //TODO: add color picker , highlight
  ];

  return (
    <StyledBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex flex-row items-center bg-white rounded-md border px-0.5 gap-1 w-fit"
    >
      <AItools editor={editor} />
      <StyledSeparator />
      <Heirarchy />
      <FontFamilyButton />
      <FontSizeOptionButton />
      {item.map((item, index) => (
        <BubbleMenuButton
          key={index}
          label={item.label}
          icon={item.icon}
          onClick={item.onClick}
          isActive={item.isActive}
        />
      ))}
      <MoreOptions />
    </StyledBubbleMenu>
  );
};
