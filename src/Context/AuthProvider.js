import React, { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";

import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { Spin } from 'antd';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const { displayName, email, uid, photoURL } = currentUser;
                setUser({
                    displayName,
                    email,
                    uid,
                    photoURL
                });
                setIsLoading(false);
                navigate('/')

                return;
            }
            else {
                setUser({});
                setIsLoading(false);
                navigate('/login');
                if(location.pathname === '/signup')
                {
                    navigate('/signup');
                }
            }
        });
        //clean function
        return () => {
            unsubscribe();
        }
    }, [navigate])

    return (
        <AuthContext.Provider value={{ user }}>
            {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
        </AuthContext.Provider>
    );
}
