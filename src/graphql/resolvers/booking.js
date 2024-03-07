const Event = require("./../../models/event");
const Booking = require("./../../models/booking");
const { transfromBooking, transformEvent } = require("./meta");
module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const fetchBooking = await Booking.find({ user: req.userId });
      const bookingList = fetchBooking.map((booking) => {
        return transfromBooking(booking);
      });
      return bookingList;
    } catch (err) {
      throw new Error(`Can not fetch the booking now ${err}`);
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const fetchEvent = await Event.findById(args.eventId);
      const booking = new Booking({
        user: req.userId,
        event: fetchEvent,
      });

      const bookingRes = await booking.save();
      return transfromBooking(bookingRes);
    } catch (err) {
      throw new Error(`Can not book the event now ${err}`);
    }
  },
  cancelBooking: async (args) => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw new Error(`Can not cancel the booking now ${err}`);
    }
  },
  deleteEvent: async (args) => {
    try {
      const event = await Event.findById(args.eventId);
      if (!event) {
        throw new Error("User does not exist!");
      }
      await Event.deleteOne({ _id: args.eventId });
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator),
      };
    } catch (err) {
      throw new Error("Unable to delete event!");
    }
  },
};
