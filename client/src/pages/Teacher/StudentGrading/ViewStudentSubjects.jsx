import MasterTable from '../../../components/MasterTable';

const ViewStudentSubjects = ({ role,student,setStudent,setShowStudentSubject,setCurrentTabSubject,subjectOfTeachers,academicPeriods,studentGrades,currentAcademicPeriod,renderedSubjects,currentTabSubject,getStudentGrades,studentId,subjectId,setCurrentAcademicPeriod,gradeColumns,studentGradeData,searchQuery,viewEditStudentGrade,isYearDone,setShowForm,studentSubjects }) => {
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-100 p-5 rounded-md w-[95%] max-h-[95vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-2xl text-gray-700">Subjects taken by {student.firstName} {student.lastName}</h1>
                    <button onClick={() => {
                        setStudent({});
                        setShowStudentSubject(false);
                        setCurrentTabSubject('');
                    }} className="text-red-500 text-sm hover:text-red-600 cursor-pointer">Close</button>
                </div>

                <div className="flex gap-2 items-center mt-3">
                    {role === 'Teacher' ? 
                        subjectOfTeachers?.filter(studentSubj => studentSubj.studentId.academicId?.isRegistered && studentSubj.studentId.academicId?.isAdmitted && studentSubj.studentId.academicId.gradeLevelId && studentSubj.studentId.academicId.sectionId)
                        .filter(studentSubj => {
                            const subjectKey = `${studentSubj.subjectId.subjectName} - ${studentSubj.subjectId.subjectCode}`;
                            if (renderedSubjects.has(subjectKey)) return false;
                            renderedSubjects.add(subjectKey);
                            return true;
                        })
                        .map(studentSubj => (
                            <button
                                onClick={() => getStudentGrades(studentSubj)} 
                                className={`${currentTabSubject === `${studentSubj.subjectId.subjectName} - ${studentSubj.subjectId.subjectCode}` ? 'bg-gray-700 text-gray-300 hover:bg-gray-800' : 'bg-none text-gray-800 hover:bg-gray-700 hover:text-gray-300'} text-sm transition font-semibold p-2 rounded-md border border-gray-400`} 
                                key={studentSubj._id}>
                                {studentSubj.subjectId.subjectName} - {studentSubj.subjectId.subjectCode}
                            </button>
                        )) : (
                        studentSubjects?.filter(studSubj => student._id === studSubj.studentId._id).map(student => (
                            <button
                                onClick={() => getStudentGrades(student)} 
                                className={`${currentTabSubject === `${student.subjectId.subjectName} - ${student.subjectId.subjectCode}` ? 'bg-gray-700 text-gray-300 hover:bg-gray-800' : 'bg-none text-gray-800 hover:bg-gray-700 hover:text-gray-300'} text-sm transition font-semibold p-2 rounded-md border border-gray-400`} 
                                key={student._id}>
                                {student.subjectId.subjectName} - {student.subjectId.subjectCode}
                            </button>
                        ))
                    )}
                </div>

                <div>
                    {!currentTabSubject ? (
                        <p className="text-red-500 font-semibold text-sm mt-1 p-2">Please select a subject to view student grades</p>
                    ) : (
                    <div className="overflow-y-auto max-h-[calc(95vh-10rem)] min-h-min">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                            {academicPeriods.map(academicPeriod => (
                                <button 
                                    key={academicPeriod.academicPeriod}
                                    onClick={() => setCurrentAcademicPeriod(academicPeriod.academicPeriod)} 
                                    className={`text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out 
                                                ${currentAcademicPeriod === academicPeriod.academicPeriod 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500'}`}
                                >
                                    {academicPeriod.academicPeriod}
                                </button>
                            ))}
                        </div>
                        {studentGrades?.filter(student => student.studentId._id === studentId && student.subjectId._id === subjectId && student.academicPeriod === currentAcademicPeriod).length > 0 
                            ? (
                                <div className="mt-4">
                                    <MasterTable 
                                        columns={gradeColumns}
                                        data={studentGradeData}
                                        searchQuery={searchQuery}
                                        viewRecord={viewEditStudentGrade}
                                    />
                                </div>
                            ) : (
                                <div className="col-span-full text-center text-red-500 mt-4">
                                    <p className="text-sm font-semibold">This student doesn't have any grades for the selected subject and academic period.</p>
                                </div>
                            )}
                        
                    </div>
                    
                    )}
                </div>
                {currentAcademicPeriod && (
                    <div className="flex justify-end">
                        <button onClick={() => {
                            if(!isYearDone && role === 'Teacher') {
                                setShowForm(true);
                                setShowStudentSubject(false);
                            } else {
                                enqueueSnackbar('Your current role is not allowed to perform this action', {
                                    variant: 'error',
                                    anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'center',
                                    },
                                    autoHideDuration: 3000,
                                    preventDuplicate: true
                                });
                            }
                        }} className={`${role !== 'Teacher' ? 'cursor-not-allowed' : 'cursor-pointer'} text-sm bg-blue-500 hover:bg-blue-600 p-2 rounded-md text-gray-100 mt-3`}>
                            Add New Student Grades
                        </button>
                    </div>
                )}
        </div>
    </div>

    )
}

export default ViewStudentSubjects;