import React from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/authContext";

import "./mainNavigation.css";

const MainNavigation = props => (
    <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navbigation__logo">
            <h1>Logo</h1>
          </div>
          <nav className="main-navigation__item">
            <ul>
             {!context.token && (<li>
                <NavLink to="/auth">Auth</NavLink>
              </li>)}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (<li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>)}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
