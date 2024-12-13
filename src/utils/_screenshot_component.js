import * as cheerio from 'cheerio';

/**
 * Extract image links from the HTML content.
 * @param {string} htmlText - The HTML content.
 * @returns {string[]} - Array of image links.
 */
export function extractImageLinksFromSection(htmlText) {
    try {
        const $ = cheerio.load(htmlText);

        // Split the content based on <hr> tags
        const sections = htmlText.split(/<hr\s*\/?>/i);

        //start: return all image if single hr tag avaialble
        if (sections.length === 2) {
            console.warn('Only one <hr> tag found. Returning all image links.');
            const imageLinks = [];
            $('img').each((index, element) => {
                const src = $(element).attr('src');
                if (src) {
                    imageLinks.push(src);
                }
            });
            console.log(imageLinks);
            return imageLinks;
        }else{
        
        // last : return all image if single hr tag avaialble

        // Extract the text before the last two <hr> tags
        const targetSection = sections.slice(0, -2).join('<hr>');

        // Load the target section into Cheerio for processing
        const targetCheerio = cheerio.load(targetSection);

        const imageLinks = [];
        targetCheerio('img').each((index, element) => {
            const src = targetCheerio(element).attr('src');
            if (src) {
                imageLinks.push(src);
            }
        });

        return imageLinks;
    }
    } catch (error) {
        console.error('Error extracting image links:', error.message);
        return [];
    }
}
