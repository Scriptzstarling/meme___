import React from 'react';
import { Eye, EyeOff, Move, Trash2, Copy } from 'lucide-react';

const LayerPanel = ({ layers, onLayerUpdate, onLayerDelete, onLayerDuplicate, onLayerToggle, selectedLayerId, onLayerSelect }) => {
  const moveLayer = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= layers.length) return;
    
    const newLayers = [...layers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, movedLayer);
    
    // Update z-index for all layers
    newLayers.forEach((layer, index) => {
      onLayerUpdate(layer.id, { ...layer, zIndex: layers.length - index });
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Move className="w-4 h-4" />
        Layers ({layers.length})
      </h3>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`flex items-center gap-2 p-2 rounded border transition-colors ${
              selectedLayerId === layer.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onLayerSelect(layer.id)}
          >
            {/* Layer Type Icon */}
            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-mono">
              {layer.type === 'text' ? 'T' : layer.type === 'sticker' ? '🎭' : '📷'}
            </div>
            
            {/* Layer Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">
                {layer.type === 'text' ? layer.content || 'Text' : layer.name || `${layer.type} ${index + 1}`}
              </div>
              <div className="text-xs text-gray-500">
                {layer.type} • z:{layer.zIndex}
              </div>
            </div>
            
            {/* Layer Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerToggle(layer.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title={layer.visible ? 'Hide' : 'Show'}
              >
                {layer.visible ? (
                  <Eye className="w-3 h-3 text-gray-600" />
                ) : (
                  <EyeOff className="w-3 h-3 text-gray-400" />
                )}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerDuplicate(layer.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Duplicate"
              >
                <Copy className="w-3 h-3 text-gray-600" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLayerDelete(layer.id);
                }}
                className="p-1 hover:bg-red-200 text-red-600 rounded"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            
            {/* Move buttons */}
            <div className="flex flex-col">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayer(index, index - 1);
                }}
                disabled={index === 0}
                className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Move up"
              >
                <div className="w-2 h-2 border-l border-t border-gray-600 transform rotate-45"></div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  moveLayer(index, index + 1);
                }}
                disabled={index === layers.length - 1}
                className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                title="Move down"
              >
                <div className="w-2 h-2 border-r border-b border-gray-600 transform rotate-45"></div>
              </button>
            </div>
          </div>
        ))}
        
        {layers.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No layers yet. Add some text or stickers!
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerPanel;