import React, { Component } from "react";
import Modal from "../component/modal";
import Backdrop from "../component/backdrop";
import AuthContext from "../context/authContext";
import Loader from "../component/loader/loader";
import { isEmpty } from "lodash";
import "./events.css";

class EventPage extends Component {
  state = {
    creatingEvent: false,
    events: [],
    isLoading: false,
  };
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descElRef = React.createRef();
  }

  startCreatingEvent = () => {
    this.setState({ creatingEvent: true });
  };

  componentDidMount() {
    this.fetchEventsList();
  }

  modalConfirmHandler = () => {
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descElRef.current.value;
    let isValidData = true;
    if (isEmpty(this.titleElRef.current.value)) {
      this.titleElRef.current.focus();
      isValidData = false;
    }
    if (price <= 0) {
      this.priceElRef.current.focus();
      isValidData = false;
    }
    if (isEmpty(this.dateElRef.current.value)) {
      this.dateElRef.current.focus();
      isValidData = false;
    }
    if (isEmpty(this.descElRef.current.value)) {
      this.descElRef.current.focus();
      isValidData = false;
    }
    this.setState({ creatingEvent: !isValidData });
    if (isValidData) {
      const token = this.context.token;
      this.setState({
        isLoading: true,
      });

      const requestBody = {
        query: `
            mutation { 
                createEvent(eventInput: {title: "${title}", price: ${price}, date: "${date}", description: "${description}"}) {
                        _id
                        title
                        description
                        date
                        creator {
                            email
                        }
                    }
                }`,
      };

      fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          // console.log("----res", resData);
          this.fetchEventsList();
        })
        .catch((err) => {
          console.log("----err", err);
          this.setState({
            isLoading: false,
          });
        });
    }
  };

  modalCancelHandler = () => {
    this.setState({ creatingEvent: false });
  };

  fetchEventsList = () => {
    this.setState({
      isLoading: true,
    });
    const requestBody = {
      query: `
          query { 
              events {
                      _id
                      title
                      description
                      date
                      price
                      creator {
                        _id
                        email
                      }
                  }
              }`,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log("-----resData", resData);
        this.setState({
          events: resData.data.events,
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

  handleBookEvent = (eventId) => {

    const token = this.context.token;
    console.log('-----eventId', eventId)
    const reqBody = {
      query: `
      mutation {
        bookEvent(eventId: "${eventId}") {
          _id,
          createdAt
          updatedAt
        }
      }
      `
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log("-----resData", resData);
        
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

  render() {
    return (
      <React.Fragment>
        {this.state.creatingEvent && <Backdrop />}
        {this.state.creatingEvent && (
          <Modal
            title="Modal Title"
            onConfirm={this.modalConfirmHandler}
            onCancel={this.modalCancelHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="title">Prince</label>
                <input type="number" id="price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="title">Date</label>
                <input type="datetime-local" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea id="description" ref={this.descElRef} rows={4} />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.startCreatingEvent}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <ul className="events__list">
            {this.state.events.map((event) => (
              <li key={event._id} className="events__list-items">
                <div>
                  <h1>{event.title}</h1>
                  <h3>
                    ${event.price} - {new Date(event.date).toLocaleDateString()}
                  </h3>
                </div>
                <div>
                  {this.context.userId === event.creator._id ? (
                    <span>
                      <p>Self Created </p>
                      {this.context.token && (
                        <button
                          className="btn"
                          onClick={() => this.handleBookEvent(event._id)}
                        >
                          Book Event
                        </button>
                      )}
                    </span>
                  ) : (
                    <span>
                      <p>Created By other </p>
                      {this.context.token && (
                        <button
                          className="btn"
                          onClick={() => this.handleBookEvent(event._id)}
                        >
                          Book Event
                        </button>
                      )}
                    </span>
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

export default EventPage;
