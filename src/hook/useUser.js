import store from "store"
import { useState, useEffect } from "react"

const useUser = () => {
    const [user, setUser] = useState({})

    useEffect(() => {
        var u
        function getUser() {
            u = store.get('user', {username: '???', avatar: '0'})
            setUser(u)
        }
        getUser()
        window.addEventListener('getUser', getUser)
        return () => {
            window.removeEventListener('getUser', getUser)
        }
    }, [])

    return user
}

export default useUser