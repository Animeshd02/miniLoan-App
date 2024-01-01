import Link from 'next/link';

function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to mini-LoanApp</h1>
      <p>Please login or signup to create or Access loan.</p>
      <div className="flex items-center justify-center mt-4">
        {/* <Link > */}
          <a href="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </a>
        {/* </Link> */}
        {/* <Link > */}
          <a href="/login" className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Login
          </a>
        {/* </Link> */}
      </div>
    </div>
  );
}

export default Home;
