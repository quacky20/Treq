import { useContext } from 'react'
import { UserContext } from './context/UserContext'
import RegisterAndLoginForm from './pages/RegisterAndLoginForm'
import Chat from './pages/Chat'

function Routes() {
    const { username, id } = useContext(UserContext)
    
    if(username) {
        return <Chat />
    }

    return (
        <RegisterAndLoginForm />
    )
}

export default Routes