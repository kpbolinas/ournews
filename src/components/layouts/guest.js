import React from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "features/users/authentication";
import LogoMain from "assets/images/guest/on.png";

class GuestLayout extends React.Component {
  static contextType = AuthContext;

  render() {
    const { authGuard } = this.context;
    authGuard("guest");

    return (
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col d-flex text-center align-middle justify-content-center align-items-center">
            <div>
              <img src={LogoMain} alt="OUR News" />
            </div>
          </div>
          <div className="col d-flex align-middle justify-content-center align-items-center">
            <div className="w-50">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GuestLayout;
