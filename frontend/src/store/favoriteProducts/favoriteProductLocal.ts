
export const FAVORITE_KEY = "favorite"

export const getLocalFavoriteProducts = (): number[] => {
  const data = localStorage.getItem(FAVORITE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addFavoriteProduct = (productId: number) => {
  const currentFavorite = getLocalFavoriteProducts();
  if (!currentFavorite.includes(productId)) {
    currentFavorite.push(productId);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(currentFavorite));
  }
};

export const removeFavoriteProduct = (productId: number) => {
  const currentFavorite = getLocalFavoriteProducts().filter((item) => item !== productId);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(currentFavorite));
}

export const isInLocalFavorites = (productId: number): boolean => {
  return getLocalFavoriteProducts().includes(productId);
};

