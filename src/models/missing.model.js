import mongoose from "mongoose";

const { Schema } = mongoose;

const missingMoviesSchema = new Schema({
    postID: { type: String },
    slug: { type: String },
    synopsis: { type: String },
    entry_content: { type: String },
    head_download: { type: String },
    info: { type: String },
    synopsis_descriptions: { type: String },
    imdbID: { type: String },
    button_collection: {type: String},
    download_btn: { type: String },
    categories: { type: String },
}, { timestamps: true });

export default mongoose.model('Missing', missingMoviesSchema);

