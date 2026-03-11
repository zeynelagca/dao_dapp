import fs from 'fs';
import path from 'path';

const htmlTemplateUrl = './index.html';
const distDir = './dist';
const outputUrl = path.join(distDir, 'index.html');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Read raw html
let htmlContent = fs.readFileSync(htmlTemplateUrl, 'utf-8');

// Replace address variables with actual Environment Variables provided by Vercel upon build time
const GAZAIN_ADDRESS = process.env.VITE_GAZAIN_ADDRESS || process.env.GAZAIN_ADDRESS || '0x0000000000000000000000000000000000000000';
const NFT_ADDRESS = process.env.VITE_NFT_ADDRESS || process.env.NFT_ADDRESS || '0x0000000000000000000000000000000000000000';

htmlContent = htmlContent.replace(/__GAZAIN_ADDRESS__/g, GAZAIN_ADDRESS);
htmlContent = htmlContent.replace(/__NFT_ADDRESS__/g, NFT_ADDRESS);

// Output to /dist for Static Hosting routing
fs.writeFileSync(outputUrl, htmlContent);

console.log('Build complete. Generated dist/index.html mapping custom Environment Variables successfully.');
