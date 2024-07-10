import { useState, useContext } from 'react';
import { AiFillDashboard } from "react-icons/ai";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaCashRegister, FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowUp, MdOutlineMenu, MdClose } from "react-icons/md";
import { MainContext } from "../helpers/MainContext"; 
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';

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
                    // { name: 'Nationality Code', link: '/master/nationality-code' },
                    // { name: 'Gender', link: '/master/gender' },
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
                    { name: 'Late Payment Penalty', link: '/master/payment-penalty' },
                    { name: 'Admission', link: '/master/admission' },
                    { name: 'Fee Category', link: '/master/fee-category' },
                    { name: 'Fee Code', link: '/master/fee-code' },
                    { name: 'Manage Fees', link: '/master/manage-fees' },
                    { name: 'Discount', link: '/master/discount' },
                    { name: 'Sectioning', link: '/master/sectioning' }
                ]
            },
            {
                name: 'School Admin',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Teachers', link: '/teachers' },
                    { name: 'Students', link: '/students' },
                    { name: 'Admission', link: '/admission' },
                    { name: 'Assessment', link: '/assessment' }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    { name: 'Admission', link: '/admission' },
                    { name: 'Assessment', link: '/assessment' }
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
                    { name: 'Teachers', link: '/teachers' }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    { name: 'Registration' },
                    { name: 'Admission' },
                    { name: 'Sectioning', link: '/sectioning' }
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
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    { name: 'Registration' },
                    { name: 'Admission' },
                    { name: 'Sectioning', link: '/sectioning' }
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
    const { role: currentRole, currentUser, session: sessionId } = useContext(MainContext);

    const { records: schoolYear } = useFetch(`${baseUrl()}/school-year/${sessionId}`);
    const currentSy = schoolYear?.startYear?.split('-')[0] + '-' + schoolYear?.endYear?.split('-')[0];
    const [menus] = useState(initialMenus);
    const [openDropdown, setOpenDropdown] = useState(null); // State to manage open dropdown

    const userMenus = menus.find(menu => menu.role === currentRole)?.menus || [];

    const handleToggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <nav className={`transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 w-full bg-sky-950 h-full relative`}>
            <div>
                <div className="bg-green-600 p-3 flex items-center justify-between gap-2">
                    <h1 className="font-semibold text-3xl text-gray-100">SMS</h1>
                    <span className="font-normal text-sm text-gray-100">S.Y {currentSy}</span>
                    <button onClick={toggleSidebar} className="text-gray-100">
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="flex items-stretch gap-2 justify-start p-2 m-2 bg-sky-900 rounded-lg">
                    <FaRegUserCircle className="text-5xl" />
                    <div className="text-gray-100 flex flex-col">
                        <h2 className="text-lg">{currentUser}</h2>
                        <span className="text-xs">{currentRole}</span>
                    </div>
                </div>

                <ul className="max-h-full text-gray-100">
                    {userMenus.map((menu, id) => (
                        <div key={id}>
                            <li className="px-7 py-3 my-3 flex flex-col gap-2 cursor-pointer">
                                {menu.link ? (
                                    <Link to={menu.link} className="flex items-center gap-2 hover:bg-sky-900 p-1 ">
                                        <span className="text-green-500">{menu.icon}</span>
                                        <span className="text-gray-100">{menu.name}</span>
                                        {menu.subMenus && (
                                            <MdOutlineKeyboardArrowUp
                                                className={`transition-transform duration-300 ${openDropdown === id ? 'rotate-0' : 'rotate-180'}`}
                                            />
                                        )}
                                    </Link>
                                ) : (
                                    <button
                                        className="flex items-center gap-2 p-1 hover:bg-sky-900"
                                        onClick={() => handleToggleDropdown(id)}
                                    >
                                        <span className="text-green-500">{menu.icon}</span>
                                        <span className="text-gray-100">{menu.name}</span>
                                        {menu.subMenus && (
                                            <MdOutlineKeyboardArrowUp
                                                className={`transition-transform duration-300 ${openDropdown === id ? 'rotate-0' : 'rotate-180'}`}
                                            />
                                        )}
                                    </button>
                                )}
                                {menu.subMenus && (
                                    <ul className={`transition-all duration-300 ${openDropdown === id ? 'block' : 'hidden'}`}>
                                        {menu.subMenus.map((subMenu, subId) => (
                                            <Link key={subId} to={subMenu.link}>
                                                <li className="text-sm px-5 hover:bg-sky-900 p-2">{subMenu.name}</li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 w-full text-center">
                <span className="text-gray-100 text-sm break-words">
                    {`${schoolYear?.schoolTheme ?? 'No school theme yet'}`}
                </span>
            </div>
        </nav>
    );
};

export default Sidebar;