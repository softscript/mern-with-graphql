import React, { Component } from "react";

import AuthContext from "../context/authContext";
import { graphQlRequest } from "../apiService/apiFetch.js";
import Loader from "../component/loader/loader";

class BookingPage extends Component {
  state = {
    bookings: [],
    isLoading: false,
  };
  componentDidMount() {
    this.fetchEventsList();
  }

  static contextType = AuthContext;

  fetchEventsList = () => {
    this.setState({
      isLoading: true,
    });
    const requestBody = {
      query: `
              query { 
                bookings {
                          _id
                          user {
                            _id
                            email
                          }
                          event {
                            _id
                            title
                            description
                            date
                            price
                          }
                      }
                  }`,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log("-----resData", resData);
        this.setState({
          bookings: resData?.data?.bookings || [],
        });
        this.setState({
          isLoading: false,
        });
        return resData;
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
        console.log("----errdeta", err);
      });
  };

  handleCancelBooking = (bookingId) => {
    this.setState({
      isLoading: true,
    });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.context.token}`,
    };
    const requestBody = {
      query: `
        mutation { cancelBooking(bookingId: "${bookingId}") {
            _id
            title
            description
        }}
        `,
    };
    graphQlRequest(requestBody, headers)
      .then((res) => {
        this.fetchEventsList();
        this.setState({
          isLoading: false,
        });
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <ul className="events__list">
            {this.state.bookings.map((booking) => (
              <li key={booking._id} className="events__list-items">
                <div>
                  <h1>
                    {booking.event.title} - {booking.user.email}
                  </h1>
                  <h3>
                    ${booking.event.price} -{" "}
                    {new Date(booking.event.date).toLocaleDateString()}
                  </h3>
                </div>
                <div>
                  {this.context.token && (
                    <button
                      className="btn"
                      onClick={() => this.handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

export default BookingPage;
