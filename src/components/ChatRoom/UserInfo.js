import { Avatar, Button, Typography } from 'antd'
import React, { useContext, useEffect } from 'react'
import { styled } from 'styled-components'
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { onSnapshot, collection, query, orderBy, updateDoc, doc, getDoc, where, } from 'firebase/firestore';
import { AuthContext } from '../../Context/AuthProvider';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

export default function UserInfo() {

    // useEffect(() => {
    //     const userCollection = collection(db, 'messages');
    //     const q = query(userCollection, orderBy('createdAt'));
    //     onSnapshot(q, ((snapshot) => {
    //         const data = snapshot.docs.map(doc => ({
    //             ...doc.data(),
    //             id: doc.id
    //         }))

    //         console.log({ data, snapshot, docs: snapshot.docs });
    //     }))
    // }, [])

    const { user: {
        displayName,
        photoURL,
        uid
    } } = useContext(AuthContext);

    console.log(uid);

    const handleLogout = async () => {
        // await updateDoc(doc(db, 'users', uid), {
        //     isOnline: false
        // })

        await signOut(auth);
    };






    // useEffect(async () => {
    //     const docSnap = await getDoc(doc(db, 'users', uid));
    //     console.log(docSnap.data());
    //     return () => {
    //         docSnap();
    //     }
    // }, [])

    return (
        <WrapperStyled>
            <div>
                <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className='username'>{displayName}</Typography.Text>
            </div>
            <Button ghost onClick={() => handleLogout()}>
                Dang Xuat
            </Button>
        </WrapperStyled>
    )
}
