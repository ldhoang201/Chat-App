import React, { createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";

import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { Spin } from 'antd';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log(currentUser);
                const { displayName, email, uid, photoURL } = currentUser;
                setUser({
                    displayName,
                    email,
                    uid,
                    photoURL
                });
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/')
                }, 2000);
            }
            else {
                setUser({});
                setIsLoading(false);
                navigate('/login');
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
