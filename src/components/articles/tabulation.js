import React from "react";
import "./tabulation.css";
import { Table } from "react-bootstrap";
import ButtonTemplate from "../common/form/elements/button";
import {
  MdPublish,
  MdAssignmentReturn,
  MdArchive,
  MdUnpublished,
  MdUnarchive,
} from "react-icons/md";

class Tabulation extends React.Component {
  render() {
    const { articles, actionButtons, showComments, trClass } = this.props;

    if (!articles?.length) {
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
    articles.map((item, index) => {
      // Compile table header
      if (index === 0) {
        let keys = Object.keys(item);
        keys.map((item, index) => {
          let colName = "";
          switch (item) {
            case "id":
              return null;
            case "updated_at":
              colName = "LAST MODIFIED DATE";
              break;

            case "publish_date":
              colName = "PUBLISHED DATE";
              break;

            default:
              colName = item.replaceAll("_", " ");
              break;
          }
          thead.push(
            <th key={"thead-col-" + index}>{colName.toUpperCase()}</th>
          );

          return true;
        });
      }
      // Compile table body
      tbody.push(
        <tr key={`tbody-row-${index}`} className={trClass}>
          <td onClick={showComments ? () => showComments(item.id) : undefined}>
            {item.title}
          </td>
          <td onClick={showComments ? () => showComments(item.id) : undefined}>
            {item.updated_at ?? item.publish_date}
          </td>
          <td>
            {actionButtons.map((actionItem, actionIndex) => {
              let tooltip, icon;

              switch (actionItem?.name) {
                case "publish":
                  tooltip = "Publish";
                  icon = <MdPublish />;
                  break;
                case "revision":
                  tooltip = "Return";
                  icon = <MdAssignmentReturn />;
                  break;
                case "archive":
                  tooltip = "Archive";
                  icon = <MdArchive />;
                  break;
                case "unpublish":
                  tooltip = "Unpublish";
                  icon = <MdUnpublished />;
                  break;
                case "unarchive":
                  tooltip = "Unarchive";
                  icon = <MdUnarchive />;
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
