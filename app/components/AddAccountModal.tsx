'use client'

import { useState } from 'react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  addAccount: (name: string, type: 'savings' | 'checking' | 'investment') => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, addAccount }) => {
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'savings' | 'checking' | 'investment'>('savings');

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(newAccountName, newAccountType);
    setNewAccountName('');
    setNewAccountType('savings');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Add New Account
          </h3>
          <div className="mt-2 px-7 py-3">
            <form onSubmit={handleAddAccount} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="newAccountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                <input
                  type="text"
                  id="newAccountName"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="newAccountType" className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  id="newAccountType"
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value as 'savings' | 'checking' | 'investment')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                >
                  <option value="savings">Savings</option>
                  <option value="checking">Checking</option>
                  <option value="investment">Investment</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded mr-2">
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
