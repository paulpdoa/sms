import { useState } from 'react';
import { AiFillDashboard } from "react-icons/ai";
import { RiParentFill } from "react-icons/ri";
import { IoLibrary } from "react-icons/io5";
import { RiAccountPinBoxFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaCashRegister } from "react-icons/fa";

export const useMenuLists = () => {

    const currentRole = localStorage.getItem('role');

    const [menus,setMenus] = useState([
        {
            role: 'Super Admin',
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
                    ]
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
    ]);
  
   return { menus,currentRole } 
   
}