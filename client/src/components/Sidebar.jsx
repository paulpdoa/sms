import { useState } from 'react';
import { AiFillDashboard } from "react-icons/ai";
import { PiStudentFill, PiChalkboardTeacherFill } from "react-icons/pi";
import { RiParentFill, RiAccountPinBoxFill } from "react-icons/ri";
import { IoLibrary, IoSettings } from "react-icons/io5";
import { FaUsers, FaCashRegister, FaRegUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

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
                    { name: 'Nationality Code', link: '/master/nationality-code' },
                    { name: 'Gender', link: '/master/gender' },
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
                    { name: 'Strands', link: '/strands' }
                ]
            },
            {
                name: 'Registrar',
                icon: <FaCashRegister />,
                subMenus: [
                    { name: 'Students', link: '/students' },
                    { name: 'Registration' },
                    { name: 'Admission', link: '/admission' },
                    { name: 'Sectioning', link:'/sectioning' },
                    { name: 'Assessment', link: '/assessment' }
                ]
            },
            {
                name: 'Parents',
                icon: <RiParentFill />,
                link: '/parents'
            },
            {
                name: 'Library',
                icon: <IoLibrary />,
                link: '/library'
            },
            {
                name: 'Account',
                icon: <RiAccountPinBoxFill />,
                link: '/account'
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
                name: 'Parents',
                icon: <RiParentFill />,
                link: '/parents'
            },
            {
                name: 'Library',
                icon: <IoLibrary />,
                link: '/library'
            },
            {
                name: 'Account',
                icon: <RiAccountPinBoxFill />,
                link: '/account'
            },
            {
                name: 'Settings',
                icon: <IoSettings />,
                link: '/settings'
            }
        ]
    }
];

const Sidebar = () => {
    const currentRole = localStorage.getItem('role');
    const currentUser = localStorage.getItem('username');

    const [menus] = useState(initialMenus);

    const userMenus = menus.find(menu => menu.role === currentRole)?.menus || [];

    return (
        <nav className="w-full col-span-2 bg-sky-950 h-full">
            <div>
                <div className="bg-green-600 p-3">
                    <h1 className="font-semibold text-3xl text-gray-100">SMS</h1>
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
                            <li className="px-7 py-3 my-3 flex flex-col gap-2 hover cursor-pointer group">
                                {menu.link ? (
                                    <Link to={menu.link} className="flex items-center gap-2 p-1 hover:bg-sky-900">
                                        <span className="text-green-500">{menu.icon}</span>
                                        <span className="text-gray-100">{menu.name}</span>
                                        {menu.subMenus && <MdOutlineKeyboardArrowUp className="rotate-180 group-hover:rotate-0" />}
                                    </Link>
                                ) : (
                                    <button className="flex items-center gap-2 hover:bg-sky-900 p-1">
                                        <span className="text-green-500">{menu.icon}</span>
                                        <span className="text-gray-100">{menu.name}</span>
                                        {menu.subMenus && <MdOutlineKeyboardArrowUp className="rotate-180 group-hover:rotate-0" />}
                                    </button>
                                )}
                                {menu.subMenus && (
                                    <ul className="group-hover:flex flex-col gap-3 hidden">
                                        {menu.subMenus.map((subMenu, subId) => (
                                            <Link key={subId} className="hover:bg-sky-900 p-1" to={subMenu.link}>
                                                <li className="text-sm px-5">{subMenu.name}</li>
                                            </Link>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
            {/* <button className="text-green-500 px-7 py-3 cursor-pointer my-3 flex items-center gap-2 absolute bottom-5 w-full"><IoIosLogOut /> <span className="text-gray-100">Logout</span></button> */}
        </nav>
    );
}

export default Sidebar;
