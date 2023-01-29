import React from "react";
import FormTemplate from "components/common/form";
import ButtonTemplate from "components/common/form/elements/button";
import InputTemplate from "components/common/form/elements/input";
import UserApiService from "services/user";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";
import Card from "react-bootstrap/Card";

class Verification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      isLoading: false,
      fieldErrors: null,
      showMessage: false,
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setFieldErrors = (value) => this.setState({ fieldErrors: value });

  setShowMessage = (value) => this.setState({ showMessage: value });

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setIsLoading(true);
    this.setMessage(null);
    this.setFieldErrors(null);
    this.setShowMessage(false);
    const formData = Object.fromEntries(new FormData(event.target));

    await UserApiService.verification(formData)
      .then(async (response) => {
        this.setShowMessage(true);
      })
      .catch(({ response }) => {
        const result = response.data;
        if (response.status === 422) {
          this.setFieldErrors(result.errors);
        } else {
          const message = result?.message;
          this.setMessage(message);
        }
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
        {this.state.showMessage && (
          <Card bg="success" text="white" className="text-center">
            <Card.Body>
              <Card.Title>RESET PASSWORD SUCCESSFUL!</Card.Title>
              <Card.Text>
                Your temporary password has been sent to your email.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
        <FormTemplate header="VERIFICATION" onSubmit={this.handleSubmit}>
          <InputTemplate
            type="email"
            name="email"
            label="Email"
            className="mb-3"
            message={this.state.fieldErrors?.email}
          />
          <InputTemplate
            type="text"
            name="token"
            label="Token"
            className="mb-3"
            message={this.state.fieldErrors?.token}
          />
          <div className="d-grid">
            <ButtonTemplate type="submit" disabled={this.state.isLoading}>
              {this.state.isLoading ? <Loader type="button" /> : "SUBMIT"}
            </ButtonTemplate>
          </div>
        </FormTemplate>
        <div className="d-flex align-items-end flex-column">
          <ButtonTemplate type="link" className="no-side-padding" to="/login">
            Back to LOGIN
          </ButtonTemplate>
          <ButtonTemplate
            type="link"
            className="no-side-padding"
            to="/forgot-password"
          >
            Forgot Password
          </ButtonTemplate>
        </div>
      </>
    );
  }
}

export default Verification;
