import React, { useState, useEffect } from "react";
import { auth, firestore } from "../Firebase/firebase";
import { useRouter } from 'next/router';
import { addDoc, query, collection, doc, where, getDoc, getDocs } from "firebase/firestore";

const LoanDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const router = useRouter();


  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const user = auth.currentUser;
  
        if (user) {
          const userId = user.uid;
          const loansRef = collection(firestore, 'loans');
          const loansQuery = query(loansRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(loansQuery);
  
          const fetchedLoans = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          console.log('fetchedLoans:', fetchedLoans);
  
          setLoans(fetchedLoans || []); // Ensure that fetchedLoans is an array, or default to an empty array
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchLoans();
  }, []);
  

  const createLoan = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const today = new Date();
        const repaymentSchedule = [];

        // Generate scheduled repayments
        for (let i = 1; i <= term; i++) {
          const nextDueDate = new Date(today);
          nextDueDate.setDate(nextDueDate.getDate() + 7 * i); // Add 7 days for each repayment
          repaymentSchedule.push({
            dueDate: nextDueDate,
            amount: amount / term,
            state: "PENDING",
          });
        }

        // Create loan document in Firestore
        const docRef = await addDoc(collection(firestore, "loans"), {
          userId,
          amount,
          term,
          status: "PENDING",
          repaymentSchedule,
          createdAt: today,
        });

        // Fetch the newly created document to get the complete data
        const newDocSnapshot = await getDoc(
          doc(collection(firestore, "loans"), docRef.id)
        );

        // Update local loans state
        setLoans([
          ...loans,
          { id: newDocSnapshot.id, ...newDocSnapshot.data() },
        ]);

        // Clear the form fields after creating a loan
        setAmount("");
        setTerm("");
      }
    } catch (error) {
      console.error("Error creating loan:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login')
      // Redirect or perform any additional actions after logout if needed
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">mini-LoanApp - Loan Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="term" className="block text-gray-700 font-bold mb-2">
          Term (in weeks)
        </label>
        <input
          type="number"
          id="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={createLoan}
      >
        Create Loan
      </button>
      {loans && loans.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {loans.map((loan) => (
      <div key={loan.id} className="p-4 border rounded shadow-md">
        <p>
          <strong>Amount:</strong> {loan.amount}
        </p>
        <p>
          <strong>Term:</strong> {loan.term}
        </p>
        <p>
          <strong>Status:</strong> {loan.status}
        </p>
        <h2 className="text-lg font-bold mb-2">Repayment Schedule</h2>
        {loan.repaymentSchedule ? (
          <ul>
            {loan.repaymentSchedule.map((repayment, index) => (
              <li key={index}>
                <strong>Due Date:</strong> {repayment.dueDate ? new Date(repayment.dueDate.seconds * 1000).toDateString() : 'N/A'} |{' '}
                <strong>Amount:</strong> {repayment.amount} |{' '}
                <strong>Status:</strong> {repayment.state}
              </li>
            ))}
          </ul>
        ) : (
          <p>No repayment schedule available.</p>
        )}
      </div>
    ))}
  </div>
) : (
  <p className="mt-4">You don't have any loans yet.</p>
)}

      <div className="mt-4">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LoanDashboard;
