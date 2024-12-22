'use client'
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { reset } = useAppContext();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Njangui-Yèm
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/accounts" className="text-gray-300 hover:text-white">
            Comptes
          </Link>
           <Link href="/transfer" className="text-gray-300 hover:text-white">
            Transférer
          </Link>
          <Link href="/transfers" className="text-gray-300 hover:text-white">
            Transferts
          </Link>
           <Link href="/lending" className="text-gray-300 hover:text-white">
            Loans
          </Link>
          <button onClick={reset} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Reset
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
