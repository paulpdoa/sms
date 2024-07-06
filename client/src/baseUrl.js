export const baseUrl = () => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return 'http://localhost:8080/api';
    } else {
        return 'https://sms-api-bgpa.onrender.com';
    }
}