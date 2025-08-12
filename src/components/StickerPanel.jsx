import React, { useState } from 'react';
import { Smile, Heart, Star, Zap, Flame, ThumbsUp, Coffee, Music } from 'lucide-react';

const StickerPanel = ({ onAddSticker }) => {
  const [activeCategory, setActiveCategory] = useState('emojis');

  const stickerCategories = {
    emojis: {
      name: 'Emojis',
      icon: Smile,
      items: [
        '😀', '😂', '🤣', '😊', '😍', '🤔', '😎', '🤯',
        '😱', '🥳', '😴', '🤤', '🤮', '😵', '🤠', '🤡',
        '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '👊',
        '❤️', '💔', '💯', '💥', '💫', '⭐', '🔥', '💎'
      ]
    },
    shapes: {
      name: 'Shapes',
      icon: Star,
      items: [
        { type: 'circle', color: '#FF0000' },
        { type: 'circle', color: '#00FF00' },
        { type: 'circle', color: '#0000FF' },
        { type: 'circle', color: '#FFFF00' },
        { type: 'square', color: '#FF0000' },
        { type: 'square', color: '#00FF00' },
        { type: 'square', color: '#0000FF' },
        { type: 'square', color: '#FFFF00' },
        { type: 'triangle', color: '#FF0000' },
        { type: 'triangle', color: '#00FF00' },
        { type: 'triangle', color: '#0000FF' },
        { type: 'triangle', color: '#FFFF00' }
      ]
    },
    arrows: {
      name: 'Arrows',
      icon: Zap,
      items: [
        '→', '←', '↑', '↓', '↗', '↖', '↘', '↙',
        '⇒', '⇐', '⇑', '⇓', '⟶', '⟵', '⟷', '↔'
      ]
    }
  };

  const handleStickerClick = (sticker) => {
    const newSticker = {
      id: Date.now() + Math.random(),
      type: 'sticker',
      content: typeof sticker === 'string' ? sticker : '',
      shape: typeof sticker === 'object' ? sticker : null,
      x: 50,
      y: 50,
      size: 40,
      rotation: 0,
      visible: true,
      zIndex: Date.now()
    };
    
    onAddSticker(newSticker);
  };

  const renderShape = (shape) => {
    const shapeStyle = {
      width: '24px',
      height: '24px',
      backgroundColor: shape.color,
      display: 'inline-block'
    };

    switch (shape.type) {
      case 'circle':
        return <div style={{ ...shapeStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div style={shapeStyle} />;
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: `24px solid ${shape.color}`
            }}
          />
        );
      default:
        return <div style={shapeStyle} />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Stickers & Elements</h3>
      
      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 bg-gray-100 rounded-md p-1">
        {Object.entries(stickerCategories).map(([key, category]) => {
          const IconComponent = category.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                activeCategory === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <IconComponent className="w-3 h-3" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Sticker Grid */}
      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
        {stickerCategories[activeCategory].items.map((sticker, index) => (
          <button
            key={index}
            onClick={() => handleStickerClick(sticker)}
            className="aspect-square flex items-center justify-center p-2 border border-gray-200 rounded hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            {typeof sticker === 'string' ? (
              <span className="text-lg">{sticker}</span>
            ) : (
              renderShape(sticker)
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickerPanel;