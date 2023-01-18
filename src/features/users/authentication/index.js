import React from "react";
import { axios, initializeApiConfig } from "api";
import CustomException from "components/common/error";

const AuthContext = React.createContext({
  auth: null,
  updateAuth: () => {},
});

const AuthConsumer = AuthContext.Consumer;

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    initializeApiConfig();

    this.state = {
      auth: this.checkAuthStorage(),
      updateAuth: this.updateAuth,
      errorCode: null,
      message: null,
    };
  }

  updateAuth = async (auth, route = "/") => {
    const stringifyAuth = auth ? JSON.stringify(auth) : null;
    localStorage.setItem("auth-info", stringifyAuth);
    await this.setState({ auth });
    window.location.href = route;
  };

  checkAuthStorage = () => {
    // Set user auth token
    return JSON.parse(localStorage.getItem("auth-info")) ?? null;
  };

  async componentDidMount() {
    // Set csrf token
    await axios
      .get("/sanctum/csrf-cookie")
      .then(() => {})
      .catch(({ response }) => {
        const status = response.status;
        const message = response?.data.message;
        // Check if unauthorized (No API Token)
        if (status === 401) {
          localStorage.setItem("auth-info", null);
          this.setState({ errorCode: status, message: message });
        }
      });

    // Set auth token
    const authToken = this.state.auth?.token
      ? "Bearer " + this.state.auth.token
      : "";
    axios.defaults.headers.common["Authorization"] = authToken;

    if (authToken !== "") {
      // Validate token API
      await axios
        .get("/api/validate-token")
        .then(() => {})
        .catch(({ response }) => {
          const status = response.status;
          const message = response?.data.message;
          // Check if unauthorized (No API Token)
          if (status === 401) {
            localStorage.setItem("auth-info", null);
            this.setState({ errorCode: status, message: message });
          }
        });
    }
  }

  render() {
    if (this.state.errorCode === 401) {
      throw new CustomException(this.state.errorCode, this.state.message);
    }

    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export { AuthContext, AuthProvider, AuthConsumer };
