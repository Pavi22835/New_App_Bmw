// FRONTEND - Favorites service using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'bmw_favorites';

// Get all favorite car IDs
export const getFavorites = async (): Promise<number[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

// Add a car to favorites
export const addFavorite = async (carId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(carId)) {
      favorites.push(carId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

// Remove a car from favorites
export const removeFavorite = async (carId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter(id => id !== carId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

// Toggle favorite status
export const toggleFavorite = async (carId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    if (favorites.includes(carId)) {
      await removeFavorite(carId);
      return false;
    } else {
      await addFavorite(carId);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

// Check if a car is favorited
export const isFavorite = async (carId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.includes(carId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};