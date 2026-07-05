import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    bannerImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: 0,
    },
    maxSeats: {
      type: Number,
      required: [true, 'Maximum seats is required'],
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
