import React from "react";
import "./article-comments.css";
import InputTemplate from "components/common/form/elements/input";
import ButtonTemplate from "components/common/form/elements/button";
import Notice from "components/common/toast";
import Loader from "components/common/spinner";
import CommentApiService from "services/comment";
import Modal from "react-bootstrap/Modal";
import ArticleDefault from "assets/images/main/default-article.png";
import CommenterDefault from "assets/images/main/default-profile-comment.png";
import Paginate from "components/common/pagination";
import { MdReport } from "react-icons/md";
import RemoveComment from "./remove-comment";

class ArticleComments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
      isLoading: false,
      info: [],
      page: 1,
      lastPage: null,
      selectedArticleId: null,
      showRemoveCommentModal: false,
      higlightedRow: null,
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setInfo = (value) => this.setState({ info: value });

  setSelectedArticleId = (value) => this.setState({ selectedArticleId: value });

  setLastPage = (value) => this.setState({ lastPage: value });

  setRowHighlight = (index) => this.setState({ higlightedRow: index });

  setPage = async (value) => {
    await this.setState({ page: value });
    await this.getComments();
  };

  showRemoveCommentModal = async (id = null) => {
    await this.setSelectedArticleId(id);
    this.setState({ showRemoveCommentModal: true });
  };

  closeRemoveCommentModal = () =>
    this.setState({ showRemoveCommentModal: false });

  getComments = () => {
    this.setMessage(null);
    CommentApiService.list(`/${this.props.articleId}/${this.state.page}`)
      .then((response) => {
        const { data } = response.data;
        this.setLastPage(data.last_page);
        this.setInfo(data);
      })
      .catch(({ response }) => {
        const result = response.data;
        const message = result?.message;
        this.setMessage(message);
      });
  };

  render() {
    const { show, onClose } = this.props;
    const { article, comments } = this.state.info;
    let commentSection = [];
    comments?.map((item, index) => {
      commentSection.push(
        <div
          key={index}
          id={`comment-row-${index}`}
          className={`row comment-row ${
            this.state.higlightedRow === index ? `highlight-comment-row` : ``
          }`}
        >
          <div className="col-4">
            <div className="row comment-owner-detail">
              <div className="col-3 d-flex justify-content-center align-items-center">
                <span>
                  <img
                    className="img-fluid"
                    src={CommenterDefault}
                    alt="Default Profile"
                  />
                </span>
              </div>
              <div className="col-9">
                <div className="comment-date">
                  <span>Date : </span>
                  {item.created_at}
                </div>
                <div className="comment-owner">{`${item.first_name} ${item.last_name}`}</div>
              </div>
            </div>
          </div>
          <div className="col-8 comment-content-container">
            <div className="comment-content">{item.content}</div>
            <span className="btn-report">
              <ButtonTemplate
                id={`btn-report-${index}`}
                key={index}
                type="action"
                tooltip="Remove Comment"
                onClick={() => {
                  this.showRemoveCommentModal(item.id);
                  this.setRowHighlight(index);
                }}
              >
                <MdReport />
              </ButtonTemplate>
            </span>
          </div>
        </div>
      );

      return true;
    });

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
          onShow={() => this.getComments()}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            className="modal-header-custom"
          >
            <Modal.Title className="w-100 d-flex justify-content-center">
              {article?.title}
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
                <div>
                  <InputTemplate
                    as="textarea"
                    rows={5}
                    name="content"
                    className="mb-3 article-content"
                    disabled={true}
                    defaultValue={article?.content}
                  />
                </div>
                <div className="article-date">
                  <span>Date:</span> {article?.published_date}
                </div>
                <div className="article-reporter">
                  <span>Reporter:</span> {article?.reporter_name}
                </div>
              </div>
            </div>
            <div className="row mb-2 comment-section">{commentSection}</div>
            <Paginate
              currentPage={this.state.page}
              lastPage={this.state.lastPage}
              onClick={this.setPage}
            />
          </Modal.Body>
        </Modal>
        <RemoveComment
          show={this.state.showRemoveCommentModal}
          onClose={() => {
            this.closeRemoveCommentModal();
            this.setRowHighlight(null);
          }}
          afterSubmit={() => {
            this.closeRemoveCommentModal();
            this.setRowHighlight(null);
            this.getComments();
          }}
          articleId={this.state.selectedArticleId}
        />
      </>
    );
  }
}

export default ArticleComments;
