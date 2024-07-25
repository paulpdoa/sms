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
                    { name: 'Students', link: '/master/students' },
                    { name: 'Teachers', link: '/master/teachers' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
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
                ]
            },
            {
                name: 'School Admin',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Teachers', link: '/teachers' },
                    { name: 'Students', link: '/students' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/admission' },
                            { name: 'Assessment', link: '/assessment' },
                            { name: 'Sectioning', link: '/sectioning' }
                        ]
                    }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/admission' },
                            { name: 'Assessment', link: '/assessment' },
                            { name: 'Sectioning', link: '/sectioning' }
                        ]
                    }
                ]
            },
            {
                name: 'Settings',
                icon: <IoSettings />,
                link: '/settings'
            }
        ]
    },
    {
        role: 'School Admin',
        menus: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
                link: '/'
            },
            {
                name: 'School Admin',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Teachers', link: '/teachers' },
                    { name: 'Students', link: '/students' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/admission' },
                            { name: 'Assessment', link: '/assessment' },
                            { name: 'Sectioning', link: '/sectioning' }
                        ]
                    }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/admission' },
                            { name: 'Assessment', link: '/assessment' },
                            { name: 'Sectioning', link: '/sectioning' }
                        ]
                    }
                ]
            },
            {
                name: 'Settings',
                icon: <IoSettings />,
                link: '/settings'
            }
        ]
    },
    {
        role: 'Registrar',
        menus: [
            {
                name: 'Dashboard',
                icon: <AiFillDashboard />,
                link: '/'
            },
            {
                name: 'Master Data',
                icon: <RiAccountPinBoxFill />,
                subMenus: [
                    { name: 'Religion', link: '/master/religion' },
                    { name: 'Nationality', link: '/master/nationality' },
                    { name: 'Departments', link: '/master/departments' },
                    { name: 'Sections', link: '/master/sections' },
                    { name: 'Students', link: '/master/students' },
                    { name: 'Teachers', link: '/master/teachers' },
                    { name: 'Parents', link: '/master/parents' },
                    { name: 'Siblings', link: '/master/siblings' },
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
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    {
                        name: 'Enrollment Process',
                        subMenus: [
                            { name: 'Admission', link: '/admission' },
                            { name: 'Assessment', link: '/assessment' },
                            { name: 'Sectioning', link: '/sectioning' }
                        ]
                    }
                ]
            },
            {
                name: 'Settings',
                icon: <IoSettings />,
                link: '/settings'
            }
        ]
    }
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { role: currentRole, currentUser, currentUserId, session: sessionId, setShowForm,isFreshYear} = useContext(MainContext);

    const navigate = useNavigate();
    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${sessionId}`);
    const { records: user } = useFetch(`${baseUrl()}/user/${currentUserId}`);
    console.log(user);
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
                className={`inset-0 z-50 w-full max-w-xs h-full bg-gradient-to-r from-gray-100 to-gray-200 border-r border-gray-300 shadow-lg ${isOpen ? 'block' : 'hidden'}`}
            >
                <div>
                    <div className="bg-gray-200 shadow-sm border-b border-gray-300 p-3 flex items-center justify-between gap-2">
                        <h1 className="font-semibold text-3xl text-gray-700">SMS</h1>
                        <div className="flex items-center gap-2">
                            <span className="font-normal text-xs text-gray-700">{ isFreshYear ? 'New Environment' : schoolYear.isYearDone ? `For Viewing (${currentSy})` :  currentSy}</span>
                            <button onClick={toggleSidebar} className="text-gray-700 hover:scale-110 hover:transition">
                                <MdClose size={24} />
                            </button>
                        </div>
                    </div>
    
                    <div onClick={() => navigate(`/profile/${currentUserId}`)} className="border border-gray-300 shadow-lg flex items-stretch gap-2 justify-start p-2 m-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300">
                        <img className="w-16 h-16 rounded-full object-cover" src={ user.profilePictureUrl ? `${baseUrl()}${user.profilePictureUrl}` : '/avatar/avatar.png'} alt="Profile Picture" />
                        <div className="text-gray-700 flex flex-col">
                            <h2 className="text-lg">{currentUser}</h2>
                            <span className="text-xs">{currentRole}</span>
                        </div>
                    </div>
    
                    <ul className="max-h-[calc(100%-4rem)] overflow-auto pb-20">
                        {userMenus.map((menu, id) => (
                            <div key={id}>
                                <li className="px-7 py-3 my-3 flex flex-col gap-2 cursor-pointer">
                                    {menu.link ? (
                                        <Link to={menu.link} className="flex items-center gap-2 hover:bg-gray-200 p-1">
                                            <span className="text-gray-700">{menu.icon}</span>
                                            <span className="text-gray-700">{menu.name}</span>
                                            {menu.subMenus && (
                                                <MdOutlineKeyboardArrowUp
                                                    className={`transition-transform duration-300 text-gray-700 ${openDropdown === id ? 'rotate-0' : 'rotate-180'}`}
                                                />
                                            )}
                                        </Link>
                                    ) : (
                                        <button
                                            className="flex items-center gap-2 p-1 hover:bg-gray-200"
                                            onClick={() => handleToggleDropdown(id)}
                                        >
                                            <span className="text-gray-700">{menu.icon}</span>
                                            <span className="text-gray-700">{menu.name}</span>
                                            {menu.subMenus && (
                                                <MdOutlineKeyboardArrowUp
                                                    className={`transition-transform duration-300 text-gray-700 ${openDropdown === id ? 'rotate-0' : 'rotate-180'}`}
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
                                                                    <li className="text-sm py-3 text-gray-700 shadow-sm hover:bg-gray-200 p-2 border-b border-gray-300">{subMenu.name}</li>
                                                                </Link>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className="text-sm py-3 text-gray-700 shadow-sm hover:bg-gray-200 p-2 border-b border-gray-300 w-full text-left flex gap-2 items-center"
                                                                        onClick={() => handleToggleSubDropdown(subId)}
                                                                    >
                                                                        {subMenu.name}
                                                                        <MdOutlineKeyboardArrowUp
                                                                            className={`transition-transform duration-300 text-gray-700 ${openSubDropdown === subId ? 'rotate-0' : 'rotate-180'}`}
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
                                                                                        <li className="text-sm py-3 text-gray-700 shadow-sm hover:bg-gray-200 p-2 border-b border-gray-300">{sb.name}</li>
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
                    <span className="text-gray-700 text-sm break-words">
                        {`${schoolYear?.schoolTheme ?? 'No school theme yet'}`}
                    </span>
                </div>
            </motion.div>
            ) }
        </AnimatePresence>
    );
};

export default Sidebar;
