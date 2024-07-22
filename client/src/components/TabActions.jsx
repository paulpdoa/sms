import Searchbar from "./Searchbar";
import AddNewData from '../components/buttons/AddNewData';
import { MainContext } from '../helpers/MainContext';
import { useContext } from 'react';



const TabActions = ({ title,noView }) => {

    const { setSearchQuery,setShowForm } = useContext(MainContext);

    return (
        <div className="mx-4 my-2">
            <h1 className="text-2xl text-green-600 font-semibold">{title}</h1>
            <div className="flex mt-3 w-full gap-2 justify-between">
                <Searchbar onSearch={setSearchQuery} />
                { !noView && <AddNewData label={title} onShow={setShowForm}  />  }
            </div>
        </div>
    )
}

export default TabActions;