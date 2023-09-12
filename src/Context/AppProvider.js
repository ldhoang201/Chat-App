import React, { useState, createContext, useContext, useMemo, useEffect } from "react";
import useFirestore from "../hooks/useFirestore";
import { AuthContext } from "./AuthProvider";



export const AppContext = createContext();

export default function AppProvider({ children }) {

    const [isOpenAddRoom, setIsOpenAddRoom] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isOpenInviteMember, setIsOpenInviteMember] = useState(false);
    const { user: { uid } } = useContext(AuthContext);

    

    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [uid])

    const rooms = useFirestore('rooms', roomsCondition);

    const selectedRoom = useMemo(() => {
        return rooms.find(room =>
            room.id === selectedRoomId
        )
    }, [rooms, selectedRoomId])

    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom?.members
        }
    }, [selectedRoom?.members])


    const members = useFirestore('users', usersCondition);


    return (
        <AppContext.Provider value={{
            rooms,
            isOpenAddRoom,
            setIsOpenAddRoom,
            isOpenInviteMember,
            setIsOpenInviteMember,
            selectedRoomId,
            setSelectedRoomId,
            selectedRoom,
            members
        }}>
            {children}
        </AppContext.Provider>
    )
}