import * as cheerio from 'cheerio';

/**
 * Extract content from HTML and return as JSON.
 * Removes unnecessary \n characters, escape characters (e.g., `\`),
 * and elements matching the format `[imdb style="dark"]...[/imdb]`.
 * @param {string} html - HTML content as a string.
 * @returns {Object} Parsed content as JSON.
 */
export function extractContentToJson(html) {
    const $ = cheerio.load(html);

    // Helper function to clean content
    const cleanText = (text) => text ? text.replace(/\\|[\n\r]+/g, '').trim() : '';
    
    const entryContent = cleanText($('p').first().html());
    const aboutMe = `<p><span style="color: #339966;"><strong><a style="color: #339966;" href="/">${process.env.DOMAIN_NAME}</a></strong></span> is the best online platform for downloading <span style="color: #339966;"><strong><a style="color: #339966;" href="/category/english-movies/">Hollywood</a></strong></span> and <strong><a href="/category/bollywood/"><span style="color: #339966;">Bollywood Movies</span></a></strong>. We provide direct <strong>G-Drive</strong> download link for fast and secure downloading. Click on the download button below and follow the steps to start download.</p>`;
    const headDownload = cleanText($('h3').first().html());
    const info = cleanText($('h3').eq(1).next().html());
    const synopsis = cleanText($('h3').eq(2).next().html());
    const synopsisDescription = cleanText($('p').eq(3).html());

    return {
        entry_content: entryContent || '',
        about_me: aboutMe || '',
        head_download: headDownload || '',
        info: info || '',
        synopsis: synopsis || '',
        synopsis_descriptions: synopsisDescription || '',
    };
}
