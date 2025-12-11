import { useState } from "react"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "./UserContext"
import Logo from "./Logo"

export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register')

    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext)

    async function handleSubmit(ev) {
        ev.preventDefault()
        const url = isLoginOrRegister === 'register' ? '/register' : '/login'
        const { data } = await axios.post(url, { username, password })
        setLoggedInUsername(username)
        setId(data.id)
    }

    return (
        <div className="bg-background-secondary h-screen flex items-center text-text font-geom">
            <form
                className="w-1/4 mx-auto bg-background shadow-2xl shadow-background/50 p-10 rounded-lg"
                onSubmit={handleSubmit}
            >
                <div className="flex justify-center mb-5">
                    <Logo />
                </div>
                <input
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    type="text"
                    placeholder="Username"
                    className="block w-full p-2 mb-2 rounded-lg border border-primary focus:outline-none"
                />
                <input
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    type="password"
                    placeholder="Password"
                    className="block w-full p-2 mb-2 rounded-lg border border-primary focus:outline-none"
                />
                <button className="bg-primary text-white block w-full rounded-lg p-2 hover:cursor-pointer hover: shadow-primary/60 hover:bg-primary/80 transition-all duration-300">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                {isLoginOrRegister === 'register' && (
                    <div className="text-center mt-10 mb-2 text-text">
                        Already registed? <button onClick={() => setIsLoginOrRegister('login')} className="text-accent">Log in</button>
                    </div>
                )}
                {isLoginOrRegister === 'login' && (
                    <div className="text-center mt-10 mb-2 text-text">
                        Not registed? <button onClick={() => setIsLoginOrRegister('register')} className="text-accent">Register now</button>
                    </div>
                )}
            </form>
        </div>
    )
}