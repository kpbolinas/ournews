import React from "react";
import ArticleApiService from "services/article";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";
import FilterForm from "components/articles/filter-form";
import Tabulation from "components/articles/tabulation";
import Paginate from "components/common/pagination";
import PublishArticle from "components/modals/publish-article";
import ReturnArticle from "components/modals/return-article";
import ArchiveArticle from "components/modals/archive-article";

class Unpublished extends React.Component {
  constructor(props) {
    super(props);
    const sessionParams =
      JSON.parse(sessionStorage.getItem("unpublished-params")) ?? {};

    this.state = {
      message: null,
      isLoading: false,
      articles: [],
      page: 1,
      lastPage: null,
      order: 1,
      date: null,
      ...sessionParams,
      articleDetail: null,
      selectedArticleId: null,
      showPublishModal: false,
      showRevisionModal: false,
      showArchiveModal: false,
    };

    const params = {
      page: 1,
      order: 1,
      date: null,
      ...sessionParams,
    };
    sessionStorage.setItem("unpublished-params", JSON.stringify(params));
  }

  setParams = (param) => {
    let params = JSON.parse(sessionStorage.getItem("unpublished-params"));
    params = { ...params, ...param };
    sessionStorage.setItem("unpublished-params", JSON.stringify(params));
  };

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setArticles = (value) => this.setState({ articles: value });

  setLastPage = (value) => this.setState({ lastPage: value });

  setArticleDetail = (value) => this.setState({ articleDetail: value });

  setSelectedArticleId = (value) => this.setState({ selectedArticleId: value });

  setPage = async (value) => {
    await this.setState({ page: value });
    await this.getArticles();
    this.setParams({ page: value });
  };

  setOrder = async (value) => {
    await this.setState({ order: value });
    await this.getArticles();
    this.setParams({ order: value });
  };

  setDate = async (value) => {
    await this.setState({ date: value });
    await this.getArticles();
    this.setParams({ date: value });
  };

  getArticles = () => {
    this.setIsLoading(true);
    this.setMessage(null);
    let params = "";
    params += "/" + this.state.page;
    params += "/" + this.state.order;
    if (this.state.date) {
      params += "/" + this.state.date;
    }
    ArticleApiService.unpublished(params)
      .then((response) => {
        const { data } = response.data;
        const articles = data.articles;
        const lastPage = data.last_page;
        this.setArticles(articles);
        this.setLastPage(lastPage);
      })
      .catch(({ response }) => {
        const message = response.data?.message;
        this.setMessage(message);
        this.setArticles([]);
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  getArticleDetail = (id) => {
    ArticleApiService.detail(id)
      .then((response) => {
        const { data } = response.data;
        this.setArticleDetail(data);
      })
      .catch(({ response }) => {
        const message = response.data?.message;
        this.setMessage(message);
        this.setArticleDetail(null);
      });
  };

  showPublishModal = async (id = null) => {
    await this.getArticleDetail(id);
    this.setState({ showPublishModal: true });
  };

  closePublishModal = () => this.setState({ showPublishModal: false });

  showRevisionModal = async (id = null) => {
    await this.setSelectedArticleId(id);
    this.setState({ showRevisionModal: true });
  };

  closeRevisionModal = () => this.setState({ showRevisionModal: false });

  showArchiveModal = async (id = null) => {
    await this.setSelectedArticleId(id);
    this.setState({ showArchiveModal: true });
  };

  closeArchiveModal = () => this.setState({ showArchiveModal: false });

  componentDidMount() {
    this.getArticles();
  }

  render() {
    const articles = this.state.articles;

    return (
      <>
        {this.state.isLoading && <Loader />}
        {this.state.message && (
          <Notice show={true} message={this.state.message} />
        )}
        <Notice />
        {!this.state.isLoading && (
          <>
            <FilterForm
              order={this.state.order}
              date={this.state.date}
              onChangeOrder={this.setOrder}
              onChangeDate={this.setDate}
            />
            <Tabulation
              articles={articles}
              actionButtons={[
                { name: "publish", onClick: this.showPublishModal },
                { name: "revision", onClick: this.showRevisionModal },
                { name: "archive", onClick: this.showArchiveModal },
              ]}
            />
            <Paginate
              currentPage={this.state.page}
              lastPage={this.state.lastPage}
              onClick={this.setPage}
            />
            <PublishArticle
              show={this.state.showPublishModal}
              onClose={this.closePublishModal}
              articleDetail={this.state.articleDetail}
            />
            <ReturnArticle
              show={this.state.showRevisionModal}
              onClose={this.closeRevisionModal}
              articleId={this.state.selectedArticleId}
            />
            <ArchiveArticle
              show={this.state.showArchiveModal}
              onClose={this.closeArchiveModal}
              articleId={this.state.selectedArticleId}
            />
          </>
        )}
      </>
    );
  }
}

export default Unpublished;
