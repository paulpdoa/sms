import { useState } from 'react';
import { AiFillDashboard } from "react-icons/ai";
import { PiStudentFill } from "react-icons/pi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { RiParentFill } from "react-icons/ri";
import { IoLibrary } from "react-icons/io5";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { FaCashRegister } from "react-icons/fa";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";

const Sidebar = () => {

    const viewHeight = window.outerHeight;

    const currentRole = localStorage.getItem('role');
    const currentUser = localStorage.getItem('username');
    
    // 1. 
    // 2. 
    // 3. 

    const [menus,setMenus] = useState([
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
                        { 
                            name: 'Religion',
                            link: '/master/religion'
                        },
                        { 
                            name:'Nationality',
                            link: '/master/nationality'
                        },
                        { 
                            name: 'Gender',
                            link: '/master/gender'
                        },
                        { 
                            name: 'Departments',
                            link: '/master/departments'
                        },
                        { 
                            name: 'Sections',
                            link: '/master/sections'
                        },
                        {
                            name: 'Students',
                            link: '/master/students'
                        },
                        {
                            name: 'Teachers',
                            link: '/master/teachers'
                        },
                        {
                            name:'Parents',
                            link: '/master/parents'
                        },
                        {
                            name: 'Grade Level',
                            link: '/master/grade-levels'
                        },
                        {
                            name: 'Admission Requirements',
                            link: '/master/requirements'
                        },
                        {
                            name: 'User Roles',
                            link: '/master/user-roles'
                        },
                        {
                            name: 'School Year',
                            link: '/master/school-year'
                        },
                        {
                            name: 'Users',
                            link: '/master/users'
                        },
                        {
                            name: 'Strands',
                            link: '/master/strands'
                        },
                        {
                            name: 'Textbooks',
                            link: '/master/text-books'
                        },
                        {
                            name: 'Payment Terms',
                            link: '/master/payment-terms'
                        },
                        {
                            name: 'Payment Schedule',
                            link: '/master/payment-schedule'
                        },
                        {
                            name: 'Late Payment Penalty',
                            link: '/master/payment-penalty'
                        },
                        {
                            name: 'Admission',
                            link: '/master/admission'
                        },
                        {
                            name: 'Fee Category',
                            link: '/master/fee-category'
                        },
                        {
                            name: 'Fee Code',
                            link: '/master/fee-code'
                        }
                    ]
                },
                {
                    name: 'School Admin',
                    icon: <FaCashRegister />,
                    subMenus: [
                        { 
                            name: 'Teachers',
                            link: '/teachers'
                        },
                        { 
                            name: 'Strands',
                            link: '/strands'
                        }
                    ]
                },
                {
                    name: 'Registrar',
                    icon: <FaCashRegister />,
                    subMenus: [
                        { 
                            name: 'Students',
                            link: '/students'
                        },
                        { 
                            name:'Registration' 
                        },
                        { 
                            name: 'Admission',
                            link:'/admission'
                        },
                        { 
                            name: 'Sectioning' 
                        }
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
                        { 
                            name: 'Teachers',
                            link: '/teachers'
                        }
                    ]
                },
                {
                    name: 'Registrar',
                    icon: <FaCashRegister />,
                    subMenus: [
                        { 
                            name: 'Students',
                            link: '/students'
                        },
                        { 
                            name:'Registration' 
                        },
                        { 
                            name: 'Admission' 
                        },
                        { 
                            name: 'Sectioning' 
                        }
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
    ])

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
                    { menus?.filter(menu => menu.role === currentRole)[0]?.menus?.map((menu,id) => (
                        <div key={id}>
                            <li className="px-7 py-3 my-3 flex flex-col gap-2 hover cursor-pointer group">
                                { menu.link !== undefined ?
                                <Link to={menu.link} className="flex items-center gap-2 p-1 hover:bg-sky-900">
                                    <span className="text-green-500 ">{menu.icon}</span> 
                                    <span className="text-gray-100">{menu.name}</span> 
                                    { menu.subMenus !== undefined && <MdOutlineKeyboardArrowUp  className="rotate-180 group-hover:rotate-0"/> }
                                </Link> :
                                <button className="flex items-center gap-2 hover:bg-sky-900 p-1">
                                    <span className="text-green-500 ">{menu.icon}</span> 
                                    <span className="text-gray-100">{menu.name}</span> 
                                    { menu.subMenus !== undefined && <MdOutlineKeyboardArrowUp  className="rotate-180 group-hover:rotate-0"/> }
                                </button> 
                                } 
                                { menu.subMenus !== undefined && 
                                <ul className="group-hover:flex flex-col gap-3 hidden">
                                    { menu.subMenus?.map((subMenu,id) => (
                                        <Link key={id} className="hover:bg-sky-900 p-1" to={subMenu.link}><li className="text-sm px-5">{subMenu.name}</li></Link>
                                    )) }
                                </ul>   
                                }
                            </li>
                        </div>
                    )) }
                </ul>
            </div>
            {/* <button className="text-green-500 px-7 py-3 cursor-pointer my-3 flex items-center gap-2 absolute bottom-5 w-full"><IoIosLogOut /> <span className="text-gray-100">Logout</span></button> */}
        </nav>
    )
}

export default Sidebar;