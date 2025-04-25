'use client';
import { usePanelProps } from '@/app/store/panel';
import { Minimize2Icon } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

interface SuggestionPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  isDialogOpen?: boolean; // Add prop to know if dialog is open
  defaultVisible?: boolean;
}

export const SuggestionPanel = ({
  children,
  className = '',
  title = 'Suggestion Panel',
  isDialogOpen = false,
  defaultVisible = false,
}: SuggestionPanelProps) => {
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const { visible, setVisiblity } = usePanelProps();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      setPosition({
        x: screenWidth - 280,
        y: 80,
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !panelRef.current) return;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;

      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - panelWidth, newX)),
        y: Math.max(0, Math.min(window.innerHeight - panelHeight, newY)),
      });
    },
    [isDragging, offset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't allow dragging if dialog is open
    if (e.button !== 0 || !panelRef.current) return;

    const rect = panelRef.current.getBoundingClientRect();
    setIsDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
  };

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed bg-white shadow-lg rounded-md z-20 ${
        isDragging
          ? 'cursor-grabbing'
          : isDialogOpen
            ? 'cursor-default'
            : 'cursor-grab'
      } ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
        touchAction: 'none',
      }}
      onMouseDown={startDrag}
    >
      <div className="p-3 border-b border-gray-200 select-none">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">{title}</span>
          <Minimize2Icon
            className="size-4 "
            onClick={() => setVisiblity(!visible)}
          />
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
};
