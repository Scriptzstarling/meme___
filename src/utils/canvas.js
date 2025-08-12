@@ .. @@
 export const drawMemeOnCanvas = (
   canvas,
   image,
-  topText,
-  bottomText
+  layers
 ) => {
   const ctx = canvas.getContext('2d');
   if (!ctx) {
     throw new Error('Could not get canvas context');
   }

   // Set canvas dimensions to match preview
   const maxWidth = 500;
   const maxHeight = 500;

   let { width, height } = image;

   // Scale image to fit canvas while maintaining aspect ratio
   if (width > maxWidth || height > maxHeight) {
     const scale = Math.min(maxWidth / width, maxHeight / height);
     width *= scale;
     height *= scale;
   }

   canvas.width = width;
   canvas.height = height;

   // Clear canvas and draw image
   ctx.clearRect(0, 0, width, height);
   ctx.drawImage(image, 0, 0, width, height);

   // Configure text rendering with better quality
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';
   ctx.imageSmoothingEnabled = true;
   ctx.imageSmoothingQuality = 'high';

-  // Draw text function
-  const drawText = (text) => {
-    if (!text.content.trim()) return;
+  // Sort layers by z-index
+  const sortedLayers = [...layers]
+    .filter(layer => layer.visible)
+    .sort((a, b) => a.zIndex - b.zIndex);

-    const fontSize = Math.max(text.fontSize * (width / 500), 12);
-    ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;
+  // Draw each layer
+  sortedLayers.forEach(layer => {
+    if (layer.type === 'text') {
+      drawTextLayer(ctx, layer, width, height);
+    } else if (layer.type === 'sticker') {
+      drawStickerLayer(ctx, layer, width, height);
+    }
+  });
+};

-    const x = width / 2;
-    const y = (text.y / 100) * height;
+const drawTextLayer = (ctx, layer, canvasWidth, canvasHeight) => {
+  if (!layer.content || !layer.content.trim()) return;

-    // Draw stroke (outline)
-    if (text.strokeWidth > 0) {
-      ctx.strokeStyle = text.stroke;
-      ctx.lineWidth = Math.max(text.strokeWidth * (width / 500), 1);
-      ctx.lineJoin = 'round';
-      ctx.lineCap = 'round';
-      ctx.miterLimit = 2;
-      ctx.strokeText(text.content, x, y);
-    }
+  ctx.save();
+  
+  const fontSize = Math.max(layer.fontSize * (canvasWidth / 500), 12);
+  const fontFamily = layer.fontFamily || 'Impact, Arial Black, sans-serif';
+  const fontWeight = layer.fontWeight || 'bold';
+  
+  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
+  ctx.textAlign = 'center';
+  ctx.textBaseline = 'middle';

-    // Fill text with subtle shadow
-    ctx.fillStyle = text.color;
-    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
-    ctx.shadowBlur = 2;
-    ctx.shadowOffsetX = 1;
-    ctx.shadowOffsetY = 1;
+  const x = (layer.x / 100) * canvasWidth;
+  const y = (layer.y / 100) * canvasHeight;

-    ctx.fillText(text.content, x, y);
+  // Apply rotation
+  if (layer.rotation) {
+    ctx.translate(x, y);
+    ctx.rotate((layer.rotation * Math.PI) / 180);
+    ctx.translate(-x, -y);
+  }

-    // Reset shadow
-    ctx.shadowColor = 'transparent';
-    ctx.shadowBlur = 0;
-    ctx.shadowOffsetX = 0;
-    ctx.shadowOffsetY = 0;
-  };
+  // Draw background if specified
+  if (layer.background && layer.background !== 'transparent') {
+    const textMetrics = ctx.measureText(layer.content);
+    const textWidth = textMetrics.width;
+    const textHeight = fontSize;
+    
+    ctx.fillStyle = layer.background;
+    ctx.fillRect(
+      x - textWidth / 2 - 8,
+      y - textHeight / 2 - 4,
+      textWidth + 16,
+      textHeight + 8
+    );
+  }

-  // Draw both texts
-  drawText(topText);
-  drawText(bottomText);
+  // Draw stroke (outline)
+  if (layer.strokeWidth > 0) {
+    ctx.strokeStyle = layer.stroke || '#000000';
+    ctx.lineWidth = Math.max(layer.strokeWidth * (canvasWidth / 500), 1);
+    ctx.lineJoin = 'round';
+    ctx.lineCap = 'round';
+    ctx.miterLimit = 2;
+    ctx.strokeText(layer.content, x, y);
+  }
+
+  // Fill text
+  ctx.fillStyle = layer.color || '#FFFFFF';
+  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
+  ctx.shadowBlur = 2;
+  ctx.shadowOffsetX = 1;
+  ctx.shadowOffsetY = 1;
+  ctx.fillText(layer.content, x, y);
+
+  ctx.restore();
 };

-export const drawMemeOnVideo = (canvas, topText, bottomText) => {
+const drawStickerLayer = (ctx, layer, canvasWidth, canvasHeight) => {
+  ctx.save();
+  
+  const x = (layer.x / 100) * canvasWidth;
+  const y = (layer.y / 100) * canvasHeight;
+  const size = layer.size || 40;
+  
+  // Apply rotation
+  if (layer.rotation) {
+    ctx.translate(x, y);
+    ctx.rotate((layer.rotation * Math.PI) / 180);
+    ctx.translate(-x, -y);
+  }
+  
+  if (layer.content) {
+    // Draw emoji/text sticker
+    ctx.font = `${size}px Arial`;
+    ctx.textAlign = 'center';
+    ctx.textBaseline = 'middle';
+    ctx.fillText(layer.content, x, y);
+  } else if (layer.shape) {
+    // Draw shape sticker
+    ctx.fillStyle = layer.shape.color;
+    
+    switch (layer.shape.type) {
+      case 'circle':
+        ctx.beginPath();
+        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
+        ctx.fill();
+        break;
+      case 'square':
+        ctx.fillRect(x - size / 2, y - size / 2, size, size);
+        break;
+      case 'triangle':
+        ctx.beginPath();
+        ctx.moveTo(x, y - size / 2);
+        ctx.lineTo(x - size / 2, y + size / 2);
+        ctx.lineTo(x + size / 2, y + size / 2);
+        ctx.closePath();
+        ctx.fill();
+        break;
+    }
+  }
+  
+  ctx.restore();
+};
+
+export const drawMemeOnVideo = (canvas, layers) => {
   const ctx = canvas.getContext('2d');
   if (!ctx) return;

   const { width, height } = canvas;

   // Configure text rendering
   ctx.textAlign = 'center';
   ctx.textBaseline = 'middle';
   ctx.imageSmoothingEnabled = true;
   ctx.imageSmoothingQuality = 'high';

-  // Draw text function for video
-  const drawText = (text) => {
-    if (!text.content.trim()) return;
-
-    const fontSize = Math.max(text.fontSize * (width / 500), 16);
-    ctx.font = `bold ${fontSize}px Impact, "Arial Black", Arial, sans-serif`;
-
-    const x = width / 2;
-    const y = (text.y / 100) * height;
-
-    // Draw stroke (outline) - more prominent for video
-    if (text.strokeWidth > 0) {
-      ctx.strokeStyle = text.stroke;
-      ctx.lineWidth = Math.max(text.strokeWidth * (width / 500), 2);
-      ctx.lineJoin = 'round';
-      ctx.lineCap = 'round';
-      ctx.miterLimit = 2;
-      ctx.strokeText(text.content, x, y);
-    }
-
-    // Fill text with stronger shadow for video visibility
-    ctx.fillStyle = text.color;
-    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
-    ctx.shadowBlur = 4;
-    ctx.shadowOffsetX = 2;
-    ctx.shadowOffsetY = 2;
-
-    ctx.fillText(text.content, x, y);
-
-    // Reset shadow
-    ctx.shadowColor = 'transparent';
-    ctx.shadowBlur = 0;
-    ctx.shadowOffsetX = 0;
-    ctx.shadowOffsetY = 0;
-  };
-
-  // Draw both texts
-  drawText(topText);
-  drawText(bottomText);
+  // Sort layers by z-index and draw them
+  const sortedLayers = [...layers]
+    .filter(layer => layer.visible)
+    .sort((a, b) => a.zIndex - b.zIndex);
+
+  sortedLayers.forEach(layer => {
+    if (layer.type === 'text') {
+      drawTextLayer(ctx, layer, width, height);
+    } else if (layer.type === 'sticker') {
+      drawStickerLayer(ctx, layer, width, height);
+    }
+  });
 };