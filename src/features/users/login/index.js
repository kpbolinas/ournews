import React from "react";
import { AuthConsumer } from "../authentication";
import UserRole from "data/constants/user-role";
import FormTemplate from "components/common/form";
import ButtonTemplate from "components/common/form/elements/button";
import InputTemplate from "components/common/form/elements/input";
import UserApiService from "services/user";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      message: null,
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setIsLoading(true);
    this.setMessage(null);
    const formData = Object.fromEntries(new FormData(event.target));
    const { context } = this.props;
    const { updateAuth } = context;

    await UserApiService.login(formData)
      .then(async (response) => {
        const { data } = response.data;
        const role = data.role;
        const userRoles = UserRole.all();

        if (userRoles.includes(role)) {
          await updateAuth(data);
          window.location.href =
            role === UserRole.Moderator ? "/unpublished" : "/member";
        } else {
          await UserApiService.logout({
            headers: { Authorization: "Bearer " + data.token },
          });
          this.setMessage("Access Denied (Forbidden)");
        }
      })
      .catch(({ response }) => {
        const message = response.data?.message;
        this.setMessage(message);
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  render() {
    return (
      <>
        {this.state.isLoading && <Loader />}
        {this.state.message && (
          <Notice show={true} message={this.state.message} />
        )}
        <FormTemplate header="LOGIN" onSubmit={this.handleSubmit}>
          <InputTemplate
            type="email"
            name="email"
            label="Email"
            className="mb-3"
          />
          <InputTemplate
            type="password"
            name="password"
            label="Password"
            className="mb-3"
          />
          <div className="d-grid">
            <ButtonTemplate type="submit" disabled={this.state.isLoading}>
              {this.state.isLoading ? <Loader type="button" /> : "LOGIN"}
            </ButtonTemplate>
          </div>
        </FormTemplate>
        <div className="d-flex align-items-end flex-column">
          <ButtonTemplate
            type="link"
            className="no-side-padding"
            to="/forgot-password"
          >
            Forgot Password
          </ButtonTemplate>
          <ButtonTemplate
            type="link"
            className="no-side-padding"
            to="/verification"
          >
            Verification
          </ButtonTemplate>
        </div>
      </>
    );
  }
}

const Login = () => (
  <AuthConsumer>{(state) => <LoginForm context={state} />}</AuthConsumer>
);

export default Login;
