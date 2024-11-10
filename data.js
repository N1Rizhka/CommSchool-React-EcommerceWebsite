const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const clothingCategories = ["women's clothing"];
    return data
      .filter(item => clothingCategories.includes(item.category))
      .map(item => ({
        id: item.id,
        title: item.title,
        img: item.image,
        price: item.price,
        company: item.category || "Unknown",
        info: item.description || "No description available",
      }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
