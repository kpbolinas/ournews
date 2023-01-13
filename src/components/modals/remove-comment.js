import React from "react";
import "./index.css";
import FormTemplate from "components/common/form";
import InputTemplate from "components/common/form/elements/input";
import ButtonTemplate from "components/common/form/elements/button";
import Notice from "components/common/toast";
import Loader from "components/common/spinner";
import CommentApiService from "services/comment";
import Modal from "react-bootstrap/Modal";

class RemoveComment extends React.Component {
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

    await CommentApiService.remove(this.props.articleId, formData)
      .then((response) => {
        const { message } = response.data;
        this.setMessageType("success");
        this.setMessage(message);
        this.props.afterSubmit();
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
    const { show, onClose } = this.props;

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
              COMMENT REMOVAL AND MAIL
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormTemplate noBorder={true} onSubmit={this.handleSubmit}>
              <InputTemplate
                as="textarea"
                rows={4}
                name="content"
                label="Mail"
                className="mb-3"
                message={this.state.fieldErrors?.content}
              />
              <div className="d-grid">
                <ButtonTemplate type="submit" disabled={this.state.isLoading}>
                  {this.state.isLoading ? <Loader type="button" /> : "SEND"}
                </ButtonTemplate>
              </div>
            </FormTemplate>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default RemoveComment;
