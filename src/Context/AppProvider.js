import React, { useState, createContext, useContext, useMemo } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";


export const AppContext = createContext();

export default function AppProvider({ children }) {

    const [isOpenAddRoom, setIsOpenAddRoom] = useState(false);
    const { user: { uid } } = useContext(AuthContext);

    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [uid])

    const rooms = useFirestore('rooms', roomsCondition);

    console.log(rooms);

    return (
        <AppContext.Provider value={{ rooms, isOpenAddRoom, setIsOpenAddRoom }}>
            {children}
        </AppContext.Provider>
    )
}