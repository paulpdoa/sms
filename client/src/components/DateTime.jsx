
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
    

    return (
        <>
        <div className="p-2">
            <h1 className="text-gray-700">{day}, {date} {month} {year} | {hour > 12 ?  hour - 12 : hour}:{minute < 10 ? `0${minute}` : minute}{time}</h1>
        </div>
        <hr className="h-[2px] bg-gray-300 my-2" />
        </>
    )
}

export default DateTime;