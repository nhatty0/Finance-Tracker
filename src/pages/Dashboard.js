import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import TransactionsTable from "../components/TransactionsTable";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import BalanceChart from "../components/Charts/BalanceChart";
import ExpenseChart from "../components/Charts/ExpenseChart";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      description: values.description,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    if (!user) {
      toast.error("User not authenticated!");
      return;
    }
    try {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      if (!many) {
        toast.success("Transaction Added!");
        setTransactions([...transactions, transaction]);
        calculateBalance();
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }

  async function fetchTransactions() {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  let sortedTransactions = Array.isArray(transactions)
    ? [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
    : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Cards
        income={income}
        expenses={expenses}
        currentBalance={currentBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />
      {/* Display Charts or NoTransactions */}
      {transactions.length > 0 ? (
        <div className="flex flex-row justify-between gap-4 p-4">
          {/* Balance Chart */}
          <div className="w-1/2 bg-white rounded-lg shadow-md p-2">
            <div className="text-sm font-semibold mb-2 text-gray-600">
              Balance Over Time
            </div>
            <BalanceChart transactions={sortedTransactions} />
          </div>

          {/* Expense Chart */}
          <div className="w-1/2 bg-white rounded-lg shadow-md p-2">
            <ExpenseChart transactions={transactions} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <NoTransactions />
        </div>
      )}
      <TransactionsTable
        transactions={transactions}
        addTransaction={addTransaction}
        fetchTransactions={fetchTransactions}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
    </div>
  );
}

export default Dashboard;
