import React from "react";
import UserRole from "data/constants/user-role";
import { Nav } from "react-bootstrap";
import { NavLink as Link } from "react-router-dom";

class SideBar extends React.Component {
  render() {
    return (
      <Nav id="sidebar" justify variant="pills" className="flex-column">
        {this.props.role === UserRole.Moderator && (
          <>
            <Nav.Link as={Link} to="/unpublished" eventKey="link-1">
              Unpublished
            </Nav.Link>
            <Nav.Link as={Link} to="/published" eventKey="link-2">
              Published
            </Nav.Link>
            <Nav.Link as={Link} to="/archived" eventKey="link-3">
              Archived
            </Nav.Link>
          </>
        )}
        {[UserRole.SuperAdmin, UserRole.Admin].includes(this.props.role) && (
          <Nav.Link as={Link} to="/member" eventKey="link-4">
            Our People
          </Nav.Link>
        )}
        <Nav.Link as={Link} to="/profile" eventKey="link-5">
          Profile
        </Nav.Link>
        <Nav.Link as={Link} to="/logout">
          Logout
        </Nav.Link>
      </Nav>
    );
  }
}

export default SideBar;
