const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}

input UserInput {
    email: String!
    password: String!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String
}

type Booking {
    _id: ID!
    user: User!
    event: Event!
    createdAt: String
    updatedAt: String
}

type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
    deleteEvent(eventId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)