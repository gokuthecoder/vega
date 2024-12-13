// import * as cheerio from 'cheerio';

// /**
//  * Clean the HTML content by removing unnecessary characters and spaces.
//  * @param {string} htmlContent - The HTML content to clean.
//  * @returns {string} - The cleaned HTML content.
//  */
// function cleanHtmlContent(htmlContent) {
//     const $ = cheerio.load(htmlContent);

//     // Clean up the content by removing unwanted elements or attributes if necessary.
//     $('script, style').remove(); // Remove <script> and <style> tags
//     $('img').removeAttr('src');  // Optionally remove the 'src' attribute from images

//     // Return only the content inside the body tag if available, or just the cleaned HTML.
//     const bodyContent = $('body').html() || $.html(); // If <body> exists, return its content
//     return bodyContent.replace(/\n+/g, '').trim(); // Remove unnecessary newlines and trim spaces
// }


// /**
//  * Extract content between the last two <hr> tags.
//  * @param {string} html - The HTML content to search within.
//  * @returns {string} - Extracted content between the last two <hr> tags, cleaned of unnecessary escape characters and newlines.
//  */
// export function extractContentBetweenHrTags(html) {
//     const $ = cheerio.load(html);

//     html = html.replace(/^\n+/g, '');
//     html = html.replace(/\\+/g, '');

//     const cleanedHtml = cheerio.load(html);

//     const hrTags = cleanedHtml('hr');

//     if (hrTags.length < 2) {
//         return '';
//     }

//     const lastHr = hrTags.last();
//     const secondLastHr = lastHr.prevAll('hr').first();

//     let content = '';
//     secondLastHr.nextUntil(lastHr).each((i, elem) => {
//         content += cleanedHtml.html(elem);
//     });

//     return cleanHtmlContent(content);
// }


import * as cheerio from 'cheerio';

/**
 * Clean the HTML content by removing unnecessary characters and spaces.
 * @param {string} htmlContent - The HTML content to clean.
 * @returns {string} - The cleaned HTML content.
 */
function cleanHtmlContent(htmlContent) {
    const $ = cheerio.load(htmlContent);

    // Clean up the content by removing unwanted elements or attributes if necessary.
    $('script, style').remove(); // Remove <script> and <style> tags
    $('img').removeAttr('src');  // Optionally remove the 'src' attribute from images

    // Return only the content inside the body tag if available, or just the cleaned HTML.
    const bodyContent = $('body').html() || $.html(); // If <body> exists, return its content
    return bodyContent.replace(/\n+/g, '').trim(); // Remove unnecessary newlines and trim spaces
}

/**
 * Extract content between the last two <hr> tags, or from an image to the last <hr> tag if no second <hr> exists.
 * @param {string} html - The HTML content to search within.
 * @returns {string} - Extracted content based on the described rules.
 */
export function extractContentBetweenHrTags(html) {
    const $ = cheerio.load(html);

    html = html.replace(/^\n+/g, '').replace(/\\+/g, '');

    const cleanedHtml = cheerio.load(html);
    const hrTags = cleanedHtml('hr');

    if (hrTags.length < 2) {
        const lastHr = hrTags.last();
        if (lastHr.length) {
            let fallbackContent = '';

            const imageContainer = cleanedHtml('p img').parent();
            if (imageContainer.length) {
                fallbackContent = imageContainer.nextUntil(lastHr).html();
            }

            return cleanHtmlContent(fallbackContent || '');
        }

        return '';
    }

    const lastHr = hrTags.last();
    const secondLastHr = lastHr.prevAll('hr').first();

    let content = '';
    secondLastHr.nextUntil(lastHr).each((i, elem) => {
        content += cleanedHtml.html(elem);
    });

    return cleanHtmlContent(content);
}
