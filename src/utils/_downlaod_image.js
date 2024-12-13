/* import fs from 'fs';
import path from 'path';
import https from 'https';
import { basePublicDir } from '../config/paths.config.js'; // Adjust path based on your config location
import { fetchWrapper } from '../libs/fetchwrapper.js';

// Function to download an image to a file
const downloadToFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        const request = https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });

        request.on('error', (err) => {
            fs.unlink(filePath, () => {}); // Clean up partially written files on error
            reject(err);
        });
    });
};

// Main function to download images and save them with folder structure
export async function downloadImage(url) {
    try {
        const response = await fetchWrapper(url);
        const { media_details, source_url } = response;

        const savedImages = [];

        if (media_details?.sizes) {
            const { sizes } = media_details;

            for (const sizeKey in sizes) {
                const image = sizes[sizeKey];
                const imageUrl = image.source_url;

                // Extract the relative path (e.g., /wp-content/uploads/...)
                const relativePath = imageUrl.split('/wp-content')[1];
                const filePath = path.join(basePublicDir, '/wp-content', relativePath); // Full local path to save

                // Ensure the directory exists
                const dirPath = path.dirname(filePath);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                // Download and save the image
                await downloadToFile(imageUrl, filePath);

                // Add metadata for the saved image
                savedImages.push({
                    file: image.file,
                    width: image.width,
                    height: image.height,
                    filesize: image.filesize,
                    mime_type: image.mime_type,
                    source_url: `/wp-content${relativePath}`, // Relative URL
                });
            }
        } else if (source_url) {
            // Handle case when `sizes` is missing and only `source_url` is available
            const relativePath = source_url.split('/wp-content')[1];
            const filePath = path.join(basePublicDir, '/wp-content', relativePath);

            // Ensure the directory exists
            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            // Download and save the main image
            await downloadToFile(source_url, filePath);

            // Add metadata for the main image
            savedImages.push({
                file: path.basename(source_url),
                source_url: `/wp-content${relativePath}`,
            });
        }

        return savedImages; // Return metadata for all saved images
    } catch (error) {
        console.error(`Error downloading image: ${error.message}`);
        throw error;
    }
}
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { basePublicDir } from '../config/paths.config.js';
import { fetchWrapper } from '../libs/fetchwrapper.js';

const downloadToFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        const request = https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });

        request.on('error', (err) => {
            fs.unlink(filePath, () => { });
            reject(err);
        });
    });
};

const normalizeRelativePath = (imageUrl, fallbackBase = 'uploads') => {
    if (!imageUrl) return null;

    const relativePath = imageUrl.includes('/wp-content') ?
        imageUrl.split('/wp-content')[1] :
        `${fallbackBase}/${path.basename(imageUrl)}`;

    return `/wp-content/${relativePath.replace(/^\/+/, '')}`;
};

export async function downloadImage(url) {
    try {
        const response = await fetchWrapper(url);
        const {
            media_details,
            source_url
        } = response;

        const savedImages = [];
        let mainImage = null;

        if (media_details?.sizes) {
            for (const sizeKey in media_details.sizes) {
                const image = media_details.sizes[sizeKey];
                const imageUrl = image.source_url;

                const relativePath = normalizeRelativePath(imageUrl);
                const filePath = path.join(basePublicDir, relativePath);

                const dirPath = path.dirname(filePath);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, {
                        recursive: true
                    });
                }

                await downloadToFile(imageUrl, filePath);
                savedImages.push({
                    file: path.basename(imageUrl),
                    width: image.width,
                    height: image.height,
                    filesize: image.filesize,
                    mime_type: image.mime_type,
                    relative_url: `${relativePath}`,
                });
            }
        }

        if (source_url) {
            const relativePath = normalizeRelativePath(source_url);
            const filePath = path.join(basePublicDir, relativePath);

            const dirPath = path.dirname(filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, {
                    recursive: true
                });
            }

            await downloadToFile(source_url, filePath);
            mainImage = {
                file: path.basename(source_url),
                relative_url: `${relativePath}`,
            };
        }

        return {
            savedImages,
            mainImage,
            media_details,
            source_url
        };
    } catch (error) {
        console.error(`Error downloading image: ${error.message}`);
        throw error;
    }
}