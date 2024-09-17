const ViewStudentGrades = ({ setGradeRemark,setCurrentAcademicPeriod,student,updateStudentGrade,studentId,students,subjectId,studentSubjects,gradingCategoryId,gradingCategories,academicPeriod,academicPeriods,dateTaken,dueDate,studentScore,taskTotal,passingScore,remarks,setShowStudentGrades,setShowStudentSubject,setStudentScore,setTaskTotal,setDateTaken,setDueDate,setPassingScore,setRemarks }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-100 p-5 rounded-md w-auto">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-2xl text-gray-700">Grades of {student.firstName} {student.lastName}</h1>
                    <button onClick={() => {
                        setShowStudentGrades(false);
                        setShowStudentSubject(true);
                        setCurrentAcademicPeriod('');
                        setPassingScore('');
                        setStudentScore('')
                    }} className="text-red-500 text-sm hover:text-red-600 cursor-pointer">Close</button>
                </div>

                {/* Updating students grade here */}
                <form onSubmit={updateStudentGrade} className="mt-4">
                    <h1 className="font-semibold text-xl text-gray-700">Update Student Grade</h1>

                    <div className="grid grid-cols-3 gap-5">
                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="student">Student:</label>
                            <select 
                                className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                                onChange={(e) => setStudentId(e.target.value)}
                                value={studentId}
                                disabled
                            >
                                <option className="text-sm" value='' hidden>Select Student</option>
                                { students.length > 0 ? (
                                    students?.filter(student => student.academicId?.isRegistered && student?.academicId?.isAdmitted && student?.academicId?.gradeLevelId).map(student => (
                                        <option key={student._id} className="text-sm" value={student._id}>{student.firstName} {student.lastName}</option>
                                    ))
                                ) : (
                                    <Link className="text-sm" to='/students'>Add Student</Link>
                                ) }
                                <option className="text-sm" value="">Leave as blank</option>
                            </select>
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="subject">Subject:</label>
                            { studentId ? (
                                <select 
                                    className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                                    onChange={(e) => setSubjectId(e.target.value)}
                                    value={subjectId}
                                    disabled
                                >   
                                    <option className="text-sm" value='' hidden>Select Subject</option>
                                    { studentSubjects?.filter(studentSubject => studentSubject.studentId._id === studentId).map(studentSubject => (
                                            <option key={studentSubject._id} value={studentSubject.subjectId._id}>{studentSubject.subjectId.subjectName} - {studentSubject.subjectId.subjectCode}</option>
                                    )) }
                                </select>
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="grading category">Grading Category:</label>
                            { studentId ? (
                                <select 
                                    className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                                    onChange={(e) => setGradingCategoryId(e.target.value)}
                                    value={gradingCategoryId}
                                    disabled
                                >   
                                    <option className="text-sm" value='' hidden>Select Grading Category</option>
                                    { gradingCategories.map(gradingCategory => (
                                            <option key={gradingCategory._id} value={gradingCategory._id}>{gradingCategory.gradingCategory}</option>
                                    )) }
                                </select>
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="academic period">Academic Period:</label>
                            { studentId ? (
                                <select
                                    className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                                    onChange={(e) => setAcademicPeriod(e.target.value)}
                                    value={academicPeriod}
                                    disabled
                                >   
                                    <option className="text-sm" value='' hidden>Select Academic Period</option>
                                    { academicPeriods.map(academicPeriod => (
                                        <option key={academicPeriod.id} value={academicPeriod.academicPeriod}>{academicPeriod.academicPeriod}</option>
                                    )) }
                                </select>
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="date taken">Date Taken:</label>
                            { studentId ? (
                                <input
                                className="outline-none p-1 text-sm rounded-md border border-gray-300"
                                type="date" onChange={(e) => setDateTaken(e.target.value)} value={dateTaken} />
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="due date">Due Date:</label>
                            { studentId ? (
                                <input
                                className="outline-none p-1 text-sm rounded-md border border-gray-300"
                                type="date" onChange={(e) => setDueDate(e.target.value)} value={dueDate} />
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="student score">Student Score:</label>
                            { studentId ? (
                                <input
                                className="outline-none p-1 text-sm rounded-md border border-gray-300"
                                type="number" onChange={(e) => setStudentScore( e.target.value)} value={studentScore} />
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="task total">Task Total:</label>
                            { studentId ? (
                                <input
                                className="outline-none p-1 text-sm rounded-md border border-gray-300"
                                type="number" onChange={(e) => setTaskTotal(e.target.value)} value={taskTotal} />
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="passing score">Passing Score:</label>
                            { studentId ? (
                                <input
                                className="outline-none p-1 text-sm rounded-md border border-gray-300"
                                type="number" onChange={(e) => setPassingScore(e.target.value)} value={passingScore}/>
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="grade-remarks">Grade Remarks:</label>
                            {studentId ? (
                                <select
                                    className="outline-none disabled:font-semibold cursor-not-allowed p-1 text-sm rounded-md border border-gray-300"
                                    onChange={(e) => setGradeRemark(e.target.value)}
                                    disabled
                                >   
                                    {/* Display a hidden option if studentScore or passingScore is not set */}
                                    {(studentScore === '' || studentScore === undefined || passingScore === '' || passingScore === undefined) && (
                                        <option className="text-sm" value='' hidden>Select Grade Remark</option>
                                    )}

                                    {/* Set the remarks depending on the student's score */}
                                    {studentScore !== '' && studentScore !== undefined && passingScore !== '' && passingScore !== undefined ? (
                                        studentScore < passingScore ? (
                                            <option value="Failed">Failed</option>
                                        ) : (
                                            <option value="Passed">Passed</option>
                                        )
                                    ) : null}
                                </select>
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col mt-1">
                            <label className="text-sm" htmlFor="remarks">Remarks:</label>
                            { studentId ? (
                                <input
                                className="outline-none p-1 text-sm rounded-md border border-gray-300"
                                type="text" onChange={(e) => setRemarks(e.target.value)} value={remarks} />
                            ) : (
                                <div className="outline-none bg-gray-200 cursor-not-allowed p-1 text-sm rounded-md border border-gray-300">
                                    Please select student first
                                </div>
                            ) }
                        </div>
                    </div>

                    <button
                        className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-sm text-gray-100 mt-2"
                    >
                        Update Grade
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ViewStudentGrades