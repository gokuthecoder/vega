import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  parent: {
    type: Number,
    default: null,
  }
},{timestamps:true});

const Category = mongoose.model("Category", categorySchema);
export default Category;
