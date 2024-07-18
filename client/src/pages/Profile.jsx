import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { baseUrl } from '../baseUrl';
import { useState,useEffect } from 'react';

const Profile = () => {

    const { id } = useParams();
    const { records: user } = useFetch(`${baseUrl()}/user/${id}`);
    
    const [firstName,setFirstName] = useState('');
    const [middleName,setMiddleName] = useState('');
    const [lastName,setLastName] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    useEffect(() => {
        if(user) {
            setFirstName(user.firstName);
            setMiddleName(user.middleName);
            setLastName(user.lastName);
            setUsername(user.username);
        }
    },[user])

    return (
        <main>          
            <h1>Hi { firstName }</h1>
        </main>
    )
}

export default Profile;