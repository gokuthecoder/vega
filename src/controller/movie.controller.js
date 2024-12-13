import { fetchAndSaveCategories } from "../libs/categoryscraper.js";
import { getVegamoviesPost } from "../libs/vegamovies.js";
import movieModel from "../models/movie.model.js";
import { downloadImage } from "../utils/_downlaod_image.js";
import { extractContentBetweenHrTags } from "../utils/_download_component.js";
import { extractButtonsAndTitlesFromJson } from "../utils/_extract_links_with_btn.js";
import { findImdbIds } from "../utils/_get_imdb_id.js";
import { extractImageLinksFromSection } from "../utils/_screenshot_component.js";
import { extractContentToJson } from "../utils/htmlParser.js";



function removeUnusualBackslashes(text) {
    return text.replace(/\\+/g, '');
}

export const createMovie = async (ids) => {
    try {
        const jsonData = await getVegamoviesPost(ids);
        const { categories } = jsonData;

        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return "No categories found in the response";
        };

        const savedCategories = await fetchAndSaveCategories(categories);

        const imdbid = await findImdbIds(jsonData?.content?.rendered);

        const media = jsonData._links["wp:featuredmedia"][0].href;

        const posterImg = await downloadImage(media);

        const { id, link, date, date_gmt, modified, modified_gmt, slug, title, content, excerpt } = jsonData;
        const { rendered: titleRendered } = title || {};
        const { rendered: contentRendered } = content || {};
        const { rendered: excerptRendered } = excerpt || {};
        const cleanRenderedContent = removeUnusualBackslashes(contentRendered);

        const [jsonResponse, linkwithbtn, getss] = await Promise.all([
            extractContentToJson(cleanRenderedContent),
            extractContentBetweenHrTags(cleanRenderedContent),
            extractImageLinksFromSection(cleanRenderedContent),
        ]);

        const { entry_content, about_me, head_download, info, synopsis, synopsis_descriptions } = jsonResponse;

        const getLinkWithBtn = await extractButtonsAndTitlesFromJson(linkwithbtn);
        // console.log("Extracted Buttons and Titles:", getLinkWithBtn);


        const newMovie = new movieModel({
            postID: id,
            og_url:link,
            title: titleRendered,
            slug: slug,
            categories: savedCategories,
            postImgSrc: posterImg?.source_url || "",
            postImgSrcSet: posterImg?.media_details || "",
            postImgSrcPath: posterImg?.mainImage || "",
            postImgSrcSetPath: posterImg?.savedImages || "",
            entry_content: entry_content,
            about_me: about_me,
            head_download: head_download,
            info: info,
            synopsis: synopsis,
            synopsis_descriptions: synopsis_descriptions,
            post_screenshot_url: getss,
            imdbID: imdbid,
            download_btn: linkwithbtn,
            button_collection: getLinkWithBtn,
            org_rendered_content: contentRendered,
            org_excerpt: excerptRendered,
            date: date,
            date_gmt: date_gmt,
            modified: modified,
            modified_gmt: modified_gmt
        });

        const savedMovie = await newMovie.save();
        
        return savedMovie;
    } catch (error) {
        console.error('Error occurred:', error.stack || error);
    }
}
