const Dataloader = require("dataloader")
const Event = require("./../../models/event");
const User = require("./../../models/user");
const { dateToString} = require("./../../helpers/date");

const eventLoader = new Dataloader((eventIds) => {
  console.log('----eventIds', eventIds)
  return events(eventIds)
})

const userLoader = new Dataloader((userIds) => {
  console.log('----userIds', userIds)
  return User.find({_id: { $in: userIds}});
});

const events = async (eventIds) => {
    try {
      const eventsResult = await Event.find({ _id: { $in: eventIds } });
      return eventsResult.map((event) => {
        return transformEvent(event)
      });
    } catch (err) {
      console.log(err);
      throw new Error(`Events not found: ${err}`);
    }
  };
  
  const singleEvent = async (eventId) => {
    try {
      const event = await eventLoader.load(eventId.toString());
      return event;
    } catch (err) {
      console.log(err);
      throw new Error(`Events not found: ${err}`);
    }
  };
  
  const user = async (userId) => {
    try {
      const findUser = await userLoader.load(userId.toString());
      return {
        ...findUser._doc,
        password: null,
        _id: findUser.id,
        createdEvents: eventLoader.load.bind(this, findUser.createdEvents),
      };
    } catch (err) {
      console.log(err);
      throw new Error(`Events not found: ${err}`);
    }
  };
  
  const transformEvent = event => {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event._doc.creator),
    }
  }
  
  const transfromBooking = booking => {
    return  {
      ...booking._doc,
      _id: booking.id,
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt),
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
    }
  }

  exports.transformEvent = transformEvent;
  exports.transfromBooking = transfromBooking;
  exports.events = events;