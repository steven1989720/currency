import React, { useState } from 'react';

const PerPageCount = ({ onPerPageChange }) => {
  const [perPage, setPerPage] = useState(10); // Default per page count

  const handleChange = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    setPerPage(newPerPage);
    onPerPageChange(newPerPage);
  };

  return (
    <span className="float-right">
        Per Page Count&nbsp;:&nbsp;
        <select value={perPage} onChange={handleChange}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        </select>
    </span>
  );
};

export default PerPageCount;
