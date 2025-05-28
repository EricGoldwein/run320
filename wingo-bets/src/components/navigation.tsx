import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            <span className="text-xl font-bold"><span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> World</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              href="/register" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Find Your Kick
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 