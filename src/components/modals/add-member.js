import React from "react";
import "./index.css";
import FormTemplate from "components/common/form";
import InputTemplate from "components/common/form/elements/input";
import SelectTemplate from "components/common/form/elements/select";
import ButtonTemplate from "components/common/form/elements/button";
import UserRole from "data/constants/user-role";
import Notice from "components/common/toast";
import Loader from "components/common/spinner";
import UserApiService from "services/user";
import Modal from "react-bootstrap/Modal";

class AddMember extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      isLoading: false,
      fieldErrors: null,
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setFieldErrors = (value) => this.setState({ fieldErrors: value });

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setIsLoading(true);
    this.setMessage(null);
    this.setFieldErrors(null);
    const formData = Object.fromEntries(new FormData(event.target));

    await UserApiService.create(formData)
      .then((response) => {
        const { message } = response.data;
        Notice.setSuccessToast(message);
        window.location.reload();
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
    const { show, onClose } = this.props;

    return (
      <>
        {this.state.isLoading && <Loader />}
        {this.state.message && (
          <Notice show={true} message={this.state.message} />
        )}
        <Modal
          show={show}
          backdrop="static"
          keyboard={false}
          onHide={onClose}
          onShow={() => this.setFieldErrors(null)}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="modal-header-custom"
          >
            <Modal.Title className="w-100 d-flex justify-content-center">
              ADD MEMBER
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormTemplate noBorder={true} onSubmit={this.handleSubmit}>
              <InputTemplate
                type="email"
                name="email"
                label="Email"
                className="mb-3"
                message={this.state.fieldErrors?.email}
              />
              <InputTemplate
                type="text"
                name="first_name"
                label="First Name"
                className="mb-3"
                message={this.state.fieldErrors?.first_name}
              />
              <InputTemplate
                type="text"
                name="last_name"
                label="Last Name"
                className="mb-3"
                message={this.state.fieldErrors?.last_name}
              />
              <SelectTemplate
                className="mb-3"
                name="role"
                options={UserRole.selectOptions()}
                message={this.state.fieldErrors?.role}
              />
              <div className="d-grid">
                <ButtonTemplate type="submit" disabled={this.state.isLoading}>
                  {this.state.isLoading ? <Loader type="button" /> : "SAVE"}
                </ButtonTemplate>
              </div>
            </FormTemplate>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default AddMember;
