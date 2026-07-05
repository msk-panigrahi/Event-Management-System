import express from 'express';
import {
  createEvent,
  getEvents,
  getAllEventsAdmin,
  getEventById,
  updateEvent,
  deleteEvent,
  togglePublish,
  getFeaturedEvents,
  getUpcomingEvents,
  getCategories,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/featured', getFeaturedEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/categories', getCategories);
router.get('/', getEvents);
router.get('/admin/all', protect, admin, getAllEventsAdmin);
router.get('/:id', getEventById);
router.post('/', protect, admin, upload.single('bannerImage'), createEvent);
router.put('/:id', protect, admin, upload.single('bannerImage'), updateEvent);
router.delete('/:id', protect, admin, deleteEvent);
router.patch('/:id/publish', protect, admin, togglePublish);

export default router;
