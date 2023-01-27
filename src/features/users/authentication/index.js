import React from "react";
import { axios, initializeApiConfig } from "api";
import CustomException from "components/common/error";
import UserRole from "data/constants/user-role";

const AuthContext = React.createContext({
  auth: null,
  updateAuth: () => {},
  authGuard: () => {},
});

const AuthConsumer = AuthContext.Consumer;

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    initializeApiConfig();

    this.state = {
      auth: this.checkAuthStorage(),
      updateAuth: this.updateAuth,
      authGuard: this.authGuard,
      errorCode: null,
      message: null,
    };
  }

  authGuard = (layout) => {
    const layouts = ["guest", "main"];

    if (!layouts.includes(layout)) {
      localStorage.setItem("auth-info", null);
      window.location.href = "/not-found";
    }
    const auth = this.state.auth;

    if (auth && layout === "guest") {
      const role = auth?.role;
      let redirectRoute;
      switch (role) {
        case UserRole.SuperAdmin:
        case UserRole.Admin:
          redirectRoute = "/member";
          break;

        case UserRole.Moderator:
        default:
          redirectRoute = "/unpublished";
          break;
      }

      window.location.href = redirectRoute;
    }

    if (!auth && layout === "main") {
      window.location.href = "/login";
    }

    return null;
  };

  updateAuth = async (auth) => {
    const stringifyAuth = auth ? JSON.stringify(auth) : null;
    localStorage.setItem("auth-info", stringifyAuth);
    await this.setState({ auth });
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
