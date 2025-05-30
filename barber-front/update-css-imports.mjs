import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = process.cwd();
const stylesDir = path.join(baseDir, 'src', 'assets', 'styles');

function findCssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fileList = findCssFiles(filePath, fileList);
    } else if (file.endsWith('.css') && file !== 'variables.css') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function updateImportPaths(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    const importRegex = /@import\s+['"](.+?variables\.css)['"];/;
    const match = content.match(importRegex);
    
    if (match) {
      const newContent = content.replace(
        importRegex, 
        '@import \'/src/assets/styles/variables.css\';'
      );
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating file: ${filePath}`, error);
  }
}

const cssFiles = findCssFiles(stylesDir);
cssFiles.forEach(updateImportPaths);

console.log(`Updated ${cssFiles.length} CSS files.`);
