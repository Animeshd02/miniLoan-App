import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase/firebase'; // Assuming your Firebase config is in a file named 'firebase.js'
// import { useNavigate } from 'react-router-dom'; // Replace with your actual routing setup
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
import {signInWithEmailAndPassword} from 'firebase/auth'
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      console.log(user);
      const isAdmin = () => {
        return user && user.email === 'admin@gmail.com';
      };

      const userIsAdmin = isAdmin();


      router.push(userIsAdmin ? '/loan-applications' : '/loan-dashboard');
    } catch (error) {
      console.error(error);
      // Handle errors here, e.g., display error messages to the user
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">mini-LoanApp</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
