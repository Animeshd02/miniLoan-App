import { useState, useEffect } from 'react';
import { auth, firestore } from '../Firebase/firebase';
import { useRouter } from 'next/router';

import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

function LoanApplications() {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const user = auth.currentUser;

        if (user && user.email === 'admin@gmail.com') {
          console.log('Admin user identified:', user.email);

          const loansRef = collection(firestore, 'loans');
          const loansQuery = query(loansRef, where('status', 'in', ['PENDING', 'APPROVED']));
          const querySnapshot = await getDocs(loansQuery);

          console.log('Query Snapshot:', querySnapshot);

          if (!querySnapshot.empty) {
            const fetchedLoans = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              console.log('Raw Data:', data);

              // Convert timestamp to Date object
              const createdAt = data.createdAt.toDate();

              // Handle repayment schedule, ensuring dueDate exists
              const repaymentSchedule = data.repaymentSchedule.map((repayment) => ({
                ...repayment,
                dueDate: repayment.dueDate ? repayment.dueDate.toDate() : null,
              }));

              return {
                id: doc.id,
                amount: data.amount,
                term: data.term,
                status: data.status,
                userId: data.userId,
                createdAt,
                repaymentSchedule,
              };
            });

            console.log('Fetched loans:', fetchedLoans);

            // Split loans into pending and approved
            const pending = fetchedLoans.filter((loan) => loan.status === 'PENDING');
            const approved = fetchedLoans.filter((loan) => loan.status === 'APPROVED');

            setPendingLoans(pending);
            setApprovedLoans(approved);
          } else {
            console.log('Query snapshot is empty.');
          }
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };

    fetchLoans();
  }, []);

  const handleApproveLoan = async (loanId) => {
    try {
      // Update the status of the loan to 'APPROVED' in Firestore
      await updateDoc(doc(firestore, 'loans', loanId), {
        status: 'APPROVED',
      });

      // Update the state to reflect the change
      setPendingLoans((prevLoans) => prevLoans.filter((loan) => loan.id !== loanId));
      setApprovedLoans((prevLoans) => [
        ...prevLoans,
        pendingLoans.find((loan) => loan.id === loanId),
      ]);
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const handlePayEMI = async (loanId, repaymentIndex) => {
    try {
      // Update the state of the repayment to 'PAID' in Firestore
      const updatedRepaymentSchedule = approvedLoans
        .find((loan) => loan.id === loanId)
        .repaymentSchedule.map((repayment, index) =>
          index === repaymentIndex ? { ...repayment, state: 'PAID' } : repayment
        );

      await updateDoc(doc(firestore, 'loans', loanId), {
        repaymentSchedule: updatedRepaymentSchedule,
      });

      // Update the state to reflect the change
      setApprovedLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.id === loanId ? { ...loan, repaymentSchedule: updatedRepaymentSchedule } : loan
        )
      );
    } catch (error) {
      console.error('Error paying EMI:', error);
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
      <h1 className="text-3xl font-bold mb-4">mini-LoanApp - Loan Applications</h1>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div>
        <h2 className="text-xl font-bold mb-2">Pending Loans</h2>
        {pendingLoans.map((loan) => (
          <div key={loan.id} className="p-4 border rounded shadow-md mb-4">
            <p>
              <strong>Amount:</strong> ${loan.amount} | <strong>Status:</strong> {loan.status} | <strong>User ID:</strong> {loan.userId}
            </p>
            <h3 className="text-lg font-bold mt-2 mb-2">Repayment Schedule</h3>
            {loan.repaymentSchedule.map((repayment, index) => (
              <div key={index} className="mb-2">
                <strong>Due Date:</strong>{' '}
                {repayment.dueDate ? repayment.dueDate.toDateString() : 'Not specified'} |{' '}
                <strong>Amount:</strong> ${repayment.amount.toFixed(2)} |{' '}
                <strong>Status:</strong> {repayment.state}
              </div>
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
              onClick={() => handleApproveLoan(loan.id)}
            >
              Approve Loan
            </button>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Approved Loans</h2>
        {approvedLoans.map((loan) => (
          <div key={loan.id} className="p-4 border rounded shadow-md mb-4">
            <p>
              <strong>Amount:</strong> ${loan.amount} | <strong>Status:</strong> {loan.status} | <strong>User ID:</strong> {loan.userId}
            </p>
            <h3 className="text-lg font-bold mt-2 mb-2">Repayment Schedule</h3>
            {loan.repaymentSchedule.map((repayment, index) => (
              <div key={index} className="mb-2">
                <strong>Due Date:</strong>{' '}
                {repayment.dueDate ? repayment.dueDate.toDateString() : 'Not specified'} |{' '}
                <strong>Amount:</strong> ${repayment.amount.toFixed(2)} |{' '}
                <strong>Status:</strong> {repayment.state} |{' '}
                {repayment.state === 'PENDING' && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handlePayEMI(loan.id, index)}
                  >
                    Pay EMI
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoanApplications;
