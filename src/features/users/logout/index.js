import React from "react";
import { AuthConsumer } from "../authentication";
import UserApiService from "services/user";

class LogoutObject extends React.Component {
  constructor(props) {
    super(props);

    this.logout();
  }

  logout = async () => {
    const { context } = this.props;
    const { updateAuth } = context;

    await UserApiService.logout()
      .then(() => {
        updateAuth(null);
        window.location.href = "/login";
      })
      .catch(({ response }) => {
        const message = response.data?.message;
        console.log(message);
      });
  };

  render() {
    return true;
  }
}

const Logout = () => (
  <AuthConsumer>{(state) => <LogoutObject context={state} />}</AuthConsumer>
);

export default Logout;
