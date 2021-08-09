import axios from "axios";
import { useRef, useContext } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("/auth/register", user);
        loginCall({ email: user.email, password: user.password }, dispatch); // MUST write out ref to use data
        // history.push("/login"); // redirect to login after register with posibility to go back
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NotIngSoc</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on NotIngSoc.
          </span>
        </div>
        <div className="loginRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                "Sign Up"
              )}
            </button>
            <button
              className="loginRegisterButton"
              type="button"
              disabled={isFetching}
              onClick={() => {
                history.push("/login");
              }}
            >
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                "Log into Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
