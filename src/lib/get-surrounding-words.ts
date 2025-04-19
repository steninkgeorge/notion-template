import { Editor } from '@tiptap/react';

function isWhitespace(char: string) {
  return /\s/.test(char);
}

export const getSurroundingWords = (editor: Editor, pos: number) => {
  const $pos = editor.state.doc.resolve(pos);
  const node = $pos.parent;
  const nodeStart = $pos.start();
  const text = node.textContent;
  const relativePos = pos - nodeStart;

  let wordStart = relativePos;
  while (wordStart > 0 && !isWhitespace(text.charAt(wordStart - 1))) {
    wordStart--;
  }

  let wordEnd = relativePos;
  while (wordEnd < text.length && !isWhitespace(text.charAt(wordEnd))) {
    wordEnd++;
  }

  let prevWordStart = wordStart;
  while (prevWordStart > 0 && isWhitespace(text.charAt(prevWordStart - 1))) {
    prevWordStart--;
  }
  let prevWordEnd = prevWordStart;
  while (prevWordEnd > 0 && !isWhitespace(text.charAt(prevWordEnd - 1))) {
    prevWordEnd--;
  }

  let nextWordStart = wordEnd;
  while (
    nextWordStart < text.length &&
    isWhitespace(text.charAt(nextWordStart))
  ) {
    nextWordStart++;
  }
  let nextWordEnd = nextWordStart;
  while (nextWordEnd < text.length && !isWhitespace(text.charAt(nextWordEnd))) {
    nextWordEnd++;
  }

  return {
    currentWord: {
      text: text.slice(wordStart, wordEnd),
      from: nodeStart + wordStart,
      to: nodeStart + wordEnd,
    },
    previousWord:
      prevWordStart !== prevWordEnd
        ? {
            text: text.slice(prevWordEnd, prevWordStart),
            from: nodeStart + prevWordEnd,
            to: nodeStart + prevWordStart,
          }
        : null,
    nextWord:
      nextWordStart !== nextWordEnd
        ? {
            text: text.slice(nextWordStart, nextWordEnd),
            from: nodeStart + nextWordStart,
            to: nodeStart + nextWordEnd,
          }
        : null,
  };
};
