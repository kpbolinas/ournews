import React from "react";
import ErrorPage from "pages/error";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorCode: null, errorMessage: null };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      errorCode: error.code,
      errorMessage: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          message={`${this.state.errorCode} - ${this.state.errorMessage}`}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
