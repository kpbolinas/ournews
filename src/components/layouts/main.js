import React from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogoModerator from "assets/images/main/on-moderator-header.png";
import LogoAdmin from "assets/images/main/on-admin-header.png";
import SideBar from "components/sidebar";
import HeaderTitle from "components/header";
import UserRole from "data/constants/user-role";
import ArchivedPage from "pages/archived";
import LogoutPage from "pages/logout";
import MemberPage from "pages/member";
import ProfilePage from "pages/profile";
import PublishedPage from "pages/published";
import UnpublishedPage from "pages/unpublished";
import ErrorPage from "pages/error";

class MainLayout extends React.Component {
  render() {
    let logo;

    switch (this.props.role) {
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
        <BrowserRouter>
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
              <SideBar role={this.props.role} />
            </div>
            <div className="col-10">
              <Routes>
                {this.props.role === UserRole.Moderator && (
                  <>
                    <Route path="/unpublished" element={<UnpublishedPage />} />
                    <Route path="/published" element={<PublishedPage />} />
                    <Route path="/archived" element={<ArchivedPage />} />
                  </>
                )}
                {[UserRole.SuperAdmin, UserRole.Admin].includes(
                  this.props.role
                ) && <Route path="/member" element={<MemberPage />} />}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route
                  path="/not-found"
                  element={<ErrorPage code={404} message="Page Not Found" />}
                />
                <Route
                  path="*"
                  element={<Navigate replace to="/not-found" />}
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default MainLayout;
