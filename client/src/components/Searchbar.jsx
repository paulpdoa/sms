import { useState } from 'react';
import { CiSearch } from "react-icons/ci";

const Searchbar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="flex items-center gap-2 overflow-hidden border-gray-300 border bg-white rounded-2xl">
            <input 
                className="outline-none p-2 placeholder:text-sm text-sm" 
                type="text" 
                placeholder="Search..." 
                value={query} 
                onChange={handleInputChange} 
            />
            <CiSearch className="text-xl mx-2"/>
        </div>
    );
}

export default Searchbar;
