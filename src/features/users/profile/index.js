import React from "react";
import "./index.css";
import UserApiService from "services/user";
import Loader from "components/common/spinner";
import Notice from "components/common/toast";
import ProfileDefault from "assets/images/main/default-profile.png";
import ButtonTemplate from "components/common/form/elements/button";
import EditInfo from "components/modals/edit-info";
import ChangePassword from "components/modals/change-password";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditInfoModal: false,
      showChangePassModal: false,
      message: null,
      isLoading: false,
      info: [],
    };
  }

  setIsLoading = (value) => this.setState({ isLoading: value });

  setMessage = (value) => this.setState({ message: value });

  setInfo = (value) => this.setState({ info: value });

  showEditInfoModal = () => this.setState({ showEditInfoModal: true });

  closeEditInfoModal = () => this.setState({ showEditInfoModal: false });

  showChangePassModal = () => this.setState({ showChangePassModal: true });

  closeChangePassModal = () => this.setState({ showChangePassModal: false });

  getProfile = () => {
    this.setIsLoading(true);
    this.setMessage(null);
    UserApiService.profile()
      .then((response) => {
        const { data } = response.data;
        this.setInfo(data);
      })
      .catch(({ response }) => {
        const message = response.data?.message;
        this.setMessage(message);
        this.setInfo([]);
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  componentDidMount() {
    this.getProfile();
  }

  render() {
    return (
      <>
        {this.state.isLoading && <Loader />}
        {this.state.message && (
          <Notice show={true} message={this.state.message} />
        )}
        <Notice />
        {!this.state.isLoading && (
          <>
            <div className="row profile-wrapper">
              <div className="col-4 d-flex text-center align-middle justify-content-center align-items-center">
                <img src={ProfileDefault} alt="Default Profile" />
              </div>
              <div className="col-8 d-flex align-middle align-items-center">
                <div className="row w-100 info-wrapper">
                  <div>
                    <span className="info-label">Email: </span>
                    <span>{this.state.info.email}</span>
                  </div>
                  <div>
                    <span className="info-label">First Name: </span>
                    <span>{this.state.info.first_name}</span>
                  </div>
                  <div>
                    <span className="info-label">Last Name: </span>
                    <span>{this.state.info.last_name}</span>
                  </div>
                  <div>
                    <span>
                      <ButtonTemplate
                        type="modal"
                        onClick={this.showEditInfoModal}
                      >
                        Edit Info
                      </ButtonTemplate>
                    </span>
                    &nbsp;
                    <span>
                      <ButtonTemplate
                        type="modal"
                        onClick={this.showChangePassModal}
                      >
                        Change Password
                      </ButtonTemplate>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <EditInfo
              show={this.state.showEditInfoModal}
              onClose={this.closeEditInfoModal}
              info={this.state.info}
            />
            <ChangePassword
              show={this.state.showChangePassModal}
              onClose={this.closeChangePassModal}
            />
          </>
        )}
      </>
    );
  }
}

export default Profile;
