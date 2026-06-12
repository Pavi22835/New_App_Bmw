import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_CARS_KEY = 'bmw_recent_cars';
const COMPARE_CARS_KEY = 'bmw_compare_cars';
const PRICE_ALERTS_KEY = 'bmw_price_alerts';
const REVIEWS_KEY = 'bmw_reviews';
const MAX_RECENT_CARS = 5;

export interface PriceAlert {
  id: string;
  carId: number;
  label: string;
  targetPrice: number;
  createdAt: string;
}

export interface Review {
  id: string;
  carId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

type JsonValue = any;

const safeParse = <T>(value: string | null, fallback: T): T => {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const getRecentCars = async (): Promise<number[]> => {
  try {
    const value = await AsyncStorage.getItem(RECENT_CARS_KEY);
    return safeParse<number[]>(value, []);
  } catch (error) {
    console.error('Error loading recent cars:', error);
    return [];
  }
};

export const addRecentCar = async (carId: number): Promise<void> => {
  try {
    const recentCars = await getRecentCars();
    const updated = [carId, ...recentCars.filter((id) => id !== carId)].slice(0, MAX_RECENT_CARS);
    await AsyncStorage.setItem(RECENT_CARS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding recent car:', error);
  }
};

export const clearRecentCars = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECENT_CARS_KEY);
  } catch (error) {
    console.error('Error clearing recent cars:', error);
  }
};

export const getCompareCars = async (): Promise<number[]> => {
  try {
    const value = await AsyncStorage.getItem(COMPARE_CARS_KEY);
    return safeParse<number[]>(value, []);
  } catch (error) {
    console.error('Error loading comparison list:', error);
    return [];
  }
};

export const toggleCompareCar = async (carId: number): Promise<number[]> => {
  try {
    const compareCars = await getCompareCars();
    let updated: number[];

    if (compareCars.includes(carId)) {
      updated = compareCars.filter((id) => id !== carId);
    } else {
      updated = [...compareCars, carId].slice(0, 2);
    }

    await AsyncStorage.setItem(COMPARE_CARS_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error toggling compare car:', error);
    return [];
  }
};

export const isCompareCar = async (carId: number): Promise<boolean> => {
  try {
    const compareCars = await getCompareCars();
    return compareCars.includes(carId);
  } catch (error) {
    console.error('Error checking compare car:', error);
    return false;
  }
};

export const clearCompareCars = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(COMPARE_CARS_KEY);
  } catch (error) {
    console.error('Error clearing comparison list:', error);
  }
};

export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const value = await AsyncStorage.getItem(PRICE_ALERTS_KEY);
    return safeParse<PriceAlert[]>(value, []);
  } catch (error) {
    console.error('Error loading price alerts:', error);
    return [];
  }
};

export const savePriceAlert = async (alert: PriceAlert): Promise<void> => {
  try {
    const alerts = await getPriceAlerts();
    const updated = [...alerts.filter((item) => item.id !== alert.id), alert];
    await AsyncStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving price alert:', error);
  }
};

export const removePriceAlert = async (alertId: string): Promise<void> => {
  try {
    const alerts = await getPriceAlerts();
    const updated = alerts.filter((item) => item.id !== alertId);
    await AsyncStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing price alert:', error);
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const value = await AsyncStorage.getItem(REVIEWS_KEY);
    return safeParse<Review[]>(value, []);
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
};

export const addReview = async (review: Review): Promise<void> => {
  try {
    const reviews = await getReviews();
    await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify([review, ...reviews]));
  } catch (error) {
    console.error('Error saving review:', error);
  }
};

export const getCarReviews = async (carId: number): Promise<Review[]> => {
  try {
    const reviews = await getReviews();
    return reviews.filter((review) => review.carId === carId);
  } catch (error) {
    console.error('Error loading car reviews:', error);
    return [];
  }
};
