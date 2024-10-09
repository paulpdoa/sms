const Filter = ({ options,title,onChange }) => {
    return (
        <div className="flex flex-col">
            <label className="text-sm" htmlFor="filter">Filter Table:</label>
            <select 
                onChange={(e) => onChange(e.target.value)}
                className="p-2 rounded-md outline-none focus:ring-2 focus:ring-customView border border-gray-300"
            >
                <option hidden>Select {title}</option>
                { options.map(option => (
                    <option value={option}>{option}</option>
                )) }
            </select>
        </div>
    )
}

export default Filter;