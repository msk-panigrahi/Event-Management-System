import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      venue,
      city,
      date,
      time,
      category,
      ticketPrice,
      maxSeats,
      organizer,
      isPublished,
    } = req.body;

    const bannerImage = req.file ? `/uploads/${req.file.filename}` : req.body.bannerImage || '';

    const event = await Event.create({
      title,
      description,
      venue,
      city,
      date,
      time,
      category,
      ticketPrice: Number(ticketPrice),
      maxSeats: Number(maxSeats),
      availableSeats: Number(maxSeats),
      organizer,
      bannerImage,
      isPublished: isPublished === 'true' || isPublished === true,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Event created successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { category, city, search, published } = req.query;
    const filter = {};

    if (published === 'true' || (!req.user || req.user.role !== 'admin')) {
      filter.isPublished = true;
    }

    if (category) filter.category = category;
    if (city) filter.city = new RegExp(city, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { venue: new RegExp(search, 'i') },
      ];
    }

    const events = await Event.find(filter).populate('createdBy', 'name email').sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.bannerImage = `/uploads/${req.file.filename}`;
    }
    if (updates.ticketPrice) updates.ticketPrice = Number(updates.ticketPrice);
    if (updates.maxSeats) {
      const newMax = Number(updates.maxSeats);
      const booked = event.maxSeats - event.availableSeats;
      updates.maxSeats = newMax;
      updates.availableSeats = Math.max(0, newMax - booked);
    }
    if (updates.isPublished !== undefined) {
      updates.isPublished = updates.isPublished === 'true' || updates.isPublished === true;
    }

    event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Event updated successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    event.isPublished = !event.isPublished;
    await event.save();
    res.json({
      success: true,
      message: `Event ${event.isPublished ? 'published' : 'unpublished'} successfully`,
      data: event,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ isPublished: true, date: { $gte: now } })
      .sort({ date: 1 })
      .limit(8);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Event.distinct('category', { isPublished: true });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
