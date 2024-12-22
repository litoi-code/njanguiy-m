'use client'

import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Loan } from '../context/AppContext';

export default function LendingPage() {
  const { accounts, loans, addLoan, updateLoan, deleteLoan, repayLoan } = useAppContext();
  useEffect(() => {
    console.log('Accounts:', accounts);
  }, [accounts]);
  const [newLoan, setNewLoan] = useState({
    sourceAccountId: '',
    recipientAccountId: '',
    amount: 0,
    startDate: '',
    endDate: '',
    term: 0,
    interestRate: 0,
  });
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [editedLoan, setEditedLoan] = useState({
    sourceAccountId: '',
    recipientAccountId: '',
    amount: 0,
    startDate: '',
    endDate: '',
    term: 0,
    interestRate: 0,
  });
  const [repaymentAmount, setRepaymentAmount] = useState(0);

  const lendingAccounts = accounts.filter(account => account.type === 'investment' || account.type === 'lending');
  const borrowingAccounts = accounts.filter(account => account.type === 'checking' || account.type === 'borrowing');

  const handleAddLoan = () => {
    addLoan({
      sourceAccountId: newLoan.sourceAccountId,
      recipientAccountId: newLoan.recipientAccountId,
      amount: newLoan.amount,
      startDate: newLoan.startDate,
      endDate: newLoan.endDate,
      term: newLoan.term,
      interestRate: newLoan.interestRate,
    });
    setNewLoan({ sourceAccountId: '', recipientAccountId: '', amount: 0, startDate: '', endDate: '', term: 0, interestRate: 0 });
  };

  const handleEditLoan = (loanId: string) => {
    const loan = loans.find((loan: Loan) => loan.id === loanId);
    if (loan) {
      setEditingLoanId(loanId);
      setEditedLoan({ 
        sourceAccountId: loan.sourceAccountId, 
        recipientAccountId: loan.recipientAccountId, 
        amount: loan.amount, 
        startDate: loan.startDate, 
        endDate: loan.endDate, 
        term: loan.term, 
        interestRate: loan.interestRate 
      });
    }
  };

  const handleSaveLoan = (loanId: string) => {
    updateLoan(loanId, {
      sourceAccountId: editedLoan.sourceAccountId,
      recipientAccountId: editedLoan.recipientAccountId,
      amount: editedLoan.amount,
      startDate: editedLoan.startDate,
      endDate: editedLoan.endDate,
      term: editedLoan.term,
      interestRate: editedLoan.interestRate,
    });
    setEditingLoanId(null);
    setEditedLoan({ sourceAccountId: '', recipientAccountId: '', amount: 0, startDate: '', endDate: '', term: 0, interestRate: 0 });
  };

  const handleDeleteLoan = (loanId: string) => {
    deleteLoan(loanId);
  };

  const handleRepayLoan = (loanId: string) => {
    repayLoan(loanId, repaymentAmount);
    setRepaymentAmount(0);
  };

  const calculateTotalRepayment = (amount: number, term: number, interestRate: number) => {
    return amount + (amount * (interestRate / 100) * (term / 12));
  };

  return (
    <div className="p-8 lg:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-display">
        Loan Management
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Loan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sourceAccount" className="block text-sm font-medium text-gray-700">Source Account (Investment)</label>
            <select
              id="sourceAccount"
              value={newLoan.sourceAccountId}
              onChange={(e) => setNewLoan({ ...newLoan, sourceAccountId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            >
              <option value="">Select Source Account</option>
              {lendingAccounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="recipientAccount" className="block text-sm font-medium text-gray-700">Recipient Account (Checking)</label>
            <select
              id="recipientAccount"
              value={newLoan.recipientAccountId}
              onChange={(e) => setNewLoan({ ...newLoan, recipientAccountId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            >
              <option value="">Select Recipient Account</option>
              {borrowingAccounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              id="amount"
              value={newLoan.amount}
              onChange={(e) => setNewLoan({ ...newLoan, amount: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={newLoan.startDate}
              onChange={(e) => setNewLoan({ ...newLoan, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              value={newLoan.endDate}
              onChange={(e) => setNewLoan({ ...newLoan, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">Term (months)</label>
            <input
              type="number"
              id="term"
              value={newLoan.term}
              onChange={(e) => setNewLoan({ ...newLoan, term: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              value={newLoan.interestRate}
              onChange={(e) => setNewLoan({ ...newLoan, interestRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <button
          onClick={handleAddLoan}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Loan
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {loans.map(loan => (
            <li key={loan.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {accounts.find(a => a.id === loan.recipientAccountId)?.name}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    {editingLoanId === loan.id ? (
                      <button
                        onClick={() => handleSaveLoan(loan.id)}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditLoan(loan.id)}
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLoan(loan.id)}
                          className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Amount: XAF {loan.amount}
                    </p>
                    <p className="flex items-center text-sm text-gray-500 ml-4">
                      Start Date: {new Date(loan.startDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center text-sm text-gray-500 ml-4">
                      End Date: {new Date(loan.endDate).toLocaleDateString()}
                    </p>
                    <p className="flex items-center text-sm text-gray-500 ml-4">
                      Term: {loan.term} months
                    </p>
                    <p className="flex items-center text-sm text-gray-500 ml-4">
                      Interest Rate: {loan.interestRate}%
                    </p>
                    <p className="flex items-center text-sm text-gray-500 ml-4">
                      Total Repayment: XAF {calculateTotalRepayment(loan.amount, loan.term, loan.interestRate)}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <input
                      type="number"
                      placeholder="Repayment Amount"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      onChange={(e) => setRepaymentAmount(Number(e.target.value))}
                    />
                    <button
                      onClick={() => handleRepayLoan(loan.id)}
                      className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      Repay
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
