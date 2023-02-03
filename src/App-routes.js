import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GuestLayout from "components/layouts/guest";
import MainLayout from "components/layouts/main";
import LoginPage from "pages/login";
import ForgotPasswordPage from "pages/forgot-password";
import VerificationPage from "pages/verification";
import ArchivedPage from "pages/archived";
import LogoutPage from "pages/logout";
import MemberPage from "pages/member";
import ProfilePage from "pages/profile";
import PublishedPage from "pages/published";
import UnpublishedPage from "pages/unpublished";
import ErrorPage from "pages/error";

class AppRoutes extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verification" element={<VerificationPage />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route path="/unpublished" element={<UnpublishedPage />} />
            <Route path="/published" element={<PublishedPage />} />
            <Route path="/archived" element={<ArchivedPage />} />
            <Route path="/member" element={<MemberPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Route>
          <Route
            path="/not-found"
            element={<ErrorPage code={404} message="Page Not Found" />}
          />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="*" element={<Navigate replace to="/not-found" />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default AppRoutes;
