// {
//     bookings {
//       _id
//       user{
//         email
//       }
//       event {
//       _id
//       title
//       }
//       createdAt
//       updatedAt
//     }
//   }
  
//   query {
//     users {
//       _id
//       email
//       createdEvents {
//         title
//         description
//       }
//     }
//   }
  
//   mutation {
//     createEvent(eventInput: {title: "Event Title 1", description: "event description 1", price: 454, date: "2024-02-17T06:05:57.704Z"}) {
//       _id
//       title
//       description
//       creator {
//         email
//       }
//     }
//   }
  
//   query {
//     events {
//       _id
//       title
//       date,
//       creator {
//         email
//         createdEvents {
//           title
//         }
//       }
//     }
//   }
  
//   mutation {
//     bookEvent(eventId: "65d05e9928b4dc34824b259c") {
//       _id,
//       event {
//         title
//       }
//       user {
//         email
//       }
//     }
//   }
  
//   mutation {
//     cancelBooking(bookingId: "65d08861a1c3e925186725b4") {
//       _id
//       title
//       creator {
//         email
//       }
//     }
//   }
  
//   mutation {
//     createUser(userInput: {email: "test@gmail.com", password: "tyueee"}) {
//       _id
//       email
//     }
//   }
  
  
  
//   mutation {
//     deleteEvent(eventId: "65c8c78da393b454c82ac488") {
//       _id
//       title
//       description
//       creator {
//         email
//         _id
//       }
//     }
//   }
  
  