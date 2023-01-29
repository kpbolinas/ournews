import React from "react";
import CustomException from "components/common/error";

class ErrorPage extends React.Component {
  render() {
    const { code, message } = this.props;
    const msg = message ?? "Something went wrong.";
    if (code) {
      throw new CustomException(code, msg);
    }

    return (
      <div className="col d-flex h-100 text-center align-middle justify-content-center align-items-center">
        <div>{msg}</div>
      </div>
    );
  }
}

export default ErrorPage;
