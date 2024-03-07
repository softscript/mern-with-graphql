import React, { Component } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AuthPage from "./pages/auth";
import BookingPage from "./pages/bookings";
import EventPage from "./pages/events";
import MainNavigation from "./component/navigation/mainNavigation";
import AuthContext from "./context/authContext";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
    tokenExpiration: null,
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId,
      tokenExpiration: tokenExpiration,
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Routes>
                {!this.state.token && (
                  <Route path="/" element={<Navigate to="/auth" replace />} />
                )}
               
                {this.state.token && (
                  <Route path="/" element={<Navigate to="/events" replace />} />
                )}
                {this.state.token && (
                  <Route
                    path="/auth"
                    element={<Navigate to="/events" replace />}
                  />
                )}
                {!this.state.token && (
                  <Route path="/auth" Component={AuthPage} />
                )}
                <Route path="/events" Component={EventPage} />
                {this.state.token && (
                  <Route path="/bookings" Component={BookingPage} />
                )}
              </Routes>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
