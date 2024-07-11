import Searchbar from "./Searchbar";
import AddNewData from '../components/buttons/AddNewData';
import { MainContext } from '../helpers/MainContext';
import { useContext } from 'react';

const TabActions = ({ title }) => {

    const { setSearchQuery,setShowForm } = useContext(MainContext);

    return (
        <div className="flex justify-between mx-4 my-2">
            <h1 className="text-2xl text-green-600 font-bold">{title}</h1>
            <div className="flex flex-col items-end gap-2">
                <Searchbar onSearch={setSearchQuery} />
                <AddNewData label={title} onShow={setShowForm}  />
            </div>
        </div>
    )
}

export default TabActions;