'use client'

import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Transfer() {
  const { accounts, addTransfer } = useAppContext();
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recipients, setRecipients] = useState<{ accountId: string; amount: number }[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);

  useEffect(() => {
    // Initialize recipients with all savings and investment accounts
    const initialRecipients = accounts
      .filter(account => account.type === 'savings' || account.type === 'investment')
      .map(account => ({ accountId: account.id, amount: 0 }));
    setRecipients(initialRecipients);
  }, [accounts]);

    useEffect(() => {
        setFilteredAccounts(accounts.filter(account =>
            account.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    }, [searchQuery, accounts]);

  const handleAmountChange = (index: number, amount: number) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index].amount = amount;
    setRecipients(updatedRecipients);
    setTotalAmount(updatedRecipients.reduce((sum, recipient) => sum + recipient.amount, 0));
  };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectAccount = (accountId: string) => {
        setSourceAccountId(accountId);
        setSearchQuery('');
    };

    const sourceAccount = accounts.find(account => account.id === sourceAccountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransfer({
      date: transferDate,
      sourceAccountId,
      recipients: recipients.filter(r => r.amount > 0),
    });
    setSuccessMessage(`Transfer from ${sourceAccount?.name} successful!`);
    // Reset form
    setSourceAccountId('');
    setTransferDate(new Date().toISOString().split('T')[0]);
    setTotalAmount(0);
    setRecipients(recipients.map(r => ({ ...r, amount: 0 })));

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="p-8 lg:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-display">Distribute Transfer</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sourceAccount" className="block text-sm font-medium text-gray-700">Source Account</label>
                <input
                    type="text"
                    placeholder={sourceAccount ? sourceAccount.name : "Search account..."}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                {searchQuery && (
                    <ul className="bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                        {filteredAccounts.map(account => (
                            <li
                                key={account.id}
                                onClick={() => handleSelectAccount(account.id)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {account.name} ({account.balance})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div>
              <label htmlFor="transferDate" className="block text-sm font-medium text-gray-700">Transfer Date</label>
              <input
                type="date"
                id="transferDate"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
            <span className="text-lg font-semibold">Total Amount: XAF {totalAmount.toFixed(2)}</span>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
              Submit Transfer
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recipient Accounts</h3>
            <div className="space-y-2">
              {recipients.map((recipient, index) => {
                const account = accounts.find(a => a.id === recipient.accountId);
                return (
                  <div key={recipient.accountId} className="flex items-center space-x-4">
<span className="w-1/3">{account?.name} (XAF {account?.balance})</span>
                    <input
                      type="number"
                      value={recipient.amount}
                      onChange={(e) => handleAmountChange(index, parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-1/3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
