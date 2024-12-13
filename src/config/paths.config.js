import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory (works in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base `public` directory relative to the root project folder
export const basePublicDir = path.join(__dirname, '../../public'); // Adjust the path based on your folder structure
