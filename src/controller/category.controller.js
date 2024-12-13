import Category from "../models/category.model";
import { fetchAndSaveCategories } from "../libs/categoryscraper.js";

export const scrapeCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body; // Expect category IDs from the request body
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ error: "categoryIds must be a non-empty array" });
    }

    await fetchAndSaveCategories(categoryIds);
    res.status(200).json({ message: "Categories scraped and saved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

