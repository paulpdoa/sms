const Login = () => {
    return (
        <main className="bg-green-300 h-screen flex items-center justify-center">
            <img className="absolute right-0 top-0" src="/loginImage/Vector.png" alt="Vector" />

            <img className="absolute left-0 bottom-0 z-50" src='/loginImage/Ellipse.png' alt="Ellipse" />
            <img className="absolute left-0 bottom-0 z-40" src='/loginImage/Ellipse-1.png' alt="Ellipse 1" />
            <img className="absolute left-0 bottom-0" src='/loginImage/Ellipse-2.png' alt="Ellipse 2" />

            <form className="z-50">

                {/* LOGO HERE */}
                <h1 className="text-xl font-semibold text-gray-700">School Management System</h1>
                {/* LOGO HERE */}
                
                <div className="flex flex-col gap-2">
                    <span className="text-gray-700">Username</span>
                    <input className="border outline-none border-gray-100 p-2 bg-transparent rounded-md" type="text" />
                </div>

                <div className="flex flex-col gap-2 my-2">
                    <span className="text-gray-700">Password</span>
                    <input className="border outline-none border-gray-100 p-2 bg-transparent rounded-md" type="password" />
                </div>

                <button className="bg-gray-100 w-full p-1 rounded-md text-green-500 cursor-pointer my-3">Login</button>
            </form>
        </main>
    )
}

export default Login;