import "./index.css";
import React from "react";
import Spinner from "react-bootstrap/Spinner";

class Loader extends React.Component {
  render() {
    const { type } = this.props;

    if (type !== "button") {
      return (
        <div id="spinner-container">
          <div id="spinner-wrapper">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        </div>
      );
    }

    return (
      <>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        Loading...
      </>
    );
  }
}

export default Loader;
