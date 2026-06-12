// FRONTEND - API Service
// Replace with your computer's IP address
//const API_BASE_URL = 'http://10.128.5.253:3000';
const API_BASE_URL = 'https://new-app-bmw.onrender.com';

export interface Car {
  id: number;
  model: string;
  year: number;
  price: string;
  engine: string;
  horsepower: string;
  image: string;
  tag: string;
  createdAt?: string;
  updatedAt?: string;
}

// NEW: Booking interface
export interface Booking {
  id: number;
  carId: number;
  car?: Car;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface PriceAlert {
  id: number;
  carId?: number | null;
  car?: Car;
  label: string;
  targetPrice: number;
  createdAt: string;
}

export interface Review {
  id: number;
  carId: number;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const fetchCars = async (): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchCarById = async (id: number): Promise<Car> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// NEW: Create a booking
export const createBooking = async (bookingData: {
  carId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  message?: string;
}): Promise<Booking> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// NEW: Get bookings for a car
export const fetchBookingsByCar = async (carId: number): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/car/${carId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// NEW: Get all bookings
export const fetchAllBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// NEW: Cancel a booking
export const cancelBooking = async (bookingId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchPriceAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/price-alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch price alerts');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createPriceAlert = async (alertData: {
  carId?: number | null;
  label: string;
  targetPrice: number;
}): Promise<PriceAlert> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/price-alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create price alert');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const deletePriceAlert = async (alertId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/price-alerts/${alertId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete price alert');
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchReviewsByCar = async (carId: number): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews/car/${carId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const createReview = async (reviewData: {
  carId: number;
  author: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create review');
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};