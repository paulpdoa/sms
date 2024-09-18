import Searchbar from './Searchbar';
import AddNewData from '../components/buttons/AddNewData';
import { MainContext } from '../helpers/MainContext';
import { useContext } from 'react';

const TabActions = ({ title, noView }) => {
    const { setSearchQuery, setShowForm } = useContext(MainContext);

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <div className="flex flex-wrap justify-between mt-4 gap-4 items-center">
                <Searchbar onSearch={setSearchQuery} />
                {!noView && (
                    <AddNewData
                        label={`${title}`}
                        onShow={setShowForm}
                        className="ml-auto"
                    />
                )}
            </div>
        </div>
    );
};

export default TabActions;
