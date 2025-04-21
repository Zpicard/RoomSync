const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas for different sizes
const sizes = [16, 32, 64, 192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(0, 0, size, size);

  // Draw house icon
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  
  // Roof
  ctx.moveTo(size * 0.2, size * 0.4);
  ctx.lineTo(size * 0.5, size * 0.2);
  ctx.lineTo(size * 0.8, size * 0.4);
  
  // House body
  ctx.lineTo(size * 0.8, size * 0.8);
  ctx.lineTo(size * 0.2, size * 0.8);
  ctx.closePath();
  ctx.stroke();
  
  // Fill house
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  if (size <= 64) {
    fs.writeFileSync('../public/favicon.ico', buffer);
  } else {
    fs.writeFileSync(`../public/logo${size}.png`, buffer);
  }
}); 