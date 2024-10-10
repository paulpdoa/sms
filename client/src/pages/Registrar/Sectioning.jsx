import { useFetch } from '../../hooks/useFetch';
import { baseUrl } from '../../baseUrl';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TabActions from '../../components/TabActions';
import MasterTable from "../../components/MasterTable";
import { useNavigate } from 'react-router-dom';
import { MainContext } from "../../helpers/MainContext";
import MasterDataForm from "../../components/MasterDataForm";
import { useSnackbar } from 'notistack';
import Filter from '../../components/Filter';

const Sectioning = () => {
    const columns = [
        { accessorKey: 'fullName', header: 'Full Name' },
        { accessorKey: 'studentNo', header: 'Student No' },
        { accessorKey: 'gradeLevel', header: 'Grade Level' },
        { accessorKey: 'assessed', header: 'Assessed' },
        { accessorKey: 'dateAssessed', header: 'Date Assessed' },
        { accessorKey: 'strand', header: 'Strand' },
        { accessorKey: 'section', header: 'Section' },
        { accessorKey: 'adviser', header: 'Adviser' }
    ];

    const navigate = useNavigate();
    const { searchQuery, showForm, currentUserId, setShowForm, session: currentSession, role,dateFormatter } = useContext(MainContext);
    const { records: students } = useFetch(`${baseUrl()}/students`);
    const { records: sections } = useFetch(`${baseUrl()}/sections`);
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${currentSession}`);
    const isYearDone = schoolYear.isYearDone;
    const [sectionId, setSectionId] = useState('');
    const [adviser, setAdviser] = useState('');
    const [studentRecord, setStudentRecord] = useState(null);
    const withStrands = [11, 12];

    const [filter,setFilter] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (studentRecord) {
            setSectionId(studentRecord?.academicId?.sectionId?._id);
        }
    }, [studentRecord]);

    const filteredSections = sections.filter(section => section.gradeLevel?.gradeLevel === studentRecord?.academicId?.gradeLevelId?.gradeLevel);

    const handleSectionChange = (e) => {
        setSectionId(e.target.value);
    }

    const studentLists = students?.filter(student => {

        const section = student?.academicId?.sectionId;

        if(filter === 'With Section') {
            return section
        }

        if(filter === 'Without Section') {
            return !section
        }

        return student?.academicId?.isAdmitted && student?.academicId?.isRegistered && student?.academicId.isEnrolled
    }).map(student => ({
        ...student,
        fullName: `${student.lastName}, ${student.firstName} ${student.middleName}`,
        gradeLevel: student?.academicId?.gradeLevelId?.gradeLevel || 'Not Assigned',
        assessed: student?.academicId?.isAssessed ? 'Yes' : 'No',
        dateAssessed: new Date(student?.academicId?.dateAssessed).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric' 
        }),
        strand: (student?.academicId?.gradeLevelId?.gradeLevel.includes('11') || student?.academicId?.gradeLevelId?.gradeLevel.includes('12')) ? student?.academicId?.strandId?.strand : 'Not applicable',
        section: student?.academicId?.sectionId?.section || 'Not Assigned',
        adviser: student?.academicId?.sectionId?.adviser ? `${student?.academicId?.sectionId?.adviser?.firstName} ${student?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned'
    })).sort((a, b) => a.lastName.localeCompare(b.lastName));

    const submitSectioning = async (e) => {
        e.preventDefault();

        const sectioningInfo = {
            sessionId: currentSession,
            studentId: studentRecord._id,
            sectionId: sectionId,
            inputter: currentUserId,
            gradeLevelId: studentRecord?.academicId?.gradeLevelId?._id,
            strandId: studentRecord?.academicId?.strandId?._id,
            lastSchoolAttended: studentRecord?.academicId?.lastSchoolAttended,
            role,
            session: currentSession
        }

        try {
            const data = await axios.post(`${baseUrl()}/sectioning`, sectioningInfo);
            enqueueSnackbar(data.data.mssg, {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 2000,
                preventDuplicate: true,
                onClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.log(err);
            enqueueSnackbar(err.response.data.mssg || 'An error occurred while submitting sectioning for students', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                autoHideDuration: 3000,
                preventDuplicate: true
            });
        }
    }

    const form = () => {
        const gradeLevel = studentRecord?.academicId?.gradeLevelId?.gradeLevel;
        console.log("Grade Level:", gradeLevel);
        const showStrandField = gradeLevel?.includes('11') || gradeLevel?.includes('12');
        return (
            <>
                <h1 className="font-semibold text-xl text-gray-700">{`${studentRecord?.firstName} ${studentRecord?.lastName}'s Section`}</h1>
                <div className="grid grid-cols-2 gap-5 mt-4">
                    {renderStudentInfo('student name', `${studentRecord?.firstName} ${studentRecord?.middleName} ${studentRecord?.lastName}`, 'Student Name:')}
                    {renderStudentInfo('grade level', `${studentRecord?.academicId?.gradeLevelId ? studentRecord?.academicId?.gradeLevelId?.gradeLevel : 'Not Assigned'} `, 'Grade Level')}
                    {showStrandField && renderStudentInfo('strand', studentRecord?.academicId?.strandId?.strand, 'Strand:')}
                    {renderStudentInfo('section', studentRecord?.academicId?.sectionId?.section, 'Section:', filteredSections, handleSectionChange)}
                    {renderStudentInfo('adviser', studentRecord?.academicId?.sectionId?.adviser ? `${studentRecord?.academicId?.sectionId?.adviser?.firstName} ${studentRecord?.academicId?.sectionId?.adviser?.lastName}` : 'Not Assigned', 'Adviser')}
                </div>
            </>
        );
    }

    return (
        <main className="p-2 relative">
            <div className="flex items-center">
                <TabActions title="Sectionings" noView={true} />
                <Filter title="option" options={['With Section', 'Without Section']} onChange={setFilter} />
            </div>
            <div className={`gap-2`}>
                {showForm &&
                    (
                        studentRecord ?
                            MasterDataForm(form, submitSectioning, setShowForm)
                            :
                            studentLists?.length < 1 ? (
                                <div className="mt-3 p-6 bg-white shadow-md rounded-md h-fit">
                                    <h1 className="text-red-500 text-sm font-semibold">
                                        No student records yet
                                    </h1>
                                </div>
                            ) : (
                                <div className="mt-3 p-6 bg-white shadow-md rounded-md h-fit">
                                    <h1 className="text-red-500 text-sm font-semibold">
                                        Please select view on table to give section to students
                                    </h1>
                                </div>
                            )
                    )
                }
                <div className="relative overflow-x-auto mt-5 sm:rounded-lg">
                    <MasterTable
                        data={studentLists}
                        columns={columns}
                        searchQuery={searchQuery}
                        viewRecord={setStudentRecord}
                        onShow={setShowForm}
                    />
                </div>
            </div>
        </main>
    )
}

export default Sectioning;

const renderStudentInfo = (label, value, placeholder, options, onChange) => (
    <div className="flex flex-col">
        <label className="text-sm mb-1 font-semibold text-gray-700" htmlFor={label}>{placeholder}</label>
        {label === 'section' ?
            <select className="text-sm p-2 outline-none rounded-md border border-gray-200" onChange={onChange}>
                <option hidden>{value ? value : 'Select Section'}</option>
                {options.map(section => (
                    <option key={section._id} value={section._id}>{section.section}</option>
                ))}
            </select>
            : <span className="text-sm">{value}</span>
        }
    </div>
)
