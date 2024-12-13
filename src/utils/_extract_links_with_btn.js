import * as cheerio from "cheerio";
import he from "he";

export const extractButtonsAndTitlesFromJson = (rawHtml) => {
    const decodedHtml = he.decode(rawHtml);

    const $ = cheerio.load(decodedHtml);
    const resultMap = new Map();

    $("h1, h2, h3, h4, h5, h6").each((_, heading) => {
        const title = $(heading).text().trim();

        const relatedElements = $(heading).nextUntil("h1, h2, h3, h4, h5, h6");

        relatedElements.each((_, element) => {
            const linkElements = $(element).find("a");

            linkElements.each((_, linkElement) => {
                const link = $(linkElement).attr("href");
                const buttonName = $(linkElement).find("button").text().trim() || $(linkElement).text().trim();

                if (link && buttonName) {
                    if (!resultMap.has(title)) {
                        resultMap.set(title, []); 
                    }

                    resultMap.get(title).push({
                        btn_name:buttonName,
                        download_url:link,
                    });
                }
            });
        });
    });

    const result = Array.from(resultMap, ([title, buttons]) => ({
        title,
        buttons,
    }));

    return result;
};

export function extractContentBetweenHrTags(html) {
    const $ = cheerio.load(html);

    const hrTags = $('hr');

    if (hrTags.length < 2) {
        const lastHr = hrTags.last();
        if (lastHr.length) {
            const imageContainer = $('p img').parent();
            if (imageContainer.length) {
                // Include <h5> and button links if available
                let fallbackContent = imageContainer
                    .nextUntil(lastHr)
                    .filter((i, elem) => $(elem).find('h5, a, button').length)
                    .toArray()
                    .map((elem) => $.html(elem))
                    .join('');
                return cleanHtmlContent(fallbackContent || '');
            }
        }
        return '';
    }

    const lastHr = hrTags.last();
    const secondLastHr = lastHr.prevAll('hr').first();

    let content = '';
    secondLastHr.nextUntil(lastHr).each((i, elem) => {
        content += $.html(elem);
    });

    return cleanHtmlContent(content);
}
