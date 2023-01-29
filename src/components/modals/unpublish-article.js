import React from "react";
import "./index.css";
import ButtonTemplate from "components/common/form/elements/button";
import Notice from "components/common/toast";
import Loader from "components/common/spinner";
import ArticleApiService from "services/article";
import Modal from "react-bootstrap/Modal";

class UnpublishArticle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      isLoading: false,
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  sendRequest = async () => {
    this.setIsLoading(true);
    this.setMessage(null);

    await ArticleApiService.unpublish(this.props.articleId)
      .then((response) => {
        const { message } = response.data;
        Notice.setSuccessToast(message);
        window.location.reload();
      })
      .catch(({ response }) => {
        const result = response.data;
        const message = result?.message;
        this.setMessage(message);
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
          size="sm"
          show={show}
          backdrop="static"
          keyboard={false}
          onHide={onClose}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="modal-header-custom"
          >
            <Modal.Title className="w-100 d-flex justify-content-center">
              UNPUBLISH ARTICLE
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 text-center">
              Are you sure you want to unpublish this article?
            </div>
            <div className="d-grid">
              <ButtonTemplate
                type="button"
                onClick={this.sendRequest}
                disabled={this.state.isLoading}
              >
                {this.state.isLoading ? <Loader type="button" /> : "CONFIRM"}
              </ButtonTemplate>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default UnpublishArticle;
