import React from "react";
import "./index.css";
import Form from "react-bootstrap/Form";

class InputTemplate extends React.Component {
  render() {
    const {
      as,
      rows,
      type,
      name,
      label,
      defaultValue,
      message,
      helpText,
      className,
      onChange,
      disabled,
    } = this.props;
    const placeholder = this.props.placeholder ?? label;
    let helpBlock;
    let ariaHelpBlock = {};

    if (helpText) {
      ariaHelpBlock["aria-describedby"] = type + "HelpBlock";
      helpBlock = (
        <Form.Text id={`${type}HelpBlock`} muted>
          {helpText}
        </Form.Text>
      );
    }

    return (
      <Form.Group
        className={className}
        controlId={`formGroup${label ? label.replace(" ", "") : name}`}
      >
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Control
          as={as}
          rows={rows}
          type={type}
          name={name}
          defaultValue={defaultValue}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          {...ariaHelpBlock}
          isInvalid={!!message}
          disabled={disabled}
        />
        {helpBlock}
        {message && (
          <Form.Control.Feedback type="invalid">
            {message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
}

export default InputTemplate;
