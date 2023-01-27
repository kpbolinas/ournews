import React from "react";
import "./index.css";
import { Outlet } from "react-router-dom";
import { AuthContext } from "features/users/authentication";
import LogoModerator from "assets/images/main/on-moderator-header.png";
import LogoAdmin from "assets/images/main/on-admin-header.png";
import SideBar from "components/sidebar";
import HeaderTitle from "components/header";
import UserRole from "data/constants/user-role";

class MainLayout extends React.Component {
  static contextType = AuthContext;

  render() {
    const { auth, authGuard } = this.context;
    authGuard("main");
    const role = auth?.role;
    let logo;

    switch (role) {
      case UserRole.SuperAdmin:
      case UserRole.Admin:
        logo = LogoAdmin;
        break;

      case UserRole.Moderator:
      default:
        logo = LogoModerator;
        break;
    }

    return (
      <div className="container-fluid h-100">
        <div id="header-main" className="row">
          <div
            id="header-logo-container"
            className="col-2 d-flex text-center align-middle justify-content-center align-items-center"
          >
            <img id="header-logo" src={logo} alt="OUR News" />
          </div>
          <div
            id="header-title"
            className="col-10 d-flex text-center align-middle justify-content-center align-items-center"
          >
            <HeaderTitle />
          </div>
        </div>
        <div className="row h-100">
          <div id="sidebar-container" className="col-2">
            <SideBar role={role} />
          </div>
          <div className="col-10">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }
}

export default MainLayout;
