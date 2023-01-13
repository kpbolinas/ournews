import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogoMain from "assets/images/guest/on.png";
import LoginPage from "pages/login";
import ForgotPasswordPage from "pages/forgot-password";
import VerificationPage from "pages/verification";
import ErrorPage from "pages/error";

class GuestLayout extends React.Component {
  render() {
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
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route path="/verification" element={<VerificationPage />} />
                  <Route
                    path="/not-found"
                    element={<ErrorPage code={404} message="Page Not Found" />}
                  />
                  <Route
                    path="*"
                    element={<Navigate replace to="/not-found" />}
                  />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GuestLayout;
