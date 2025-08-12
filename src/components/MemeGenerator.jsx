@@ .. @@
 import React, { useState, useRef, useCallback, useEffect } from 'react';
-import { RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause, Download } from 'lucide-react';
+import { RotateCcw, Palette, Type, Image as ImageIcon, Video, Play, Pause, Download, Plus, Layers, Sticker } from 'lucide-react';
 import ImageUpload from './ImageUpload';
-import TextControls from './TextControls';
+import AdvancedTextControls from './AdvancedTextControls';
+import LayerPanel from './LayerPanel';
+import StickerPanel from './StickerPanel';
+import DraggableText from './DraggableText';
 import { drawMemeOnCanvas, drawMemeOnVideo } from '../utils/canvas.js';
 
 const MemeGenerator = ({ preselectedTemplate }) => {
   const [selectedImage, setSelectedImage] = useState('');
   const [mediaType, setMediaType] = useState('image'); // 'image', 'video', 'gif'
   const [isPlaying, setIsPlaying] = useState(false);
-  const [topText, setTopText] = useState({
-    content: 'TOP TEXT',
-    fontSize: 48,
-    color: '#FFFFFF',
-    stroke: '#000000',
-    strokeWidth: 3,
-    y: 50
-  });
-  const [bottomText, setBottomText] = useState({
-    content: 'BOTTOM TEXT',
-    fontSize: 48,
-    color: '#FFFFFF',
-    stroke: '#000000',
-    strokeWidth: 3,
-    y: 90
-  });
+  const [layers, setLayers] = useState([]);
+  const [selectedLayerId, setSelectedLayerId] = useState(null);
+  const [activePanel, setActivePanel] = useState('upload');
 
   const previewRef = useRef(null);
   const videoRef = useRef(null);
@@ .. @@
   // Handle preselected template
   useEffect(() => {
     if (preselectedTemplate) {
       handleImageSelect(preselectedTemplate);
-      // Clear the preselected template after using it
-      setTimeout(() => {
-        // This ensures the template loads properly
-      }, 100);
+      // Add default text layers
+      addDefaultTextLayers();
     }
   }, [preselectedTemplate]);

+  const addDefaultTextLayers = () => {
+    const defaultLayers = [
+      {
+        id: 'top-text-' + Date.now(),
+        type: 'text',
+        content: 'TOP TEXT',
+        x: 50,
+        y: 20,
+        fontSize: 48,
+        color: '#FFFFFF',
+        stroke: '#000000',
+        strokeWidth: 3,
+        fontFamily: 'Impact, Arial Black, sans-serif',
+        fontWeight: 'bold',
+        rotation: 0,
+        background: 'transparent',
+        visible: true,
+        zIndex: 2
+      },
+      {
+        id: 'bottom-text-' + Date.now() + 1,
+        type: 'text',
+        content: 'BOTTOM TEXT',
+        x: 50,
+        y: 80,
+        fontSize: 48,
+        color: '#FFFFFF',
+        stroke: '#000000',
+        strokeWidth: 3,
+        fontFamily: 'Impact, Arial Black, sans-serif',
+        fontWeight: 'bold',
+        rotation: 0,
+        background: 'transparent',
+        visible: true,
+        zIndex: 1
+      }
+    ];
+    setLayers(defaultLayers);
+    setSelectedLayerId(defaultLayers[0].id);
+  };
+
   const handleAIMemeGenerated = (imageUrl, topTextContent, bottomTextContent) => {
-    setTopText(prev => ({ ...prev, content: topTextContent }));
-    setBottomText(prev => ({ ...prev, content: bottomTextContent }));
+    // Update existing text layers or create new ones
+    const updatedLayers = layers.length > 0 ? layers.map((layer, index) => {
+      if (layer.type === 'text') {
+        if (index === 0) return { ...layer, content: topTextContent };
+        if (index === 1) return { ...layer, content: bottomTextContent };
+      }
+      return layer;
+    }) : [];
+    
+    if (updatedLayers.length === 0) {
+      addDefaultTextLayers();
+    } else {
+      setLayers(updatedLayers);
+    }
   };
 
   const handleImageSelect = (imageUrl) => {
@@ .. @@
     }
   };

+  const addTextLayer = () => {
+    const newLayer = {
+      id: 'text-' + Date.now(),
+      type: 'text',
+      content: 'New Text',
+      x: 50,
+      y: 50,
+      fontSize: 48,
+      color: '#FFFFFF',
+      stroke: '#000000',
+      strokeWidth: 3,
+      fontFamily: 'Impact, Arial Black, sans-serif',
+      fontWeight: 'bold',
+      rotation: 0,
+      background: 'transparent',
+      visible: true,
+      zIndex: layers.length + 1
+    };
+    setLayers([...layers, newLayer]);
+    setSelectedLayerId(newLayer.id);
+  };
+
+  const addStickerLayer = (sticker) => {
+    setLayers([...layers, sticker]);
+    setSelectedLayerId(sticker.id);
+  };
+
+  const updateLayer = (layerId, updates) => {
+    setLayers(layers.map(layer => 
+      layer.id === layerId ? { ...layer, ...updates } : layer
+    ));
+  };
+
+  const deleteLayer = (layerId) => {
+    setLayers(layers.filter(layer => layer.id !== layerId));
+    if (selectedLayerId === layerId) {
+      setSelectedLayerId(null);
+    }
+  };
+
+  const duplicateLayer = (layerId) => {
+    const layerToDuplicate = layers.find(layer => layer.id === layerId);
+    if (layerToDuplicate) {
+      const newLayer = {
+        ...layerToDuplicate,
+        id: layerToDuplicate.type + '-' + Date.now(),
+        x: layerToDuplicate.x + 5,
+        y: layerToDuplicate.y + 5,
+        zIndex: layers.length + 1
+      };
+      setLayers([...layers, newLayer]);
+      setSelectedLayerId(newLayer.id);
+    }
+  };
+
+  const toggleLayerVisibility = (layerId) => {
+    setLayers(layers.map(layer => 
+      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
+    ));
+  };
+
   const updatePreview = useCallback(() => {
     if (!selectedImage) return;
     if (mediaType === 'video') {
       updateVideoPreview();
     } else {
       updateImagePreview();
     }
-  }, [selectedImage, topText, bottomText, mediaType]);
+  }, [selectedImage, layers, mediaType]);
 
   const updateImagePreview = () => {
     if (!previewRef.current) return;
     const img = new Image();
     img.crossOrigin = 'anonymous';
     img.onload = () => {
-      drawMemeOnCanvas(previewRef.current, img, topText, bottomText);
+      drawMemeOnCanvas(previewRef.current, img, layers);
     };
     img.src = selectedImage;
   };
@@ .. @@
       const drawFrame = () => {
         if (video.videoWidth && video.videoHeight) {
           canvas.width = Math.min(video.videoWidth, 600);
           canvas.height = Math.min(video.videoHeight, 600);
           ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
-          drawMemeOnVideo(canvas, topText, bottomText);
+          drawMemeOnVideo(canvas, layers);
         }
         if (isPlaying) {
           animationFrameRef.current = requestAnimationFrame(drawFrame);
@@ .. @@
       if (video.videoWidth && video.videoHeight) {
         canvas.width = Math.min(video.videoWidth, 600);
         canvas.height = Math.min(video.videoHeight, 600);
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
-        drawMemeOnVideo(canvas, topText, bottomText);
+        drawMemeOnVideo(canvas, layers);
       }
     }
   };
@@ .. @@
   useEffect(() => {
     updatePreview();
   }, [updatePreview]);

   const resetMeme = () => {
-    setTopText(prev => ({ ...prev, content: 'TOP TEXT' }));
-    setBottomText(prev => ({ ...prev, content: 'BOTTOM TEXT' }));
+    setLayers([]);
+    setSelectedLayerId(null);
     setIsPlaying(false);
     cancelAnimationFrame(animationFrameRef.current);
   };
@@ .. @@
     return () => cancelAnimationFrame(animationFrameRef.current);
   }, []);

+  const selectedLayer = layers.find(layer => layer.id === selectedLayerId);
+
   return (
-    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
-      {/* Image Upload */}
-      <div className="w-full lg:w-1/4">
-        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
-          <div className="flex items-center gap-2 mb-4">
-            {mediaType === 'video' ? (
-              <Video className="h-6 w-6 text-blue-600" />
-            ) : (
-              <ImageIcon className="h-6 w-6 text-blue-600" />
-            )}
-            <h3 className="text-lg font-semibold text-gray-900">Choose Media</h3>
+    <div className="flex flex-col xl:flex-row gap-6 max-w-[1400px] mx-auto px-4 py-6">
+      {/* Left Sidebar - Controls */}
+      <div className="w-full xl:w-80 space-y-4">
+        {/* Panel Tabs */}
+        <div className="bg-white rounded-lg border border-gray-200 p-1">
+          <div className="grid grid-cols-4 gap-1">
+            {[
+              { id: 'upload', icon: ImageIcon, label: 'Media' },
+              { id: 'text', icon: Type, label: 'Text' },
+              { id: 'stickers', icon: Sticker, label: 'Stickers' },
+              { id: 'layers', icon: Layers, label: 'Layers' }
+            ].map((tab) => {
+              const IconComponent = tab.icon;
+              return (
+                <button
+                  key={tab.id}
+                  onClick={() => setActivePanel(tab.id)}
+                  className={`flex flex-col items-center gap-1 p-2 rounded text-xs font-medium transition-colors ${
+                    activePanel === tab.id
+                      ? 'bg-blue-100 text-blue-700'
+                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
+                  }`}
+                >
+                  <IconComponent className="w-4 h-4" />
+                  {tab.label}
+                </button>
+              );
+            })}
           </div>
-          <ImageUpload
-            onImageSelect={handleImageSelect}
-            onAIMemeGenerated={handleAIMemeGenerated}
-            onViewMoreTemplates={() => {
-              // This will be handled by the parent App component
-              window.dispatchEvent(new CustomEvent('viewMoreTemplates'));
-            }}
-          />
         </div>
+
+        {/* Panel Content */}
+        {activePanel === 'upload' && (
+          <div className="bg-white rounded-lg border border-gray-200 p-4">
+            <div className="flex items-center gap-2 mb-4">
+              {mediaType === 'video' ? (
+                <Video className="h-5 w-5 text-blue-600" />
+              ) : (
+                <ImageIcon className="h-5 w-5 text-blue-600" />
+              )}
+              <h3 className="text-sm font-semibold text-gray-900">Choose Media</h3>
+            </div>
+            <ImageUpload
+              onImageSelect={handleImageSelect}
+              onAIMemeGenerated={handleAIMemeGenerated}
+              onViewMoreTemplates={() => {
+                window.dispatchEvent(new CustomEvent('viewMoreTemplates'));
+              }}
+            />
+          </div>
+        )}
+
+        {activePanel === 'text' && (
+          <div className="space-y-4">
+            <div className="bg-white rounded-lg border border-gray-200 p-4">
+              <div className="flex items-center justify-between mb-3">
+                <h3 className="text-sm font-semibold text-gray-900">Text Layers</h3>
+                <button
+                  onClick={addTextLayer}
+                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
+                >
+                  <Plus className="w-3 h-3" />
+                  Add Text
+                </button>
+              </div>
+              {layers.filter(l => l.type === 'text').length === 0 && (
+                <p className="text-xs text-gray-500 text-center py-4">
+                  No text layers. Click "Add Text" to create one.
+                </p>
+              )}
+            </div>
+            
+            {selectedLayer && selectedLayer.type === 'text' && (
+              <AdvancedTextControls
+                text={selectedLayer}
+                onChange={(updates) => updateLayer(selectedLayerId, updates)}
+              />
+            )}
+          </div>
+        )}
+
+        {activePanel === 'stickers' && (
+          <StickerPanel onAddSticker={addStickerLayer} />
+        )}
+
+        {activePanel === 'layers' && (
+          <LayerPanel
+            layers={layers}
+            selectedLayerId={selectedLayerId}
+            onLayerSelect={setSelectedLayerId}
+            onLayerUpdate={updateLayer}
+            onLayerDelete={deleteLayer}
+            onLayerDuplicate={duplicateLayer}
+            onLayerToggle={toggleLayerVisibility}
+          />
+        )}
       </div>

       {/* Preview */}
-      <div className="flex-1 min-w-[450px] flex flex-col items-center">
+      <div className="flex-1 min-w-[500px] flex flex-col items-center">
         <div className="flex items-center gap-3 mb-4">
-          <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
+          <h3 className="text-lg font-semibold text-gray-900">Meme Preview</h3>
           {mediaType === 'video' && selectedImage && (
             <button
               onClick={togglePlayPause}
@@ .. @@
         
         {selectedImage ? (
           <>
-            <div className="relative">
+            <div className="relative meme-canvas">
               {mediaType === 'video' && (
                 <video
                   ref={videoRef}
@@ .. @@
                   loop
                   muted
                 />
               )}
               <canvas
                 ref={previewRef}
-                className="w-full max-w-[600px] max-h-[550px] rounded-xl shadow-md border border-gray-300"
+                className="w-full max-w-[600px] max-h-[600px] rounded-xl shadow-lg border border-gray-300 bg-white"
                 width={600}
                 height={600}
               />
+              
+              {/* Draggable Elements Overlay */}
+              <div className="absolute inset-0 pointer-events-none">
+                {layers.filter(layer => layer.visible).map((layer) => (
+                  <div key={layer.id} className="pointer-events-auto">
+                    {layer.type === 'text' && (
+                      <DraggableText
+                        text={layer}
+                        onUpdate={(updates) => updateLayer(layer.id, updates)}
+                        onDelete={() => deleteLayer(layer.id)}
+                        onDuplicate={() => duplicateLayer(layer.id)}
+                        canvasWidth={600}
+                        canvasHeight={600}
+                        isSelected={selectedLayerId === layer.id}
+                        onSelect={() => setSelectedLayerId(layer.id)}
+                        zIndex={layer.zIndex}
+                      />
+                    )}
+                    {layer.type === 'sticker' && (
+                      <div
+                        style={{
+                          position: 'absolute',
+                          left: `${layer.x}%`,
+                          top: `${layer.y}%`,
+                          transform: `translate(-50%, -50%) rotate(${layer.rotation || 0}deg)`,
+                          fontSize: `${layer.size || 40}px`,
+                          zIndex: layer.zIndex,
+                          cursor: 'pointer',
+                          border: selectedLayerId === layer.id ? '2px dashed #3b82f6' : 'none'
+                        }}
+                        onClick={() => setSelectedLayerId(layer.id)}
+                      >
+                        {layer.content}
+                        {layer.shape && (
+                          <div
+                            style={{
+                              width: `${layer.size || 40}px`,
+                              height: `${layer.size || 40}px`,
+                              backgroundColor: layer.shape.color,
+                              borderRadius: layer.shape.type === 'circle' ? '50%' : '0'
+                            }}
+                          />
+                        )}
+                      </div>
+                    )}
+                  </div>
+                ))}
+              </div>
+              
               {mediaType === 'video' && (
                 <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                   {isPlaying ? 'Playing' : 'Paused'} • Click Play to preview
@@ .. @@
             )}
             {/* Download button under preview */}
             <button
               onClick={downloadMeme}
-              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
+              className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium shadow-lg"
             >
               <Download className="h-4 w-4" />
               Download Meme
@@ .. @@
         ) : (
           <div className="w-full max-w-lg h-96 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
             <div className="text-center">
               <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
               <p className="text-base text-gray-600 font-medium">
-                Select media to start
+                Select media to start creating
               </p>
               <p className="text-sm text-gray-400 mt-1">
-                Images, videos, GIFs supported
+                Upload images, videos, GIFs or use AI generation
               </p>
             </div>
           </div>
         )}
       </div>

-      {/* Text Settings & Actions */}
-      <div className="w-full lg:w-1/4 space-y-5">
-        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
-          <div className="flex items-center gap-2 mb-4">
-            <Type className="h-6 w-6 text-purple-600" />
-            <h3 className="text-lg font-semibold text-gray-900">Text Settings</h3>
-          </div>
-          <div className="space-y-5">
-            <TextControls
-              text={topText}
-              onChange={setTopText}
-              placeholder="Enter top text..."
-            />
-            <TextControls
-              text={bottomText}
-              onChange={setBottomText}
-              placeholder="Enter bottom text..."
-            />
-          </div>
-        </div>
-
-        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
-          <div className="flex items-center gap-2 mb-3">
+      {/* Right Sidebar - Actions */}
+      <div className="w-full xl:w-64 space-y-4">
+        <div className="bg-white rounded-lg border border-gray-200 p-4">
+          <div className="flex items-center gap-2 mb-3">
             <Palette className="h-6 w-6 text-green-600" />
-            <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
+            <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
           </div>
-          <div className="grid grid-cols-1 gap-3">
+          <div className="space-y-2">
+            <button
+              onClick={addTextLayer}
+              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg text-sm font-medium"
+            >
+              <Plus className="h-4 w-4" />
+              Add Text
+            </button>
             <button
               onClick={resetMeme}
-              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-lg text-sm font-medium"
+              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 rounded-lg text-sm font-medium"
             >
               <RotateCcw className="h-4 w-4" />
-              Reset
+              Clear All
             </button>
           </div>
         </div>
+        
+        {/* Layer Info */}
+        {selectedLayer && (
+          <div className="bg-white rounded-lg border border-gray-200 p-4">
+            <h3 className="text-sm font-semibold text-gray-900 mb-2">Selected Layer</h3>
+            <div className="text-xs text-gray-600 space-y-1">
+              <div>Type: {selectedLayer.type}</div>
+              <div>Position: {Math.round(selectedLayer.x)}%, {Math.round(selectedLayer.y)}%</div>
+              {selectedLayer.type === 'text' && (
+                <div>Font Size: {selectedLayer.fontSize}px</div>
+              )}
+              <div>Z-Index: {selectedLayer.zIndex}</div>
+            </div>
+          </div>
+        )}
       </div>
     </div>
   );
 };