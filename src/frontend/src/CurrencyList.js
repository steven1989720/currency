import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import PerPageCount from './PerPageCount';

function CurrencyList() {
  const [currencies, setCurrencies] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPageCount, setPerPageCount] = useState(10);
  const [token, setToken] = useState('');

  const loginAndGetToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:4000/login', {
        // Your login credentials
        username: 'yourUsername',
        password: 'yourPassword'
      });
      setToken(response.data.token); // Assuming the token is returned in response.data.token
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (token.length === 0)
        return;

      const response = await axios.get(`http://127.0.0.1:4000/api/currencies/${currentPage},${perPageCount}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = JSON.parse(response.data);
      setCurrencies(data.currencies);
      setPageCount(Math.ceil(data.total / perPageCount));
    };

    fetchData();
  }, [currentPage, perPageCount, token]);

  const handlePageClick = (event) => {
    const newPage = event.selected;
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (event) => {
    setPerPageCount(event);
  };

 return (
    <div>
      
      <h1>Currency Rates vs RUB
        <button onClick={loginAndGetToken} className="btn btn-success float-right">Login</button>
      </h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="th-no">No</th>
            <th className="th-code">Code</th>
            <th>Name</th>
            <th>Rate1(RUB)</th>
          </tr>
        </thead>
        <tbody>
        {currencies.map((currency, index) => (
          <tr key={currency.id}>
            <td>{index + 1}</td>
            <td>{currency.id}</td>
            <td>{currency.name}</td>
            <td>{currency.rate}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <PerPageCount onPerPageChange={handlePerPageChange}/>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
      />
    </div>
);
}

export default CurrencyList;
