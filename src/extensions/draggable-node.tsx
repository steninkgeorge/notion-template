import { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Grip } from 'lucide-react';
import styled from 'styled-components';

const Wrapper = styled(NodeViewWrapper)`
  position: relative;
  width: 100%;
  margin: 0.5rem 0;

  &:hover .drag-handle {
    opacity: 1;
  }
`;

const DragHandle = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  transform: translateY(0.25rem);
  width: 1rem;
  height: 1rem;
  background-color: transparent;
  cursor: grab;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease-in-out;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  padding-left: 1.5rem;
  flex: 1;

  & p.is-editor-empty:first-child::before,
  & p.is-node-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

export const DraggableNode = () => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store the timeout ID
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);

  const SCROLL_THRESHOLD = 200; // px from edge of window
  const SCROLL_SPEED = 15; // px per interval

  const handleMouseEnter = () => {
    setVisible(true);
    resetTimer();
  };

  const handleMouseMove = () => {
    setVisible(true);
    resetTimer();
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear previous timeout
    }
    timeoutRef.current = setTimeout(() => setVisible(false), 500); // Hide after 1s
  };
  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const startScrolling = useCallback(
    (direction: 'up' | 'down') => {
      stopScrolling();

      scrollIntervalRef.current = setInterval(() => {
        const scrollAmount = direction === 'up' ? -SCROLL_SPEED : SCROLL_SPEED;
        window.scrollBy(0, scrollAmount);
      }, 16);
    },
    [stopScrolling]
  );

  const handleDrag = useCallback(
    (event: DragEvent) => {
      const { clientY } = event;
      const windowHeight = window.innerHeight;

      if (clientY < SCROLL_THRESHOLD) {
        startScrolling('up');
      } else if (clientY > windowHeight - SCROLL_THRESHOLD) {
        startScrolling('down');
      } else {
        stopScrolling();
      }
    },
    [startScrolling, stopScrolling]
  );

  useEffect(() => {
    const dragHandle = dragHandleRef.current;
    if (!dragHandle) return;

    const handleDragStart = () => {
      document.addEventListener('drag', handleDrag);
    };

    const handleDragEnd = () => {
      document.removeEventListener('drag', handleDrag);
      stopScrolling();
    };

    dragHandle.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    document.addEventListener('drop', handleDragEnd);

    return () => {
      dragHandle.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
      document.removeEventListener('drag', handleDrag);
      stopScrolling();
    };
  }, [handleDrag, stopScrolling]);

  return (
    <Wrapper onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove}>
      <DragHandle
        ref={dragHandleRef}
        $visible={visible}
        contentEditable={false}
        data-drag-handle
        draggable="true"
        className="drag-handle"
      >
        <Grip style={{ width: '1rem', height: '1rem', color: '#9ca3af' }} />
      </DragHandle>
      <ContentWrapper>
        <NodeViewContent />
      </ContentWrapper>
    </Wrapper>
  );
};
