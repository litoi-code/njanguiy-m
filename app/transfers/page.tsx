'use client'

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Link from 'next/link';

export default function TransferManagement() {
  const { transfers, accounts, updateTransfer, deleteTransfer } = useAppContext();
  const [editingTransfer, setEditingTransfer] = useState<string | null>(null);
  const [filterAccountId, setFilterAccountId] = useState('');

  const handleEdit = (transferId: string) => {
    setEditingTransfer(transferId);
  };

  const handleSave = (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (transfer) {
      updateTransfer(transferId, {
        date: transfer.date,
        sourceAccountId: transfer.sourceAccountId,
        recipients: transfer.recipients
      });
    }
    setEditingTransfer(null);
  };

  const handleDelete = (transferId: string) => {
    if (window.confirm('Are you sure you want to delete this transfer?')) {
      deleteTransfer(transferId);
    }
  };

  const handleDateChange = (transferId: string, newDate: string) => {
    const updatedTransfers = transfers.map(t =>
      t.id === transferId ? { ...t, date: newDate } : t
    );
    updateTransfer(transferId, updatedTransfers.find(t => t.id === transferId)!);
  };

  const handleClearFilter = () => {
    setFilterAccountId('');
  };

  const filteredTransfers = filterAccountId
    ? transfers.filter(transfer => transfer.sourceAccountId === filterAccountId)
    : transfers;

  return (
    <div className="p-8 lg:p-12 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-display">Transfer Management</h1>
        <Link href="/transfer" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
          New Transfer
        </Link>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="filterAccount" className="text-sm font-medium text-gray-700">Filter by Account:</label>
        <select
          id="filterAccount"
          value={filterAccountId}
          onChange={(e) => setFilterAccountId(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
        >
          <option value="">All Accounts</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
        <button
          onClick={handleClearFilter}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
        <span className="text-sm text-gray-700">Count: {filteredTransfers.length}</span>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTransfers.map(transfer => (
            <li key={transfer.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {editingTransfer === transfer.id ? (
                      <input
                        type="date"
                        value={transfer.date}
                        onChange={(e) => handleDateChange(transfer.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                    ) : (
                      new Date(transfer.date).toLocaleDateString()
                    )}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    {editingTransfer === transfer.id ? (
                      <button
                        onClick={() => handleSave(transfer.id)}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(transfer.id)}
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transfer.id)}
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
                      From: {accounts.find(a => a.id === transfer.sourceAccountId)?.name}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Total: XAF {transfer.recipients ? transfer.recipients.reduce((sum, r) => sum + (r.amount || 0), 0).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-500">Recipients:</h4>
                  <ul className="mt-1 space-y-1">
                    {transfer.recipients?.map((recipient, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {accounts.find(a => a.id === recipient.accountId)?.name}: XAF {recipient.amount ? recipient.amount.toFixed(2) : '0.00'}
                      </li>
                    )) || null}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
