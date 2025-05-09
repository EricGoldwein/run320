import React from 'react';
import { User } from '../types';

interface LedgerProps {
  user: User;
}

const Ledger: React.FC<LedgerProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Transaction History
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            View your $WINGO transaction history
          </p>
        </div>

        <div className="mt-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Your Balance: {user.wingo_balance} $WINGO
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Date</div>
                <div className="text-sm font-medium text-gray-500">Type</div>
                <div className="text-sm font-medium text-gray-500">Amount</div>
              </div>
              {/* Transaction list will go here */}
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No transactions yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger; 