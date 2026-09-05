# PWA Icons Generation Script

This script helps generate all required PWA icons from the existing logo.jpg file.

## Required Icon Sizes:
- 72x72 (Android)
- 96x96 (Android)
- 128x128 (Android) 
- 144x144 (Android)
- 152x152 (iOS)
- 192x192 (Android, required)
- 384x384 (Android)
- 512x512 (Android, required)

## Tools you can use:
1. **Online tools:**
   - PWA Icon Generator: https://tools.crawlink.com/tools/pwa-icon-generator
   - Favicon.io: https://favicon.io/
   - Real Favicon Generator: https://realfavicongenerator.net/

2. **Command line (ImageMagick):**
   ```bash
   # Install ImageMagick first
   # For each size, run:
   convert logo.jpg -resize 72x72 icons/icon-72x72.png
   convert logo.jpg -resize 96x96 icons/icon-96x96.png
   convert logo.jpg -resize 128x128 icons/icon-128x128.png
   convert logo.jpg -resize 144x144 icons/icon-144x144.png
   convert logo.jpg -resize 152x152 icons/icon-152x152.png
   convert logo.jpg -resize 192x192 icons/icon-192x192.png
   convert logo.jpg -resize 384x384 icons/icon-384x384.png
   convert logo.jpg -resize 512x512 icons/icon-512x512.png
   ```

3. **Using Sharp (Node.js):**
   ```javascript
   const sharp = require('sharp');
   const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
   
   sizes.forEach(size => {
     sharp('public/logo.jpg')
       .resize(size, size)
       .png()
       .toFile(`public/icons/icon-${size}x${size}.png`);
   });
   ```

## Additional iOS Icons:
- apple-touch-icon-180x180.png (for iOS home screen)
- apple-touch-icon-152x152.png
- apple-touch-icon-120x120.png

Copy the generated icons to the public/icons/ directory.