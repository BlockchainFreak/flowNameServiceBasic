import * as fcl from '@onflow/fcl'
import { createContext, useContext, useState, useEffect } from 'react'
import { checkIsInit } from '../flow/scripts'

export const AuthContext = createContext({})

export const  useAuth = () => useContext(AuthContext)

export default function AuthProvider(props){
    const [user, setUser] = useState({
        loggedIn: false,
        addr: undefined,
    })
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => fcl.currentUser.subscribe(setUser), [])

    useEffect(() => { user.address && checkInit() }, [user])

    const logIn = () => { fcl.logIn() }

    const logOut = () => {
        fcl.unauthenticate()
        setUser({ loggedIn: false, addr: undefined })
    }

    const checkInit = async () => {
        const isInit = await checkIsInit(user.addr)
        setIsInitialized(isInit)
    }

    const value = {
        currentUser: user,
        isInitialized,
        checkInit,
        logIn,
        logOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}