import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCw, Trash2, Copy } from 'lucide-react';

const DraggableText = ({ 
  text, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  canvasWidth, 
  canvasHeight, 
  isSelected, 
  onSelect,
  zIndex 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const textRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    onSelect();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const canvas = textRef.current?.closest('.meme-canvas');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const newX = ((e.clientX - canvasRect.left - dragStart.x) / canvasRect.width) * 100;
    const newY = ((e.clientY - canvasRect.top - dragStart.y) / canvasRect.height) * 100;
    
    onUpdate({
      ...text,
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const textStyle = {
    position: 'absolute',
    left: `${text.x}%`,
    top: `${text.y}%`,
    transform: `translate(-50%, -50%) rotate(${text.rotation || 0}deg)`,
    fontSize: `${text.fontSize}px`,
    color: text.color,
    fontFamily: text.fontFamily || 'Impact, Arial Black, sans-serif',
    fontWeight: text.fontWeight || 'bold',
    textShadow: text.strokeWidth > 0 ? `
      -${text.strokeWidth}px -${text.strokeWidth}px 0 ${text.stroke},
      ${text.strokeWidth}px -${text.strokeWidth}px 0 ${text.stroke},
      -${text.strokeWidth}px ${text.strokeWidth}px 0 ${text.stroke},
      ${text.strokeWidth}px ${text.strokeWidth}px 0 ${text.stroke}
    ` : 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    zIndex: zIndex,
    background: text.background || 'transparent',
    padding: text.background !== 'transparent' ? '4px 8px' : '0',
    borderRadius: text.background !== 'transparent' ? '4px' : '0',
    border: isSelected ? '2px dashed #3b82f6' : 'none',
    minWidth: '20px',
    minHeight: '20px'
  };

  return (
    <div
      ref={textRef}
      style={textStyle}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
      className={`draggable-text ${isSelected ? 'selected' : ''}`}
    >
      {text.content || 'Text'}
      
      {isSelected && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ ...text, rotation: (text.rotation || 0) + 15 });
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Rotate"
          >
            <RotateCw className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 text-red-600 rounded"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DraggableText;