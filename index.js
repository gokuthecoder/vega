import express from 'express';
import 'dotenv/config';
import connectToDatabase from './src/config/db.config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createMovie } from './src/controller/movie.controller.js';
import { callme } from './src/libs/postfetcher.js';
import missingModel from './src/models/missing.model.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/wp-content', express.static(path.join(__dirname, 'public/wp-content')));

const saveMissingFields = async (postID, missingFields) => {
    try {
        // Prepare the object to save
        const missingData = { postID, ...missingFields };
        // Save the missing data to the database
        const missing = new missingModel(missingData);
        const newMissingMovie = await missing.save();
        // console.log(`Saved missing fields for post ID ${postID}:`, newMissingMovie);
        // console.log(`Saved missing fields for post ID ${postID}:`, missingData);
    } catch (err) {
        console.error(`Failed to save missing fields for post ID ${postID}:`, err.message);
    }
};

const checkMissingFields = (movie) => {
    const missing = {};
    if (!movie.slug) missing.slug = "missing slug";
    if (!movie.synopsis) missing.synopsis = "synopsis is missing";
    if (!movie.entry_content) missing.entry_content = "entry_content is missing";
    if (!movie.head_download) missing.head_download = "head_download is missing";
    if (!movie.info) missing.info = "info is missing";
    if (!movie.synopsis_descriptions) missing.synopsis_descriptions = "synopsis_descriptions is missing";
    if (!movie.imdbID) missing.imdbID = "imdb ID is missing";
    if (!movie.button_collection || movie.button_collection.length === 0) missing.button_collection = "buttons are missing";
    if (!movie.download_btn || movie.download_btn.length === 0) missing.download_btn = "Button HTML are missing";
    if (!movie.categories || movie.categories.length === 0) missing.categories = "categories are missing";

    return missing;
};

async function askme(){
    try {
        for (let index = 1; index <= 561; index++) {
            // const element = array[index];
            await callme(index).then(async postList => {
                console.log('Post list received:', postList);
            
                for (let index = 0; index < postList.length; index++) {
                    const element = postList[index];
                    console.log(`Creating movie for post ID: ${element.post}`);
            
                    try {
                        const newMovies = await createMovie(element.post);
            
                        const missingFields = checkMissingFields(newMovies);
                        if (Object.keys(missingFields).length > 0) {
                            console.log({ postID, missing: missingFields });
            
                            await saveMissingFields(postID, missingFields); // <-- Call added here
                        }
                    } catch (err) {
                        console.error(`Failed to create movie for post ID ${element.post}:`, err.message);
                    }
                }
            
                console.log('All posts have been processed.');
            }).catch(error => {
                console.error('Error in processing posts:', error.message);
            });
            
        }

    } catch (error) {
        console.log(erro)
    }
}

app.listen(5000, () => {
    console.log('Server is running at port 5000');
    connectToDatabase();
    askme()
});
