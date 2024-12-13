import Category from "../models/category.model.js";

export const fetchAndSaveCategories = async (categoryIds) => {
  const savedCategories = [];
  const processedIds = new Set();

  const fetchCategoryWithParents = async (categoryId) => {
    if (processedIds.has(categoryId)) {
      return;
    }

    processedIds.add(categoryId);

    const existingCategory = await Category.findOne({ id: categoryId });
    if (existingCategory) {
      savedCategories.push(existingCategory);
      return;
    }

    try {
      const response = await fetch(`${process.env.DOMAIN_NAME}/wp-json/wp/v2/categories/${categoryId}`);
      if (!response.ok) {
        console.error(`Failed to fetch category ID ${categoryId}:`, response.statusText);
        return;
      }

      const categoryData = await response.json();

      const categoryToSave = {
        id: categoryData.id,
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        parent: categoryData.parent,
      };

      const newCategory = new Category(categoryToSave);
      const savedCategory = await newCategory.save();

      savedCategories.push(savedCategory);

      if (categoryData.parent > 0) {
        await fetchCategoryWithParents(categoryData.parent);
      }
    } catch (error) {
      console.error(`Error while fetching category ID ${categoryId}:`, error.message);
    }
  };

  for (const categoryId of categoryIds) {
    await fetchCategoryWithParents(categoryId);
  }

  // return savedCategories; //return category list with his all details
  return savedCategories.map((category) => category._id); // return only _id in Array
};
