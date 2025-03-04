import { Radio, Select, Table } from "antd";
import React, { useState } from "react";
import searchImg from "../../assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

function TransactionsTable({
  transactions,
  addTransaction,
  fetchTransactions,
}) {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.description?.toLowerCase().includes(search.toLowerCase()) &&
      (item.type ? item.type.includes(typeFilter) : false) // Ensure `item.type` exists
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportCSV() {
    var csv = unparse({
      fields: ["description", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCSV(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          const validTransactions = results.data.filter(
            (transaction) =>
              transaction.description &&
              transaction.type &&
              transaction.date &&
              transaction.amount
          ); // ✅ Ignore rows where all fields are NaN

          for (const transaction of validTransactions) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
              type: transaction.type
                ? transaction.type.trim().toLowerCase()
                : "expense", // Default to "expense"
            };
            await addTransaction(newTransaction, true);
          }

          if (validTransactions.length === 0) {
            toast.warning("No valid transactions found in the file.");
          } else {
            toast.success("All valid transactions added!");
          }

          fetchTransactions();
        },
      });

      event.target.value = null;
    } catch (e) {
      toast.error("Failed to import transactions.");
    }
  }

  return (
    <>
      {/* Search and Filter Container */}
      <div className="search-filter-container">
        <div className="input-flex">
          <img src={searchImg} width="16" alt="search" />
          <input
            value={search}
            placeholder="Search by Description"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expenses</Option>
        </Select>
      </div>

      <div className="transactions-container">
        <div className="transactions-header">
          <h2 className="transactions-title">My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div className="transactions-buttons">
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <Table
          className="transactions-table"
          dataSource={sortedTransactions}
          columns={columns}
        />
      </div>
    </>
  );
}

export default TransactionsTable;
