'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccountType = 'savings' | 'checking' | 'investment' | 'lending' | 'borrowing';

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Loan {
  id: string;
  sourceAccountId: string;
  recipientAccountId: string;
  amount: number;
  startDate: string;
  endDate: string;
  term: number;
  interestRate: number;
}

interface Transfer {
  id: string;
  date: string;
  sourceAccountId: string;
  recipientAccountId: string;
  amount: number;
  term: number;
  interestRate: number;
  recipients: { accountId: string; amount: number }[];
}

interface AppContextType {
  accounts: Account[];
  transfers: Transfer[];
  addAccount: (name: string, type: AccountType) => void;
  updateAccount: (id: string, name: string, type: AccountType) => void;
  deleteAccount: (id: string) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void;
  updateTransfer: (id: string, updatedTransfer: Omit<Transfer, 'id'>) => void;
  deleteTransfer: (id: string) => void;
  addLoan: (loan: Omit<Loan, 'id'>) => void;
  updateLoan: (id: string, updatedLoan: Omit<Loan, 'id'>) => void;
  deleteLoan: (id: string) => void;
  loans: Loan[];
  repayLoan: (loanId: string, amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    const storedTransfers = localStorage.getItem('transfers');
    const storedLoans = localStorage.getItem('loans');
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
    if (storedTransfers) setTransfers(JSON.parse(storedTransfers));
    if (storedLoans) setLoans(JSON.parse(storedLoans));
    if (!storedAccounts && !storedTransfers && !storedLoans) {
      initializeSampleData();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('transfers', JSON.stringify(transfers));
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [accounts, transfers, loans]);

  const addAccount = (name: string, type: AccountType) => {
    setAccounts([...accounts, { id: Date.now().toString(), name, type, balance: 0 }]);
  };

  const updateAccount = (id: string, name: string, type: AccountType) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, name, type } : account
    ));
  };

  const deleteAccount = (id: string) => {
    // Delete associated transfers
    setTransfers(transfers.filter(transfer => transfer.sourceAccountId !== id && transfer.recipientAccountId !== id));
    // Delete the account
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const addTransfer = (transfer: Omit<Transfer, 'id'>) => {
    const newTransfer = { ...transfer, id: Date.now().toString() };
    
    // Check if it's a borrowing from investment to checking
    const sourceAccount = accounts.find(acc => acc.id === transfer.sourceAccountId);
    const recipientAccount = accounts.find(acc => acc.id === transfer.recipientAccountId);
    if (sourceAccount && sourceAccount.type === 'checking' && recipientAccount && recipientAccount.type === 'investment') {
      // Apply interest (e.g., 5%)
      const interest = transfer.amount * (transfer.interestRate / 100);
      transfer.amount += interest;
    }
    setTransfers([...transfers, newTransfer]);
    updateAccountBalances(newTransfer);
  };

  const repayLoan = (loanId: string, amount: number) => {
    setLoans(loans.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, amount: loan.amount - amount };
      }
      return loan;
    }));
    // Update account balances
    setAccounts(accounts.map(account => {
      const loan = loans.find(loan => loan.id === loanId);
      if (loan && account.id === loan.recipientAccountId) {
          return { ...account, balance: account.balance + amount };
      }
      return account;
    }));
  };

  const updateTransfer = (id: string, updatedTransfer: Omit<Transfer, 'id'>) => {
    const oldTransfer = transfers.find(t => t.id === id);
    if (oldTransfer) {
      // Revert the old transfer
      updateAccountBalances(oldTransfer, true);
    }
    
    const newTransfer = { ...updatedTransfer, id };
    setTransfers(transfers.map(t => t.id === id ? newTransfer : t));
    
    // Apply the new transfer
    updateAccountBalances(newTransfer);
  };

  const deleteTransfer = (id: string) => {
    const transferToDelete = transfers.find(t => t.id === id);
    if (transferToDelete) {
      // Revert the transfer
      updateAccountBalances(transferToDelete, true);
      setTransfers(transfers.filter(t => t.id !== id));
    }
  };

 const updateAccountBalances = (transfer: Transfer, revert: boolean = false) => {
    setAccounts(accounts.map(account => {
      if (account.id === transfer.sourceAccountId) {
        return {
          ...account,
          balance: isNaN(account.balance + (revert ? transfer.amount : -transfer.amount)) ? 0 : account.balance + (revert ? transfer.amount : -transfer.amount),
        };
      }
      if (account.id === transfer.recipientAccountId) {
        return {
          ...account,
          balance: isNaN(account.balance + (revert ? -transfer.amount : transfer.amount)) ? 0 : account.balance + (revert ? -transfer.amount : transfer.amount),
        };
      }
      return account;
    }));
  };

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    setLoans([...loans, { ...loan, id: Date.now().toString() }]);
  };

  const updateLoan = (id: string, updatedLoan: Omit<Loan, 'id'>) => {
    setLoans(loans.map(loan => loan.id === id ? { ...loan, ...updatedLoan } : loan));
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };



  function initializeSampleData() {
    const sampleAccounts: Account[] = [
      { id: '1', name: 'My Savings', type: 'savings', balance: 1000 },
      { id: '2', name: 'My Checking', type: 'checking', balance: 500 },
      { id: '3', name: 'My Investment', type: 'investment', balance: 2000 },
    ];
    const sampleTransfers: Transfer[] = [
      {
        id: '1',
        date: new Date().toISOString(),
        sourceAccountId: '2',
        recipientAccountId: '1',
        amount: 200,
        term: 12,
        interestRate: 5,
        recipients: [{ accountId: '1', amount: 200 }],
      },
      {
        id: '2',
        date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
        sourceAccountId: '2',
        recipientAccountId: '3',
        amount: 100,
        term: 12,
        interestRate: 5,
        recipients: [{ accountId: '3', amount: 100 }],
      },
    ];
    const sampleLoans: Loan[] = [
      {
        id: '1',
        sourceAccountId: '3',
        recipientAccountId: '2',
        amount: 100,
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        term: 12, // Example term in months
        interestRate: 5, // Example interest rate in percentage
      },
    ];
    setAccounts(sampleAccounts);
    setTransfers(sampleTransfers);
    setLoans(sampleLoans);
  }

  return (
    <AppContext.Provider value={{ 
      accounts, 
      transfers, 
      addAccount, 
      updateAccount, 
      deleteAccount, 
      addTransfer,
      updateTransfer,
      deleteTransfer,
      addLoan,
      updateLoan,
      deleteLoan,
      loans,
      repayLoan
    }}>
      {children}
    </AppContext.Provider>
  );
};
