import { useState } from "react"

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div className="bg-amber-50 h-screen flex items-center">
            <form className="w-64 mx-auto">
                <input
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    type="text"
                    placeholder="Username"
                    className="block w-full p-2 mb-2 rounded-lg border border-amber-400" />
                <input
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    type="password"
                    placeholder="Password"
                    className="block w-full p-2 mb-2 rounded-lg border border-amber-400" />
                <button className="bg-amber-400 text-white block w-full rounded-lg p-2">Register</button>
            </form>
        </div>
    )
}