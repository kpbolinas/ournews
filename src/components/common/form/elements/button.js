import "react-tooltip/dist/react-tooltip.css";
import React from "react";
import "./index.css";
import { NavLink as Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Tooltip as ReactTooltip } from "react-tooltip";

class ButtonTemplate extends React.Component {
  render() {
    const { id, type, to, disabled, tooltip, children, className, onClick } =
      this.props;
    let result = null;

    switch (type) {
      case "button":
        result = (
          <Button
            variant="outline-danger"
            type="button"
            className="btn-custom-color"
            disabled={disabled}
            onClick={onClick}
          >
            {children}
          </Button>
        );
        break;
      case "submit":
        result = (
          <Button
            variant="outline-danger"
            type="submit"
            className="btn-custom-color"
            disabled={disabled}
          >
            {children}
          </Button>
        );
        break;
      case "modal":
        result = (
          <Button
            variant="outline-danger"
            className="btn-custom-color"
            onClick={onClick}
          >
            {children}
          </Button>
        );
        break;

      case "link":
        result = (
          <Button
            variant="link"
            as={Link}
            to={to}
            disabled={disabled}
            className={className}
          >
            {children}
          </Button>
        );
        break;

      case "action":
        result = (
          <>
            <ReactTooltip
              anchorId={id}
              content={tooltip}
              offset
              variant="info"
            />
            <Button id={id} variant="link" as="a" onClick={onClick}>
              {children}
            </Button>
          </>
        );
        break;

      default:
        break;
    }

    return result;
  }
}

export default ButtonTemplate;
