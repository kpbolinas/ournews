import "./index.css";
import React from "react";
import Form from "react-bootstrap/Form";

class FormTemplate extends React.Component {
  render() {
    let headerSection;
    const { header, onSubmit, noBorder } = this.props;

    if (header) {
      headerSection = (
        <div className="form-header-custom-color">
          <h2>{header}</h2>
        </div>
      );
    }

    return (
      <>
        {headerSection}
        <Form
          noValidate
          onSubmit={onSubmit}
          className={`form-main ${!noBorder && `form-main-border`}`}
        >
          {this.props.children}
        </Form>
      </>
    );
  }
}

export default FormTemplate;
