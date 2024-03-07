import React, { Component } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from 'react-router-dom'
import "./auth.css";

class AuthPage extends Component {
  // eslint-disable-next-line no-useless-constructor
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.emailRef = React.createRef();
    this.passwordRed = React.createRef();
  }

  handleSwitchMode = () => {
    this.setState((prevState) => {
      return {
        isLogin: !prevState.isLogin,
      };
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const email = this.emailRef.current.value;
    const password = this.passwordRed.current.value;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
            login(email: "${email}", password: "${password}") {
                userId
                token
                tokenExpiration
            }
        }`,
    };
    if (!this.state.isLogin) {
      requestBody = {
        query: `
            mutation { 
              createUser(userInput: {email: "${email}", password: "${password}"}) {
                      _id
                      email
                  }
              }`,
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // if (res.status !== 200 || res.status !== 201) {
        //   throw new Error("Failed");
        // }
        return res.json();
      })
      .then((resData) => {
        if(resData.data.login.token) {
            const { login: { token, userId, tokenExpiration }} = resData.data
            this.context.login(token, userId, tokenExpiration);
        }
      })
      .catch((err) => {
        console.log("----err", err);
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input name="email" id="email" ref={this.emailRef} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            ref={this.passwordRed}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.handleSwitchMode}>
            Switch to {this.state.isLogin ? "Signup" : "Signin"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
