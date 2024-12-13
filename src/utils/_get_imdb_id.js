/**
 * Find IMDb ID in a given string.
 * @param {string} text - The input text to search for an IMDb ID.
 * @returns {string} The first IMDb ID found in the text, or an empty string if no match.
 */
export function findImdbIds(text) {
    if (typeof text !== 'string') {
        throw new Error('Input must be a string');
    }

    // Regular expression to match IMDb ID format
    const imdbIdPattern = /tt\d{7,10}/;

    // Match the pattern and return the first match, or an empty string if no match
    const match = text.match(imdbIdPattern);
    return match ? match[0] : '';
}
