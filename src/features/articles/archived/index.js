import React from "react";
import ArticleApiService from "services/article";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";
import FilterForm from "components/articles/filter-form";
import Tabulation from "components/articles/tabulation";
import Paginate from "components/common/pagination";
import UnarchiveArticle from "components/modals/unarchive-article";

class Archived extends React.Component {
  constructor(props) {
    super(props);
    const sessionParams =
      JSON.parse(sessionStorage.getItem("archived-params")) ?? {};

    this.state = {
      message: null,
      isLoading: false,
      articles: [],
      page: 1,
      lastPage: null,
      order: 1,
      date: null,
      ...sessionParams,
      selectedArticleId: null,
      showUnarchiveModal: false,
    };

    const params = {
      page: 1,
      order: 1,
      date: null,
      ...sessionParams,
    };
    sessionStorage.setItem("archived-params", JSON.stringify(params));
  }

  setParams = (param) => {
    let params = JSON.parse(sessionStorage.getItem("archived-params"));
    params = { ...params, ...param };
    sessionStorage.setItem("archived-params", JSON.stringify(params));
  };

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setArticles = (value) => this.setState({ articles: value });

  setLastPage = (value) => this.setState({ lastPage: value });

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
    ArticleApiService.archived(params)
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

  showUnarchiveModal = async (id = null) => {
    await this.setSelectedArticleId(id);
    this.setState({ showUnarchiveModal: true });
  };

  closeUnarchiveModal = () => this.setState({ showUnarchiveModal: false });

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
                { name: "unarchive", onClick: this.showUnarchiveModal },
              ]}
            />
            <Paginate
              currentPage={this.state.page}
              lastPage={this.state.lastPage}
              onClick={this.setPage}
            />
            <UnarchiveArticle
              show={this.state.showUnarchiveModal}
              onClose={this.closeUnarchiveModal}
              articleId={this.state.selectedArticleId}
            />
          </>
        )}
      </>
    );
  }
}

export default Archived;
