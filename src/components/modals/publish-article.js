import React from "react";
import "./index.css";
import InputTemplate from "components/common/form/elements/input";
import ButtonTemplate from "components/common/form/elements/button";
import Notice from "components/common/toast";
import Loader from "components/common/spinner";
import ArticleApiService from "services/article";
import Modal from "react-bootstrap/Modal";
import ArticleDefault from "assets/images/main/default-article.png";

class PublishArticle extends React.Component {
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

    await ArticleApiService.publish(this.props.articleDetail?.id)
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
    const { show, onClose, articleDetail } = this.props;

    return (
      <>
        {this.state.isLoading && <Loader />}
        {this.state.message && (
          <Notice show={true} message={this.state.message} />
        )}
        <Modal
          size="lg"
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
              PUBLISH ARTICLE
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-3">
                <img
                  className="img-fluid"
                  src={ArticleDefault}
                  alt="Default Article"
                />
              </div>
              <div className="col-9">
                <InputTemplate
                  type="text"
                  name="title"
                  label="Title"
                  className="mb-3"
                  disabled={true}
                  defaultValue={articleDetail?.title}
                />
                <InputTemplate
                  as="textarea"
                  rows={5}
                  name="content"
                  label="Body"
                  className="mb-3"
                  disabled={true}
                  defaultValue={articleDetail?.content}
                />
                <div className="d-grid">
                  <ButtonTemplate
                    type="button"
                    onClick={this.sendRequest}
                    disabled={this.state.isLoading}
                  >
                    {this.state.isLoading ? (
                      <Loader type="button" />
                    ) : (
                      "PUBLISH"
                    )}
                  </ButtonTemplate>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default PublishArticle;
