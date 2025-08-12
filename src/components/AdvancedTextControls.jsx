import React from 'react';
import { Type, Palette, RotateCw, AlignCenter } from 'lucide-react';

const AdvancedTextControls = ({ text, onChange }) => {
  const fonts = [
    'Impact, Arial Black, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Comic Sans MS, cursive',
    'Courier New, monospace',
    'Trebuchet MS, sans-serif',
    'Palatino, serif'
  ];

  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '100', label: 'Thin' },
    { value: '300', label: 'Light' },
    { value: '500', label: 'Medium' },
    { value: '700', label: 'Bold' },
    { value: '900', label: 'Black' }
  ];

  const backgroundOptions = [
    { value: 'transparent', label: 'None', color: 'transparent' },
    { value: '#000000', label: 'Black', color: '#000000' },
    { value: '#FFFFFF', label: 'White', color: '#FFFFFF' },
    { value: '#FF0000', label: 'Red', color: '#FF0000' },
    { value: '#00FF00', label: 'Green', color: '#00FF00' },
    { value: '#0000FF', label: 'Blue', color: '#0000FF' },
    { value: '#FFFF00', label: 'Yellow', color: '#FFFF00' },
    { value: '#FF00FF', label: 'Magenta', color: '#FF00FF' },
    { value: '#00FFFF', label: 'Cyan', color: '#00FFFF' }
  ];

  const updateText = (updates) => {
    onChange({ ...text, ...updates });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Type className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">Text Properties</h3>
      </div>

      {/* Text Content */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
        <textarea
          value={text.content || ''}
          onChange={(e) => updateText({ content: e.target.value })}
          placeholder="Enter your text..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
        <select
          value={text.fontFamily || fonts[0]}
          onChange={(e) => updateText({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {fonts.map((font, index) => (
            <option key={index} value={font} style={{ fontFamily: font }}>
              {font.split(',')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size and Weight */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="12"
              max="120"
              value={text.fontSize || 48}
              onChange={(e) => updateText({ fontSize: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-xs text-gray-600 w-8">{text.fontSize || 48}</span>
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Weight</label>
          <select
            value={text.fontWeight || 'bold'}
            onChange={(e) => updateText({ fontWeight: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
          >
            {fontWeights.map((weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={text.color || '#FFFFFF'}
              onChange={(e) => updateText({ color: e.target.value })}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={text.color || '#FFFFFF'}
              onChange={(e) => updateText({ color: e.target.value })}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Outline Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={text.stroke || '#000000'}
              onChange={(e) => updateText({ stroke: e.target.value })}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={text.stroke || '#000000'}
              onChange={(e) => updateText({ stroke: e.target.value })}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Outline Width */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Outline Width</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="10"
            value={text.strokeWidth || 3}
            onChange={(e) => updateText({ strokeWidth: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-8">{text.strokeWidth || 3}px</span>
        </div>
      </div>

      {/* Background */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
        <div className="grid grid-cols-3 gap-1">
          {backgroundOptions.map((bg) => (
            <button
              key={bg.value}
              onClick={() => updateText({ background: bg.value })}
              className={`p-2 rounded border text-xs ${
                (text.background || 'transparent') === bg.value
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ 
                backgroundColor: bg.color,
                color: bg.color === '#FFFFFF' || bg.color === '#FFFF00' || bg.color === '#00FFFF' ? '#000' : '#FFF'
              }}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Rotation</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="-180"
            max="180"
            value={text.rotation || 0}
            onChange={(e) => updateText({ rotation: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-xs text-gray-600 w-12">{text.rotation || 0}°</span>
          <button
            onClick={() => updateText({ rotation: 0 })}
            className="p-1 hover:bg-gray-100 rounded"
            title="Reset rotation"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTextControls;