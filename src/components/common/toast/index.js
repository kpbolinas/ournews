import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

class Notice extends React.Component {
  constructor(props) {
    super(props);
    const { show, type, message } = this.props;

    this.state = {
      show: show,
      type: type,
      message: message,
    };
  }

  setShow = (value) => this.setState({ show: value });

  static setSuccessToast = (message) => {
    sessionStorage.setItem(
      "toast",
      JSON.stringify({ type: "success", message: message })
    );
  };

  static setFailedToast = (message) => {
    sessionStorage.setItem(
      "toast",
      JSON.stringify({ type: "danger", message: message })
    );
  };

  render() {
    let show = this.state.show;
    let type = this.state.type;
    let message = this.state.message;
    const toastInfo = JSON.parse(sessionStorage.getItem("toast")) ?? null;
    if (toastInfo) {
      show = toastInfo ? true : false;
      type = toastInfo?.type;
      message = toastInfo?.message;
    }
    const background = type ?? "danger";
    if (show) {
      setTimeout(() => {
        this.setShow(false);
        sessionStorage.setItem("toast", null);
      }, "3000");
    }

    return (
      <>
        {show && (
          <ToastContainer position="top-end">
            <Toast show={show} bg={background}>
              <Toast.Header closeButton={false}>
                <strong className="me-auto text-black">
                  {process.env.REACT_APP_TITLE}
                </strong>
              </Toast.Header>
              <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}
      </>
    );
  }
}

export default Notice;
