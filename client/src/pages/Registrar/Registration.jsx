import StudentInfoTable from "../../components/admission/info/StudentInfoTable";
import StudentInfo from "../../components/admission/info/StudentInfo";
import { useContext } from 'react';
import { MainContext } from '../../helpers/MainContext';
import TabActions from "../../components/TabActions";

const Registration = () => {
    const { searchQuery, currStudRec, setCurrStudRec } = useContext(MainContext);

    const enableViewStudentRecord = (record) => {
        setCurrStudRec(record);
        setEnableView(true);
    }

    return (
        <main className="p-4 relative">
            <TabActions title='Registration' noView={true} />
            <StudentInfoTable searchQuery={searchQuery} setViewRecord={enableViewStudentRecord} />

            {currStudRec?._id && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

                    {/* Full-Screen Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white w-full h-full md:w-3/4 md:h-auto p-4 rounded-lg border border-gray-300 shadow-lg overflow-y-auto">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="font-semibold text-2xl text-gray-700">
                                    {currStudRec ? `${currStudRec.firstName} ${currStudRec.lastName}'s` : 'Student'}
                                </h1>
                                <button onClick={() => {
                                    setCurrStudRec(null);
                                    setEnableView(false);
                                }} className="bg-red-500 text-sm hover:bg-red-600 p-2 text-white rounded-md transition">Cancel</button>
                            </div>

                            {currStudRec?._id ? (
                                <StudentInfo id={currStudRec._id} />
                            ) : (
                                <p className="text-sm text-red-500">Please select a student from the list to view details.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}

export default Registration;
