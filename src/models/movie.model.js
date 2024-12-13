import mongoose from "mongoose";

const { Schema } = mongoose;

const moviesSchema = new Schema({
    postID: { type: Number, required: true, unique: true },
    og_url: { type: String },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    postImgSrc: { type: String },
    postImgSrcPath: {
        file: { type: String, required: true },
        relative_url: { type: String, required: true },
    },
    postImgSrcSet: { type: Object },
    postImgSrcSetPath: [{
        file: { type: String, default: "" },
        width: { type: Number },
        height: { type: Number },
        filesize: { type: Number },
        mime_type: { type: String },
        relative_url: { type: String, default: "" },
    }],
    entry_content: { type: String },
    about_me: { type: String },
    head_download: { type: String },
    info: { type: String },
    synopsis: { type: String },
    synopsis_descriptions: { type: String },
    post_screenshot_url: [{ type: String }],
    imdbID: { type: String },
    button_collection: [
        {
            title: { type: String },
            buttons: [
                {
                    btn_name: { type: String },
                    download_url: { type: String },
                },
            ],
        },
    ],
    download_btn: { type: String },
    org_rendered_content: { type: String },
    org_excerpt: { type: String },
    date: { type: Date },
    date_gmt: { type: Date },
    modified: { type: Date },
    modified_gmt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Movie', moviesSchema);
