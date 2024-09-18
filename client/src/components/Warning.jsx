const Warning = ({message}) => {
    return (
        <div className="flex flex-col items-center justify-center absolute">
            <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded-lg shadow-md animate-bounce">
                <p className="text-xl font-medium">⚠️ {message}</p>
            </div>
        </div>
    )
}

export default Warning;