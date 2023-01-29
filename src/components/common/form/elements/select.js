import React from "react";
import Form from "react-bootstrap/Form";

class SelectTemplate extends React.Component {
  render() {
    const { name, label, options, value, message, onChange, className } =
      this.props;

    return (
      <Form.Group className={className} controlId={`formGroup${label ?? name}`}>
        {label && <Form.Label>{label}</Form.Label>}
        <Form.Select
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          name={name}
          value={value}
          isInvalid={!!message}
        >
          {options.map((item, index) => (
            <option key={index} value={item.value}>
              {item.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
      </Form.Group>
    );
  }
}

export default SelectTemplate;
