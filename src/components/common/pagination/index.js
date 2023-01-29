import React from "react";
import "./index.css";
import Pagination from "react-bootstrap/Pagination";

class Paginate extends React.Component {
  render() {
    let { currentPage, lastPage, onClick } = this.props;
    currentPage = currentPage ?? 1;
    lastPage = lastPage ?? 1;
    if (!currentPage || (lastPage <= 1 && lastPage === currentPage)) {
      return "";
    }
    let pages = [];
    // Previous Pages
    for (
      let number = currentPage;
      number >= currentPage - 4 && number !== 0;
      number--
    ) {
      pages[number] = (
        <Pagination.Item key={number} onClick={() => onClick(number)}>
          {number}
        </Pagination.Item>
      );
    }
    // Next Pages
    for (
      let number = currentPage;
      number <= currentPage + 4 && number <= lastPage;
      number++
    ) {
      pages[number] = (
        <Pagination.Item key={number} onClick={() => onClick(number)}>
          {number}
        </Pagination.Item>
      );
    }
    // Add Current Page
    pages[currentPage] = (
      <Pagination.Item key={currentPage} active={true}>
        {currentPage}
      </Pagination.Item>
    );

    return (
      <div className="d-flex text-center align-middle justify-content-center align-items-center">
        <Pagination>
          <Pagination.First
            onClick={() => onClick(1)}
            disabled={currentPage <= 1 && true}
          />
          <Pagination.Prev
            onClick={() => onClick(currentPage - 1)}
            disabled={currentPage <= 1 && true}
          />
          {pages}
          <Pagination.Next
            onClick={() => onClick(currentPage + 1)}
            disabled={currentPage === lastPage && true}
          />
          <Pagination.Last
            onClick={() => onClick(lastPage)}
            disabled={currentPage === lastPage && true}
          />
        </Pagination>
      </div>
    );
  }
}

export default Paginate;
