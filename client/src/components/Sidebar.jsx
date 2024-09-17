import { useState, useContext } from 'react';
import { AiFillDashboard } from "react-icons/ai";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaCashRegister, FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowUp, MdClose } from "react-icons/md";
import { MainContext } from "../helpers/MainContext"; 
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { MdCoPresent } from "react-icons/md";
import { MdGrade } from "react-icons/md";

const initialMenus = [
    {
        role: 'Super Admin',
        menus: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
                link: '/master/dashboard'
            },
            {
                name: 'Master Data',
                icon: <RiAccountPinBoxFill />,
                subMenus: [
                    { name: 'Religion', link: '/master/religion' },
                    { name: 'Nationality', link: '/master/nationality' },
                    { name: 'Departments', link: '/master/departments' },
                    { name: 'Sections', link: '/master/sections' },
                    // { name: 'Students', link: '/master/students' },
                    // { name: 'Teachers', link: '/master/teachers' },
                    // { name: 'Finance', link: '/master/finance' },
                    // { name: 'Parents', link: '/master/parents' },
                    // { name: 'Siblings', link: '/master/siblings' },
                    { name: 'Grade Level', link: '/master/grade-levels' },
                    { name: 'Requirements', link: '/master/requirements' },
                    { name: 'User Roles', link: '/master/user-roles' },
                    { name: 'School Year', link: '/master/school-year' },
                    { name: 'Users', link: '/master/users' },
                    { name: 'Strands', link: '/master/strands' },
                    { name: 'Textbooks', link: '/master/text-books' },
                    { name: 'Payment Terms', link: '/master/payment-terms' },
                    { name: 'Payment Schedule', link: '/master/payment-schedule' },
                    { name: 'Fee Category', link: '/master/fee-category' },
                    { name: 'Fee Code', link: '/master/fee-code' },
                    { name: 'Manage Fees', link: '/master/manage-fees' },
                    { name: 'Discount', link: '/master/discount' },
                    { name: 'Subject', link: '/master/subjects' },
                    { name: 'Room Number', link: '/master/room-number' },
                    { name: 'Grading Category', link: '/master/grading-category' },
                ]
            },
            {
                name: 'School Admin',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Teachers', link: '/master/teachers' },
                    { name: 'Students', link: '/master/students' },
                    { name: 'Finance', link:'/master/finance' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/master/admission' },
                            { name: 'Registration', link: '/master/registration' },
                            { name: 'Assessment', link: '/master/assessment' },
                            { name: 'Sectioning', link: '/master/sectioning' },
                            { name: 'Subject Assigning', link: '/master/subject-assigning' }
                        ]
                    }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/master/students' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
                    { name: 'Teachers subject', link: '/master/teachers-subject' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/master/admission' },
                            { name: 'Registration', link: '/master/registration' },
                            { name: 'Assessment', link: '/master/assessment' },
                            { name: 'Sectioning', link: '/master/sectioning' },
                            { name: 'Subject Assigning', link: '/master/subject-assigning' }
                        ]
                    }
                ]
            },
            {
                name: 'Teacher',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Student Grading', link: '/master/student-grading' },
                    // {
                    //     name: 'Enrollment Process',
                    //     subMenus: [
                    //         { name: 'Admission', link: '/admission' },
                    //         { name: 'Assessment', link: '/assessment' },
                    //         { name: 'Sectioning', link: '/sectioning' },
                    //         { name: 'Subject Assigning', link: '/subject-assigning' }
                    //     ]
                    // }
                ]
            },
            // {
            //     name: 'Settings',
            //     icon: <IoSettings />,
            //     link: '/settings'
            // }
        ]
    },
    {
        role: 'School Admin',
        menus: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
                link: '/schooladmin/dashboard'
            },
            {
                name: 'Master Data',
                icon: <RiAccountPinBoxFill />,
                subMenus: [
                    { name: 'Religion', link: '/schooladmin/religion' },
                    { name: 'Nationality', link: '/schooladmin/nationality' },
                    { name: 'Departments', link: '/schooladmin/departments' },
                    { name: 'Sections', link: '/schooladmin/sections' },
                    // { name: 'Students', link: '/schooladmin/students' },
                    // { name: 'Teachers', link: '/schooladmin/teachers' },
                    // { name: 'Finance', link: '/schooladmin/finance' },
                    // { name: 'Parents', link: '/schooladmin/parents' },
                    // { name: 'Siblings', link: '/schooladmin/siblings' },
                    { name: 'Grade Level', link: '/schooladmin/grade-levels' },
                    { name: 'Requirements', link: '/schooladmin/requirements' },
                    { name: 'User Roles', link: '/schooladmin/user-roles' },
                    { name: 'School Year', link: '/schooladmin/school-year' },
                    { name: 'Users', link: '/schooladmin/users' },
                    { name: 'Strands', link: '/schooladmin/strands' },
                    { name: 'Textbooks', link: '/schooladmin/text-books' },
                    { name: 'Payment Terms', link: '/schooladmin/payment-terms' },
                    { name: 'Payment Schedule', link: '/schooladmin/payment-schedule' },
                    { name: 'Fee Category', link: '/schooladmin/fee-category' },
                    { name: 'Fee Code', link: '/schooladmin/fee-code' },
                    { name: 'Manage Fees', link: '/schooladmin/manage-fees' },
                    { name: 'Discount', link: '/schooladmin/discount' },
                    { name: 'Subject', link: '/schooladmin/subjects' },
                    { name: 'Room Number', link: '/schooladmin/room-number' },
                    { name: 'Grading Category', link: '/schooladmin/grading-category' },
                ]
            },
            {
                name: 'School Admin',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Teachers', link: '/schooladmin/teachers' },
                    { name: 'Students', link: '/schooladmin/students' },
                    { name: 'Finance', link:'/schooladmin/finance' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/schooladmin/admission' },
                            { name: 'Registration', link: '/schooladmin/registration' },
                            { name: 'Assessment', link: '/schooladmin/assessment' },
                            { name: 'Sectioning', link: '/schooladmin/sectioning' },
                            { name: 'Subject Assigning', link: '/schooladmin/subject-assigning' }
                        ]
                    }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/schooladmin/students' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
                    { name: 'Teachers subject', link: '/schooladmin/teachers-subject' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/schooladmin/admission' },
                            { name: 'Registration', link: '/schooladmin/registration' },
                            { name: 'Assessment', link: '/schooladmin/assessment' },
                            { name: 'Sectioning', link: '/schooladmin/sectioning' },
                            { name: 'Subject Assigning', link: '/schooladmin/subject-assigning' }
                        ]
                    }
                ]
            },
            {
                name: 'Teacher',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Student Grading', link: '/schooladmin/student-grading' },
                ]
            },
        ]
    },
    {
        role: 'Registrar',
        menus: [
            {
                name: 'Registrar Dashboard',
                icon: <AiFillDashboard />,
                link: '/registrar/dashboard'
            },
            {
                name: 'Master Data',
                icon: <RiAccountPinBoxFill />,
                subMenus: [
                    { name: 'Religion', link: '/registrar/religion' },
                    { name: 'Nationality', link: '/registrar/nationality' },
                    { name: 'Departments', link: '/registrar/departments' },
                    { name: 'Sections', link: '/registrar/sections' },
                    // { name: 'Students', link: '/registrar/students' },
                    // { name: 'Teachers', link: '/registrar/teachers' },
                    // { name: 'Parents', link: '/registrar/parents' },
                    // { name: 'Siblings', link: '/registrar/siblings' },
                    { name: 'Grade Level', link: '/registrar/grade-levels' },
                    { name: 'Requirements', link: '/registrar/requirements' },
                    { name: 'User Roles', link: '/registrar/user-roles' },
                    { name: 'School Year', link: '/registrar/school-year' },
                    { name: 'Users', link: '/registrar/users' },
                    { name: 'Strands', link: '/registrar/strands' },
                    { name: 'Textbooks', link: '/registrar/text-books' },
                    { name: 'Payment Terms', link: '/registrar/payment-terms' },
                    { name: 'Payment Schedule', link: '/registrar/payment-schedule' },
                    { name: 'Fee Category', link: '/registrar/fee-category' },
                    { name: 'Fee Code', link: '/registrar/fee-code' },
                    { name: 'Manage Fees', link: '/registrar/manage-fees' },
                    { name: 'Discount', link: '/registrar/discount' },
                    { name: 'Subject', link: '/registrar/subjects' },
                    { name: 'Room Number', link: '/registrar/room-number' },
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/registrar/students' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
                    { name: 'Teachers subject', link: '/registrar/teachers-subject' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/registrar/admission' },
                            { name: 'Registration', link: '/registrar/registration' },
                            { name: 'Assessment', link: '/registrar/assessment' },
                            { name: 'Sectioning', link: '/registrar/sectioning' },
                            { name: 'Subject Assigning', link: '/registrar/subject-assigning' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        role: 'Teacher',
        menus: [
            {
                icon: <MdOutlineDashboardCustomize />,
                name: 'Teacher Dashboard',
                link: '/teacher/dashboard'
            },
            {
                name: 'Student Grades',
                icon: <MdGrade />,
                link: '/teacher/student-grading',
            },
            {
                name: 'Student Attendance',
                icon: <MdCoPresent />,
                link: '/teacher/student-attendance'
            }
        ]
    },
    {
        role: 'Student',
        menus: [
            {
                icon: <MdOutlineDashboardCustomize />,
                name: 'Student Dashboard',
                link: '/student/dashboard'
            },
            {
                name: 'Grades',
                icon: <MdGrade />,
                link: '/student/grades'
                // subMenus: [
                //     { name: 'Student Grading', link: '/student-grading' },
                // ]
            },
            {
                name: 'Payment Schedule',
                icon: <RiSecurePaymentLine />,
                link: '/student/payment-schedule'
            },
            {
                name: 'Attendance',
                icon: <MdCoPresent />,
                link: '/student/attendance'
                // subMenus: [
                //     { name: 'Student Grading', link: '/student-grading' },
                // ]
            }
        ]
    },
    {
        role: 'Parent',
        menus: [
            {
                icon: <MdOutlineDashboardCustomize />,
                name: 'Parent Dashboard',
                link: '/parent/dashboard'
            },
            {
                name: 'Grades',
                icon: <MdGrade />,
                link: '/parent/grades'
            },
            {
                name: 'Payment Schedule',
                icon: <RiSecurePaymentLine />,
                link: '/parent/payment-schedule'
            },
            {
                name: 'Attendance',
                icon: <MdCoPresent />,
                link: '/parent/attendance'
                // subMenus: [
                //     { name: 'Student Grading', link: '/student-grading' },
                // ]
            }
        ]
    },
    {
        role: 'Finance',
        menus: [
            {
                icon: <MdOutlineDashboardCustomize />,
                name: 'Finance Dashboard',
                link: '/finance/dashboard'
            },
            {
                name: 'Statement Of Accounts',
                icon: <RiSecurePaymentLine />,
                link: '/finance/soa'
            },
            {
                name: 'Account Payments',
                icon: <RiSecurePaymentLine />,
                link: '/finance/account-payment'
            }
        ]
    }
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { role: currentRole, currentUser, currentUserId, session: sessionId, setShowForm,isFreshYear} = useContext(MainContext);

    const navigate = useNavigate();
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${sessionId}`);
    const { records: user } = useFetch(`${baseUrl()}/user/${currentUserId}`);
    const currentSy = schoolYear 
        ? `S.Y ${schoolYear.startYear?.split('-')[0] ?? ''}-${schoolYear.endYear?.split('-')[0] ?? ''}`
        : 'Loading...';    
    const [menus] = useState(initialMenus);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);

    const userMenus = menus.find(menu => menu.role === currentRole)?.menus || [];

    const handleToggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const handleToggleSubDropdown = (index) => {
        setOpenSubDropdown(openSubDropdown === index ? null : index);
    };

    const sidebarVariants = {
        open: { x: 0 },
        closed: { x: '-100%' }
    };

    const dropdownVariants = {
        open: { height: 'auto', opacity: 1 },
        closed: { height: 0, opacity: 0 }
    };

    return (
        <AnimatePresence>
            { isOpen && (
                <motion.div
                key={isOpen}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                exit="closed"
                variants={sidebarVariants}
                transition={{ type: 'tween', duration: 0.3 }}
                className={`inset-0 z-50 w-full max-w-xs h-full bg-gray-800 border-r border-gray-300 shadow-lg ${isOpen ? 'block' : 'hidden'}`}
            >
                <div>
                    <div className="bg-gray-900 shadow-sm border-b border-gray-700 p-3 flex items-center justify-between gap-2">
                        <h1 className="font-semibold text-3xl text-gray-200">SMS</h1>
                        <div className="flex items-center gap-2">
                            <span className="font-normal text-xs text-gray-200">{ isFreshYear ? 'New Environment' : schoolYear.isYearDone ? `For Viewing (${currentSy})` :  currentSy}</span>
                            <button onClick={toggleSidebar} className="text-gray-200 hover:scale-110 hover:transition">
                                <MdClose size={24} />
                            </button>
                        </div>
                    </div>
    
                    <div onClick={() => navigate(`/profile/${currentUserId}`)} className="border border-gray-700 shadow-lg flex items-stretch gap-2 justify-start p-2 m-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-800">
                        <img className="w-16 h-16 rounded-full object-cover" src={ user.profilePictureUrl ? `${baseUrl()}${user.profilePictureUrl}` : '/avatar/avatar.png'} alt="Profile Picture" />
                        <div className="text-gray-200 flex flex-col">
                            <h2 className="text-md">{currentUser}</h2>
                            <span className="text-xs">{currentRole}</span>
                        </div>
                    </div>
    
                    <ul className="max-h-[calc(100%-4rem)] overflow-auto pb-20">
                        {userMenus.map((menu, id) => (
                            <div key={id}>
                                <li className="px-7 py-3 my-3 flex flex-col gap-2 cursor-pointer">
                                    {menu.link ? (
                                        <Link to={menu.link} className="flex items-center gap-2 hover:bg-gray-900 p-2">
                                            <span className="text-gray-200">{menu.icon}</span>
                                            <span className="text-gray-200">{menu.name}</span>
                                            {menu.subMenus && (
                                                <MdOutlineKeyboardArrowUp
                                                    className={`transition-transform duration-300 text-gray-200 ${openDropdown === id ? 'rotate-0' : 'rotate-180'}`}
                                                />
                                            )}
                                        </Link>
                                    ) : (
                                        <button
                                            className="flex items-center gap-2 p-2 hover:bg-gray-900"
                                            onClick={() => handleToggleDropdown(id)}
                                        >
                                            <span className="text-gray-200">{menu.icon}</span>
                                            <span className="text-gray-200">{menu.name}</span>
                                            {menu.subMenus && (
                                                <MdOutlineKeyboardArrowUp
                                                    className={`transition-transform duration-300 text-gray-200 ${openDropdown === id ? 'rotate-0' : 'rotate-180'}`}
                                                />
                                            )}
                                        </button>
                                    )}
                                    {menu.subMenus && (
                                        <AnimatePresence initial={false}>
                                            {openDropdown === id && (
                                                <motion.ul
                                                    initial="closed"
                                                    animate="open"
                                                    exit="closed"
                                                    variants={dropdownVariants}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    {menu.subMenus.map((subMenu, subId) => (
                                                        <div key={subId}>
                                                            {subMenu.link ? (
                                                                <Link onClick={() => setShowForm(false)} to={subMenu.link}>
                                                                    <li className="text-sm py-3 text-gray-200 shadow-sm hover:bg-gray-900 p-2 border-b border-gray-900">{subMenu.name}</li>
                                                                </Link>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className="text-sm py-3 text-gray-200 shadow-sm hover:bg-gray-900 p-2 border-b border-gray-900 w-full text-left flex gap-2 items-center"
                                                                        onClick={() => handleToggleSubDropdown(subId)}
                                                                    >
                                                                        {subMenu.name}
                                                                        <MdOutlineKeyboardArrowUp
                                                                            className={`transition-transform duration-300 text-gray-200 ${openSubDropdown === subId ? 'rotate-0' : 'rotate-180'}`}
                                                                        />
                                                                    </button>
                                                                    <AnimatePresence initial={false}>
                                                                        {openSubDropdown === subId && (
                                                                            <motion.ul
                                                                                initial="closed"
                                                                                animate="open"
                                                                                exit="closed"
                                                                                variants={dropdownVariants}
                                                                                transition={{ duration: 0.3 }}
                                                                                className="overflow-hidden ml-4"
                                                                            >
                                                                                {subMenu.subMenus?.map((sb, key) => (
                                                                                    <Link onClick={() => setShowForm(false)} key={key} to={sb.link}>
                                                                                        <li className="text-sm py-3 text-gray-200 shadow-sm hover:bg-gray-900 p-2 border-b border-gray-900">{sb.name}</li>
                                                                                    </Link>
                                                                                ))}
                                                                            </motion.ul>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 w-full text-center">
                    <span className="text-gray-200 text-sm break-words">
                        {`${schoolYear?.schoolTheme ?? 'No school theme yet'}`}
                    </span>
                </div>
            </motion.div>
            ) }
        </AnimatePresence>
    );
};

export default Sidebar;
