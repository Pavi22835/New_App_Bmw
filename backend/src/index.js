const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware
app.use(express.json());

// Enable CORS for mobile app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'BMW Car API is running!' });
});

// GET all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// GET single car by ID
app.get('/api/cars/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const car = await prisma.car.findUnique({ where: { id } });
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});

// NEW: Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { carId, customerName, customerEmail, customerPhone, bookingDate, bookingTime, message } = req.body;
    
    // Validate required fields
    if (!carId || !customerName || !customerEmail || !customerPhone || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const booking = await prisma.booking.create({
      data: {
        carId: parseInt(carId),
        customerName,
        customerEmail,
        customerPhone,
        bookingDate: new Date(bookingDate),
        bookingTime,
        message: message || '',
        status: 'pending'
      },
      include: {
        car: true // Include car details in response
      }
    });
    
    res.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// NEW: Get bookings for a car
app.get('/api/bookings/car/:carId', async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    const bookings = await prisma.booking.findMany({
      where: { carId },
      orderBy: { bookingDate: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// NEW: Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { car: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// NEW: Cancel a booking
app.patch('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
    });
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// NEW: Get all price alerts
app.get('/api/price-alerts', async (req, res) => {
  try {
    const alerts = await prisma.priceAlert.findMany({
      orderBy: { createdAt: 'desc' },
      include: { car: true },
    });
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    res.status(500).json({ error: 'Failed to fetch price alerts' });
  }
});

// NEW: Create a price alert
app.post('/api/price-alerts', async (req, res) => {
  try {
    const { carId, label, targetPrice } = req.body;
    if (!label || targetPrice == null) {
      return res.status(400).json({ error: 'Label and target price are required' });
    }
    const alert = await prisma.priceAlert.create({
      data: {
        carId: carId ? parseInt(carId) : null,
        label,
        targetPrice: Number(targetPrice),
      },
      include: { car: true },
    });
    res.json(alert);
  } catch (error) {
    console.error('Error creating price alert:', error);
    res.status(500).json({ error: 'Failed to create price alert' });
  }
});

// NEW: Delete a price alert
app.delete('/api/price-alerts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.priceAlert.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting price alert:', error);
    res.status(500).json({ error: 'Failed to delete price alert' });
  }
});

// NEW: Get reviews for a car
app.get('/api/reviews/car/:carId', async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    const reviews = await prisma.review.findMany({
      where: { carId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// NEW: Create a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { carId, author, rating, comment } = req.body;
    if (!carId || !author || rating == null || !comment) {
      return res.status(400).json({ error: 'All review fields are required' });
    }
    const review = await prisma.review.create({
      data: {
        carId: parseInt(carId),
        author,
        rating: parseInt(rating),
        comment,
      },
    });
    res.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 BMW Car API running on http://localhost:${PORT}`);
  console.log(`📋 Test: http://localhost:${PORT}/api/cars`);
});