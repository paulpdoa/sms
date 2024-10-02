import { useFetch } from "../../hooks/useFetch";
import { baseUrl } from "../../baseUrl";
import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import { FaDollarSign, FaUsers, FaListAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import MasterTable from "../../components/MasterTable";

const FinanceDashboard = () => {

    const { currentUserId,searchQuery,dateFormatter } = useContext(MainContext);

    const { records } = useFetch(`${baseUrl()}/finance-dashboard/${currentUserId}`);

    // For payment transactions
    const paymentTransactionColumn = [
        { accessorKey: 'description', header: 'Description' },
        { accessorKey: 'referenceCode', header: 'Reference Code' },
        { accessorKey: 'amountPaid', header: 'Amount Paid' },
        { accessorKey: 'paymentDate', header: 'Payment Date' }
    ]

    const paymentTransactionData = records?.paymentTransactions?.map(payment => ({
        ...payment,
        paymentDate: dateFormatter(payment.createdAt),
        description: 
        payment.studentPaymentId?.manageFeeId?.feeDescription?.feeCateg?.category || 
        payment.studentPaymentId?.textBookId?.bookTitle ||
        dateFormatter(payment?.studentPaymentId?.paymentScheduleId?.dateSchedule) + ' - Tuition Fee',
    }));

    return (
        <main className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
            {/* Dashboard Header */}
            <header className="w-full bg-white shadow-md py-6 px-8 flex justify-between items-center rounded-lg mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {records?.financeName}!</h1>
            </header>

            {/* Dashboard Content */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fee Collection Summary */}
                <section className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-between w-full mb-4">
                        <h2 className="text-xl font-semibold">Fee Collection Summary</h2>
                        <FaDollarSign className="text-green-500 text-2xl" />
                    </div>
                    <div className="w-full flex justify-around">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Total Collected</p>
                            <p className="text-2xl font-bold text-green-500">${records?.totalCollected || 0}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Outstanding Payments</p>
                            <p className="text-2xl font-bold text-red-500">${records?.totalOutstanding || 0}</p>
                        </div>
                    </div>
                </section>

                {/* Recent Transactions */}
                <section className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Transactions</h2>
                        <FaMoneyBillWave className="text-blue-500 text-2xl" />
                    </div>
                    <MasterTable 
                        searchQuery={searchQuery}
                        data={paymentTransactionData || []}
                        columns={paymentTransactionColumn}
                        disableAction={true}
                        disableCountList={true}
                    />
                </section>

                {/* Outstanding Payments */}
                <section className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Outstanding Payments</h2>
                        <FaUsers className="text-red-500 text-2xl" />
                    </div>
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border-b text-left text-gray-700">Student</th>
                                <th className="px-4 py-2 border-b text-left text-gray-700">Outstanding Amount</th>
                                <th className="px-4 py-2 border-b text-left text-gray-700">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.outstandingPayments?.map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 border-b">{payment.studentName}</td>
                                    <td className="px-4 py-2 border-b">${payment.outstandingAmount}</td>
                                    <td className="px-4 py-2 border-b">{new Date(payment.dueDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Fee Categories */}
                <section className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Fee Categories</h2>
                        <FaListAlt className="text-yellow-500 text-2xl" />
                    </div>
                    <ul className="list-disc pl-6 text-gray-700">
                        {records?.feeCategories?.map(category => (
                            <li key={category.id} className="mb-2">
                                {category.name} - <span className="font-semibold">${category.amount}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}

export default FinanceDashboard;
