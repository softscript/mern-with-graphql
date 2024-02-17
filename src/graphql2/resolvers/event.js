const Event = require("./../../models/event");
const User = require("./../../models/users");
const { transformEvent } = require("./meta");

module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        const eventRes = events.map((event) => {
          return transformEvent(event);
        });
        return eventRes;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createEvent: async (args) => {
      try {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "65c8c40aca66d028fcafba3b",
        });
        let createdEvent;
        const result = await event.save();
        createdEvent = transformEvent(result);
        const creator = await User.findById("65c8c40aca66d028fcafba3b");
        if (!creator) {
          throw new Error("User does not exist!");
        }
        creator.createdEvents.push(event);
        await creator.save();
        return createdEvent;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
}