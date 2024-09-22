import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';

const StatementOfAccountForm = ({ currentStudent,studentPayments }) => {

    const { dateFormatter,numberFormatter } = useContext(MainContext);

    const miscData = studentPayments?.filter(studentPayment => studentPayment?.manageFeeId?.feeDescription?.feeCateg?.code === 'MSC');
    const tuitionData = studentPayments?.filter(studentPayment => studentPayment.paymentScheduleId);
    const textbookData = studentPayments?.filter(studentPayment => studentPayment.textBookId);

    const totalTuitionFee = tuitionData?.filter(payment => !payment.isPaid).reduce((total,payment) => total + payment.payEveryAmount,0);
    const totalTextbookFee = textbookData.filter(payment => !payment.isPaid).reduce((total,payment) => total + payment.textBookId.bookAmount,0);
    const totalMiscFee = miscData.filter(payment => !payment.isPaid).reduce((total,payment) => total + payment.manageFeeId.amount,0);

    return (
        <div className="p-6 bg-gray-200 h-full mt-5" id="student-payments-content">
            <section>
                <div className="py-4 flex items-center gap-2 border-b border-gray-400">
                    <p className="text-gray-800 text-md font-semibold">{ currentStudent.firstName } { currentStudent.middleName } { currentStudent.lastName }</p>
                    <p className="text-gray-800 text-md font-semibold">{currentStudent.studentNo}</p>
                    <p className="text-gray-800 text-md font-semibold">{currentStudent.academicId.gradeLevelId.gradeLevel}</p>
                    <p className="text-gray-800 text-md font-semibold">{currentStudent.academicId.sectionId.section}</p>
                    {/* <p className="rounded-full bg-blue-500 text-gray-100 p-2 text-sm">SY {currentStudent?.academicId?.sessionId?.startYear.split('-')[0]} - { currentStudent?.academicId?.sessionId?.endYear.split('-')[0] }</p> */}
                </div>
                <h1 className="text-gray-800 text-2xl font-bold mt-4">Statement Of Account</h1>
                <span className="text-gray-500 text-sm">Generated on {dateFormatter(new Date())}</span>
            </section>
            
            <section className="flex flex-col gap-5">
                <div>
                    <div>
                        <h1 className="text-xl font-semibold">Tuition Fee</h1>
                        <span className="text-sm text-gray-600">Total: {numberFormatter(totalTuitionFee)}</span>
                    </div>
                    
                    <div className="p-2 bg-gray-100">
                        { tuitionData.map(tuition => (
                            <div className="grid grid-cols-3 indent-5 p-2">
                                <p className="text-sm">{dateFormatter(tuition.paymentScheduleId.dateSchedule)}</p>
                                <p className="text-sm">{numberFormatter(tuition.payEveryAmount)}</p>
                                <p className={`text-sm ${tuition.isPaid ? 'text-green-700' : 'text-red-700'}`}>{ tuition.isPaid ? 'Paid' : 'Not yet paid' }</p>
                            </div>
                        )) }
                    </div>
                
                </div>

                <div>
                    <div>
                        <h1 className="text-xl font-semibold">Miscellaneous Fee</h1>
                        <span className="text-sm text-gray-600">Total: {numberFormatter(totalMiscFee)}</span>
                    </div>
                    <div className="p-2 bg-gray-100">
                        { miscData.map(misc => (
                            <div className="grid grid-cols-3 indent-5 p-2">
                                <p className="text-sm">{misc.manageFeeId.feeDescription.description}</p>
                                <p className="text-sm">{numberFormatter(misc.manageFeeId.amount)}</p>
                                <p className={`text-sm ${misc.isPaid ? 'text-green-700' : 'text-red-700'}`}>{ misc.isPaid ? 'Paid' : 'Not yet paid' }</p>
                            </div>
                        )) }
                    </div>
                </div>

                <div>
                    <div>
                        <h1 className="text-xl font-semibold">Textbook Fee</h1>
                        <span className="text-sm text-gray-600">Total: {numberFormatter(totalTextbookFee)}</span>
                    </div>
                    <div className="p-2 bg-gray-100">
                        { textbookData.map(textbook => (
                            <div className="grid grid-cols-3 indent-5 p-2">
                                <p className="text-sm">{textbook.textBookId.bookTitle} {textbook.textBookId.bookCode}</p>
                                <p className="text-sm">{numberFormatter(textbook.textBookId.bookAmount)}</p>
                                <p className={`text-sm ${textbook.isPaid ? 'text-green-700' : 'text-red-700'}`}>{ textbook.isPaid ? 'Paid' : 'Not yet paid' }</p>
                            </div>
                        )) }
                    </div>
                </div>

                <h2 className="font-semibold text-lg text-gray-900">Total amount to be paid: Php {numberFormatter(totalTuitionFee + totalTextbookFee + totalMiscFee)}</h2>
            </section>
        </div>
    )
}

export default StatementOfAccountForm;