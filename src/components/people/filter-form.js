import React from "react";
import "./filter-form.css";
import SelectTemplate from "components/common/form/elements/select";
import InputTemplate from "components/common/form/elements/input";
import ButtonTemplate from "components/common/form/elements/button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import UserRole from "data/constants/user-role";

class FilterForm extends React.Component {
  render() {
    const { role, keyword, onChangeRole, onChangeKeyword, onClickAddModal } =
      this.props;

    return (
      <div className="row filter-form-container">
        <div className="col-1 d-flex justify-content-center align-items-center filter-form-label">
          FILTER :
        </div>
        <div className="col-9">
          <Row>
            <Col>
              <SelectTemplate
                name="role"
                options={UserRole.selectOptions()}
                value={role}
                onChange={onChangeRole}
              />
            </Col>
            <Col>
              <InputTemplate
                type="text"
                name="keyword"
                placeholder="Keyword"
                defaultValue={keyword}
                onChange={onChangeKeyword}
              />
            </Col>
          </Row>
        </div>
        <div className="col-2 d-flex justify-content-center align-items-center">
          <ButtonTemplate type="modal" onClick={onClickAddModal}>
            ADD MEMBER
          </ButtonTemplate>
        </div>
      </div>
    );
  }
}

export default FilterForm;
