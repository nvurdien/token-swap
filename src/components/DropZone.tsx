// components/DropZone.tsx
'use client';

import { useDrop } from 'react-dnd';
import { TokenChip } from '@/components/TokenChip';
import { Token } from '../app/types';

export const DropZone = ({
  type,
  token,
  onDrop,
}: {
  type: 'source' | 'target';
  token: Token | null;
  onDrop: (token: Token | null, fromZone: 'source' | 'target' | undefined, toZone: 'source' | 'target') => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'token',
    drop: (item: { token: Token; fromZone?: 'source' | 'target' }) => {
      onDrop(item.token, item.fromZone, type);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

   // Combine the drag and drop refs using a callback
   const dragDropRef = (node: HTMLDivElement | null) => {
    drop(node);
  };

  return (
    <div
      ref={dragDropRef}
      className={`
        md:w-64 w-52 h-32 border-2 rounded-xl p-4
        flex items-center justify-center flex-wrap content-center
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'}
        dark:border-gray-700 dark:bg-gray-800
        transition-colors
      `}
    >
      {token ? (
        <>
          <TokenChip 
          token={token} 
          fromZone={type} 
          onRemove={() => onDrop(null, undefined, type)}
          />
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-0">
            Rate: {token.unitPrice} {token.symbol}
          </div>
        </>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">
          Drag {type} token here
        </span>
      )}
    </div>
  );
};