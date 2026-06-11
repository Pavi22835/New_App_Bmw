// FRONTEND - API Service
// Replace with your computer's IP address
const API_BASE_URL = 'http://10.128.5.253:3000';

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