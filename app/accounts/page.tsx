'use client'

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AddAccountModal from '../components/AddAccountModal';

export default function Accounts() {
  const { accounts, addAccount, updateAccount, deleteAccount, transfers } = useAppContext();
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'savings' | 'checking' | 'investment'>('all');
  const [filterName, setFilterName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTransfers, setExpandedTransfers] = useState<{ [accountId: string]: boolean }>({});


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const confirmDeleteAccount = (accountId: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      deleteAccount(accountId);
    }
  };

  const toggleTransfers = (accountId: string) => {
    setExpandedTransfers(prevState => ({
      ...prevState,
      [accountId]: !prevState[accountId]
    }));
  };


  const filteredAccounts = accounts.filter(account => {
    const typeMatch = filterType === 'all' || account.type === filterType;
    const nameMatch = account.name.toLowerCase().includes(filterName.toLowerCase());
    return typeMatch && nameMatch;
  });

  return (
    <div className="p-8 lg:p-12 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 font-display">Manage Accounts</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Existing Accounts</h2>
            <button onClick={handleOpenModal} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
              Add New Account
            </button>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="filterType" className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'savings' | 'checking' | 'investment')}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            >
              <option value="all">All</option>
              <option value="savings">Savings</option>
              <option value="checking">Checking</option>
              <option value="investment">Investment</option>
            </select>
            <input
              type="text"
              placeholder="Filter by name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 ml-2"
            />
            <span className="text-sm text-gray-700">Count: {filteredAccounts.length}</span>
          </div>
          <AddAccountModal isOpen={isModalOpen} onClose={handleCloseModal} addAccount={addAccount} />
          <div className="space-y-4">
            {filteredAccounts.map(account => {
              const accountTransfers = transfers.filter(transfer => 
                transfer.sourceAccountId === account.id || transfer.recipientAccountId === account.id
              );
              return (
                <div key={account.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg">
                  {editingAccount === account.id ? (
                    <>
                      <input
                        type="text"
                        value={account.name}
                        onChange={(e) => updateAccount(account.id, e.target.value, account.type)}
                        className="mb-2 md:mb-0 md:mr-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                      <select
                        value={account.type}
                        onChange={(e) => updateAccount(account.id, account.name, e.target.value as 'savings' | 'checking' | 'investment')}
                        className="mb-2 md:mb-0 md:mr-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      >
                        <option value="savings">Savings</option>
                        <option value="checking">Checking</option>
                        <option value="investment">Investment</option>
                      </select>
                      <button onClick={() => setEditingAccount(null)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-600">XAF {account.balance}</p>
                        {accountTransfers.length > 0 && (
                          <div className="mt-2">
                            <button onClick={() => toggleTransfers(account.id)} className="flex items-center justify-between w-full text-gray-700 font-semibold">
                              <h4 className="font-semibold text-gray-700">Transfers:</h4>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${expandedTransfers[account.id] ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </button>
                            {expandedTransfers[account.id] && (
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {accountTransfers.map(transfer => {
                                  const isSource = transfer.sourceAccountId === account.id;
                                  const amount = isSource ? -transfer.amount : transfer.amount;
                                  const otherAccount = isSource ? accounts.find(acc => acc.id === transfer.recipientAccountId)?.name : accounts.find(acc => acc.id === transfer.sourceAccountId)?.name;
                                  return (
                                    <li key={transfer.id}>
                                      {isSource ? `Sent XAF ${amount} to ${otherAccount}` : `Received XAF ${amount} from ${otherAccount}`}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 md:mt-0">
                        <button onClick={() => setEditingAccount(account.id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2">
                          Edit
                        </button>
                        <button onClick={() => confirmDeleteAccount(account.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
