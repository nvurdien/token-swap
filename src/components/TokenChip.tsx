// components/TokenChip.tsx
'use client';

import { useDrag } from 'react-dnd';
import { Token } from '../app/types';

export const TokenChip = ({
  token,
  fromZone,
  onRemove,
}: {
  token: Token;
  fromZone?: 'source' | 'target';
  onRemove?: () => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'token',
    item: { token, fromZone },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Combine the drag and drop refs using a callback
  const dragDropRef = (node: HTMLDivElement | null) => {
   drag(node);
 };

  return (
    <div
      ref={dragDropRef}
      className={`
        flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-full
        ${isDragging ? 'opacity-50' : ''}
        cursor-move transition-opacity
      `}
    >
      <span>{token.symbol}</span>
      {
        onRemove && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-gray-500 hover:text-gray-400 dark:text-gray-300"
          >
            ×
          </button>
        )
      }
    </div>
  );
};