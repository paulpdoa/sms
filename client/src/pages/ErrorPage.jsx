import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useContext } from 'react';
import { MainContext } from '../helpers/MainContext';

const ErrorPage = () => {
    const navigate = useNavigate();
    const { role } = useContext(MainContext);

    const goBack = () => navigate(-1); // Navigates to the previous page

    const goHome = () => {
        if(role === 'Super Admin') {
            navigate('/master/dashboard')
        } else {
            navigate(`/${role.replace(" ","").toLowerCase()}/dashboard`)
        }
    }; // Redirects to the home page

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-10 bg-white rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-6">
                    Oops! The page you are looking for does not exist. It might have been moved or deleted.
                </p>
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={goBack} 
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                        <FaArrowLeft className="mr-2" /> Go Back
                    </button>
                    <button 
                        onClick={goHome} 
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ErrorPage;
