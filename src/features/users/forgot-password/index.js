import React from "react";
import FormTemplate from "components/common/form";
import ButtonTemplate from "components/common/form/elements/button";
import InputTemplate from "components/common/form/elements/input";
import UserApiService from "services/user";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      messageType: null,
      isLoading: false,
      fieldErrors: null,
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setMessageType = (value) => this.setState({ messageType: value });

  setFieldErrors = (value) => this.setState({ fieldErrors: value });

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setIsLoading(true);
    this.setMessage(null);
    this.setMessageType(null);
    this.setFieldErrors(null);
    const formData = Object.fromEntries(new FormData(event.target));

    await UserApiService.forgotPassword(formData)
      .then(async (response) => {
        const { message } = response.data;
        this.setMessageType("success");
        this.setMessage(message);
      })
      .catch(({ response }) => {
        const result = response.data;
        if (response.status === 422) {
          this.setFieldErrors(result.errors);
        } else {
          const message = result?.message;
          this.setMessage(message);
          this.setMessageType("danger");
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
          <Notice
            show={true}
            type={this.state.messageType}
            message={this.state.message}
          />
        )}
        <FormTemplate header="FORGOT PASSWORD" onSubmit={this.handleSubmit}>
          <InputTemplate
            type="email"
            name="email"
            label="Email"
            className="mb-3"
            message={this.state.fieldErrors?.email}
          />
          <div className="d-grid">
            <ButtonTemplate type="submit" disabled={this.state.isLoading}>
              {this.state.isLoading ? <Loader type="button" /> : "SUBMIT"}
            </ButtonTemplate>
          </div>
        </FormTemplate>
        <div className="d-flex align-items-end flex-column">
          <ButtonTemplate type="link" className="no-side-padding" to="/">
            Back to LOGIN
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

export default ForgotPassword;
