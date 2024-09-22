import Searchbar from './Searchbar';
import AddNewData from '../components/buttons/AddNewData';
import { MainContext } from '../helpers/MainContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const TabActions = ({ title, noView, noSearch,redirect }) => {
    const { setSearchQuery, setShowForm,genericPath } = useContext(MainContext);
    const navigate = useNavigate();

    return (
        <div className="p-4 rounded-lg flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold text-customHighlight">{title}</h1>
            <div className="flex flex-wrap justify-between gap-4 items-center">
                {/* { !noSearch && <Searchbar onSearch={setSearchQuery} /> } */}
                { !noView && (
                    <AddNewData
                        label={`${title}`}
                        onShow={setShowForm}
                        className="ml-auto"
                        redirect={redirect}
                    />
                ) }
            </div>
        </div>
    );
};

export default TabActions;
