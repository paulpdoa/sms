import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from "react-icons/io5";

const DateTime = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const day = days[currentTime.getDay()];
  const month = months[currentTime.getMonth()];
  const date = currentTime.getDate() < 10 ? `0${currentTime.getDate()}` : currentTime.getDate();
  const year = currentTime.getFullYear();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
  const second = currentTime.getSeconds() < 10 ? `0${currentTime.getSeconds()}` : currentTime.getSeconds();
  const period = hour >= 12 ? 'PM' : 'AM';

  const formattedHour = hour % 12 || 12; // Convert 24-hour time to 12-hour time, with 0 becoming 12

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-600">
            {day}, {date} {month} {year} | {formattedHour}:{minute}:{second} {period}
        </h1>
        <button onClick={() => navigate(-1)} className="px-3 py-2 text-sm text-blue-500 rounded hover:underline transition flex items-center gap-2">
            <IoArrowBackOutline /> Go Back
        </button>
      </div>
      <hr className="h-[2px] bg-gray-300 my-4" />
      
    </div>
  );
};

export default DateTime;
