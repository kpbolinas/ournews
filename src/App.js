import React from "react";
import "./App.css";
import GuestLayout from "components/layouts/guest";
import MainLayout from "components/layouts/main";
import { AuthContext } from "features/users/authentication";

class App extends React.Component {
  static contextType = AuthContext;

  render() {
    const { auth } = this.context;

    if (!auth) {
      return <GuestLayout />;
    }

    return <MainLayout role={auth?.role} />;
  }
}

export default App;
