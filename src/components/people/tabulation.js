import React from "react";
import "./tabulation.css";
import Table from "react-bootstrap/Table";
import ButtonTemplate from "../common/form/elements/button";
import { MdRestartAlt, MdPowerSettingsNew } from "react-icons/md";
import UserRole from "data/constants/user-role";

class Tabulation extends React.Component {
  render() {
    const { people, actionButtons } = this.props;

    if (!people?.length) {
      return (
        <div className="row">
          <div className="d-flex text-center align-middle justify-content-center align-items-center">
            No record(s) found.
          </div>
        </div>
      );
    }

    // Iterate and compile table data
    let thead = [];
    let tbody = [];
    people.map((item, index) => {
      // Compile table header
      if (index === 0) {
        let keys = Object.keys(item);
        keys.map((item, index) => {
          const colName = item.replaceAll("_", " ").toUpperCase();
          if (item === "id") {
            return null;
          }
          thead.push(<th key={"thead-col-" + index}>{colName}</th>);

          return true;
        });
      }
      // Compile table body
      let role;
      switch (item.role) {
        case UserRole.Admin:
          role = "Admin";
          break;
        case UserRole.Moderator:
          role = "Moderator";
          break;
        case UserRole.Reporter:
        default:
          role = "Reporter";
          break;
      }
      tbody.push(
        <tr key={`tbody-row-${index}`}>
          <td>{item.email}</td>
          <td>{item.first_name}</td>
          <td>{item.last_name}</td>
          <td>{role}</td>
          <td>
            {actionButtons.map((actionItem, actionIndex) => {
              let tooltip, icon;

              switch (actionItem?.name) {
                case "reset":
                  tooltip = "Reset Password";
                  icon = <MdRestartAlt />;
                  break;
                case "deactivate":
                  tooltip = "Deactivate";
                  icon = <MdPowerSettingsNew />;
                  break;
                default:
                  tooltip = "";
                  icon = "";
                  break;
              }

              return (
                <ButtonTemplate
                  id={`btn-${actionItem?.name}-${index}`}
                  key={actionIndex}
                  type="action"
                  tooltip={tooltip}
                  onClick={() => actionItem?.onClick(item.id)}
                >
                  {icon}
                </ButtonTemplate>
              );
            })}
          </td>
        </tr>
      );

      return true;
    });

    return (
      <Table striped responsive bordered hover>
        <thead className="text-center thead-style">
          <tr>
            {thead}
            <th>-</th>
          </tr>
        </thead>
        <tbody className="text-center">{tbody}</tbody>
      </Table>
    );
  }
}

export default Tabulation;
