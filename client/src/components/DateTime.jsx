import { useEffect,useState } from 'react';

const DateTime = () => {

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];

    const today = new Date();
    const day = days[today.getDay()];
    const month = months[today.getMonth()];
    const date = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
    const year = today.getFullYear();
    
    const hour = today.getHours();
    const minute = today.getMinutes();
    const time = hour > 11 ? 'pm' : 'am'


    // Code that automatically moves time
    const [currentTime,setCurrentTime] = useState(minute);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(minute);
            // console.log(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
        },1000)

        return () => clearInterval(timer);
    },[])
    

    

    return (
        <>
        <div className="p-2">
            <h1 className="text-gray-700">{day}, {date} {month} {year} | {hour > 12 ?  hour - 12 : hour}:{currentTime < 10 ? `0${currentTime}` : currentTime} {time}</h1>
        </div>
        <hr className="h-[2px] bg-gray-300 my-2" />
        </>
    )
}

export default DateTime;