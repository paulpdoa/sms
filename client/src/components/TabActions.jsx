import Searchbar from './Searchbar';
import AddNewData from '../components/buttons/AddNewData';
import { MainContext } from '../helpers/MainContext';
import { useContext } from 'react';

const TabActions = ({ title, noView, noSearch }) => {
    const { setSearchQuery, setShowForm } = useContext(MainContext);

    return (
        <div className="p-4 rounded-lg flex items-center justify-between">
            <h1 className="text-2xl font-bold text-customHighlight">{title}</h1>
            <div className="flex flex-wrap justify-between gap-4 items-center">
                {/* { !noSearch && <Searchbar onSearch={setSearchQuery} /> } */}
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
