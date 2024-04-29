const BASE_URL = 'http://localhost:8000'; // URL del backend Python

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${query}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
