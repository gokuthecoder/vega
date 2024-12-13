export async function callme(page) {
    const baseUrl = `https://vegamovies.st/page/${page}/`; // Corrected URL
    const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    };

    const MAX_RETRIES = 3; // Maximum number of retries
    const RETRY_DELAY = 2000; // Delay between retries in milliseconds

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Fetching data (Attempt ${attempt})...`);
            const response = await fetch(baseUrl, { headers });

            if (!response.ok) {
                throw new Error(`Failed to fetch the page. Status: ${response.status}`);
            }

            const html = await response.text();

            // Ensure the HTML has a complete <main> section
            const mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
            if (!mainContentMatch || !mainContentMatch[1]) {
                console.warn('No <main> tag found in the HTML.');
                if (attempt < MAX_RETRIES) {
                    console.log('Retrying...');
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    continue;
                }
                return []; // Return an empty array if retries are exhausted
            }

            const mainContent = mainContentMatch[1];

            const postIds = [];
            const articleRegex = /<article[^>]*id="post-(\d+)"/g;
            let match;

            while ((match = articleRegex.exec(mainContent)) !== null) {
                postIds.push({ post: parseInt(match[1], 10) });
            }

            // Return the list if successful
            console.log({current: `current page is ${page}`})
            return postIds;
        } catch (error) {
            console.error(`Error (Attempt ${attempt}):`, error.message);
            if (attempt === MAX_RETRIES) {
                console.error('Max retries reached. Exiting.');
                return []; // Return an empty array if all retries fail
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
    }
}
