import { useState } from 'react';
import { CiSearch } from "react-icons/ci";

const Searchbar = () => {

    const [item,setItem] = useState('');

    return (
        <div className="flex items-center gap-2 overflow-hidden border-gray-300 border bg-white rounded-md">
            <input className="outline-none p-2" type="text" placeholder="Search..." />
            <CiSearch className="text-xl mx-2"/>
        </div>
    )
}

export default Searchbar;