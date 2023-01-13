import React from "react";
import "./filter-form.css";
import SelectTemplate from "components/common/form/elements/select";
import InputTemplate from "components/common/form/elements/input";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class FilterForm extends React.Component {
  render() {
    const { order, date, onChangeOrder, onChangeDate } = this.props;

    return (
      <div className="row filter-form-container">
        <div className="col-1 d-flex justify-content-center align-items-center filter-form-label">
          FILTER :
        </div>
        <div className="col-11">
          <Row>
            <Col>
              <SelectTemplate
                name="order"
                options={[
                  { name: "Latest", value: 1 },
                  { name: "Oldest", value: 2 },
                ]}
                value={order}
                onChange={onChangeOrder}
              />
            </Col>
            <Col>
              <InputTemplate
                type="date"
                name="date"
                defaultValue={date}
                onChange={onChangeDate}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default FilterForm;
