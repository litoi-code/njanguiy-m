'use client'

import { useAppContext } from './context/AppContext';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const { accounts, transfers } = useAppContext();
  const [accountTypeFilter, setAccountTypeFilter] = useState<'all' | 'savings' | 'checking' | 'investment'>('all');
  const [nameFilter, setNameFilter] = useState('');

  // Filter accounts based on selected type and name
  const filteredAccounts = accounts.filter(account => 
    (accountTypeFilter === 'all' || account.type === accountTypeFilter) &&
    account.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // Get unique months from transfers
  const uniqueMonths = [...new Set(transfers.map(transfer => 
    new Date(transfer.date).toLocaleString('default', { month: 'short' })
  ))].sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(a) - months.indexOf(b);
  });

  // Calculate monthly volumes for each recipient account
  const monthlyVolumes = transfers.reduce((acc, transfer) => {
    const month = new Date(transfer.date).toLocaleString('default', { month: 'short' });
    
    transfer.recipients.forEach(recipient => {
      const account = accounts.find(a => a.id === recipient.accountId);
      if (account && (account.type === 'savings' || account.type === 'investment')) {
        if (!acc[recipient.accountId]) {
          acc[recipient.accountId] = {};
        }
        if (!acc[recipient.accountId][month]) {
          acc[recipient.accountId][month] = 0;
        }
        acc[recipient.accountId][month] += recipient.amount;
      }
    });
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const chartSeries = Object.entries(monthlyVolumes).map(([accountId, volumes]) => ({
    name: accounts.find(a => a.id === accountId)?.name || 'Unknown Account',
    data: uniqueMonths.map(month => volumes[month] || 0)
  }));

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899'],
    xaxis: {
      categories: uniqueMonths,
      labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px',
        fontFamily: 'Inter var, sans-serif'
      }
      }
    },
    yaxis: {
      title: {
        text: 'Amount',
        style: {
          color: '#64748b',
          fontSize: '14px',
          fontFamily: 'Inter var, sans-serif'
        }
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val) => `XAF ${val.toFixed(2)}`
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50 p-8 lg:p-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 font-display">
        Dashboard
      </h1>
      
      <div className="grid gap-8 mb-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Monthly Savings Volume
          </h2>
          <div className="rounded-xl overflow-hidden mb-4">
            <Chart 
              options={chartOptions} 
              series={chartSeries} 
              type="line" 
              height={350} 
            />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Account Balances
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredAccounts.length})
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search accounts..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value as 'all' | 'savings' | 'checking' | 'investment')}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Types</option>
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="investment">Investment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map(account => (
              <div 
                key={account.id} 
                className={`p-6 rounded-xl ${
                  account.balance < 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                } border shadow-sm`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{account.name}</h3>
                <p className={`font-bold text-xl ${
                  account.balance < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  XAF {typeof account.balance === 'number' ? account.balance.toFixed(2) : '0.00'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
