import React from "react";
import UserApiService from "services/user";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";
import FilterForm from "components/people/filter-form";
import Tabulation from "components/people/tabulation";
import Paginate from "components/common/pagination";
import AddMember from "components/modals/add-member";
import ResetPassword from "components/modals/reset-password";
import DeactivateAccount from "components/modals/deactivate-account";

class OurPeople extends React.Component {
  constructor(props) {
    super(props);
    const sessionParams =
      JSON.parse(sessionStorage.getItem("people-params")) ?? {};

    this.state = {
      message: null,
      isLoading: false,
      people: [],
      page: 1,
      lastPage: null,
      role: 0,
      keyword: null,
      ...sessionParams,
      articleDetail: null,
      selectedPersonId: null,
      showAddModal: false,
      showResetPassModal: false,
      showDeactivateModal: false,
      timer: null,
    };

    const params = {
      page: 1,
      role: 0,
      keyword: null,
      ...sessionParams,
    };
    sessionStorage.setItem("people-params", JSON.stringify(params));
  }

  setParams = (param) => {
    let params = JSON.parse(sessionStorage.getItem("people-params"));
    params = { ...params, ...param };
    sessionStorage.setItem("people-params", JSON.stringify(params));
  };

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setPeople = (value) => this.setState({ people: value });

  setLastPage = (value) => this.setState({ lastPage: value });

  setArticleDetail = (value) => this.setState({ articleDetail: value });

  setSelectedPersonId = (value) => this.setState({ selectedPersonId: value });

  setPage = async (value) => {
    await this.setState({ page: value });
    await this.getPeople();
    this.setParams({ page: value });
  };

  setRole = async (value) => {
    await this.setState({ role: value });
    await this.getPeople();
    this.setParams({ role: value });
  };

  setKeyword = async (value) => {
    await this.setState({ keyword: value });
    await this.setParams({ keyword: value });
    if (typeof this.state.timer === "number") {
      clearTimeout(this.state.timer);
    }

    this.setState({
      timer: setTimeout(() => {
        this.getPeople();
        this.setState({ timer: null });
      }, 2000),
    });
  };

  getPeople = () => {
    this.setIsLoading(true);
    this.setMessage(null);
    let params = "";
    params += "/" + this.state.page;
    params += "/" + this.state.role;
    if (this.state.keyword) {
      params += "/" + this.state.keyword;
    }
    UserApiService.list(params)
      .then((response) => {
        const { data } = response.data;
        const people = data.people;
        const lastPage = data.last_page;
        this.setPeople(people);
        this.setLastPage(lastPage);
      })
      .catch(({ response }) => {
        const message = response.data?.message;
        this.setMessage(message);
        this.setPeople([]);
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  showAddModal = () => this.setState({ showAddModal: true });

  closeAddModal = () => this.setState({ showAddModal: false });

  showResetPassModal = async (id = null) => {
    await this.setSelectedPersonId(id);
    this.setState({ showResetPassModal: true });
  };

  closeResetPassModal = () => this.setState({ showResetPassModal: false });

  showDeactivateModal = async (id = null) => {
    await this.setSelectedPersonId(id);
    this.setState({ showDeactivateModal: true });
  };

  closeDeactivateModal = () => this.setState({ showDeactivateModal: false });

  componentDidMount() {
    this.getPeople();
  }

  render() {
    const people = this.state.people;

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
              role={this.state.role}
              keyword={this.state.keyword}
              onChangeRole={this.setRole}
              onChangeKeyword={this.setKeyword}
              onClickAddModal={this.showAddModal}
            />
            <Tabulation
              people={people}
              actionButtons={[
                { name: "reset", onClick: this.showResetPassModal },
                { name: "deactivate", onClick: this.showDeactivateModal },
              ]}
            />
            <Paginate
              currentPage={this.state.page}
              lastPage={this.state.lastPage}
              onClick={this.setPage}
            />
            <AddMember
              show={this.state.showAddModal}
              onClose={this.closeAddModal}
            />
            <ResetPassword
              show={this.state.showResetPassModal}
              onClose={this.closeResetPassModal}
              personId={this.state.selectedPersonId}
            />
            <DeactivateAccount
              show={this.state.showDeactivateModal}
              onClose={this.closeDeactivateModal}
              personId={this.state.selectedPersonId}
            />
          </>
        )}
      </>
    );
  }
}

export default OurPeople;
