import React from "react";
import "./styles.css";
import { Card, Row } from "antd";
import Button from "../Button";

function Cards({ income, expenses, currentBalance, showExpenseModal, showIncomeModal }) {
    return <div>
        <Row className="my-row">
            <Card variant={true} className="my-card">
                <h2>Current Balance</h2>
                <p> {currentBalance} ETB</p>
                <Button text="Reset Balance" blue={true}/>
                </Card>
                <Card variant={true} className="my-card">
                <h2>Total Income</h2>
                <p>{income} ETB</p>
                <Button text="Add Income" blue={true} onClick={showIncomeModal}/>
                </Card>
                <Card variant={true} className="my-card">
                <h2>Total Expenses </h2>
                <p>{expenses} ETB</p>
                <Button text="Add Expense" blue={true} onClick={showExpenseModal}/>
                </Card>
        </Row>
    </div>
}

export default Cards;