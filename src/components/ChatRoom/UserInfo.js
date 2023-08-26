import { Avatar, Button, Typography } from 'antd'
import React, { useContext, useEffect } from 'react'
import { styled } from 'styled-components'
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { onSnapshot, collection } from 'firebase/firestore';
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
    //     const userCollection = collection(db, 'users');
    //     onSnapshot(userCollection, ((snapshot) => {
    //         const data = snapshot.docs.map(doc => ({
    //             ...doc.data(),
    //             id: doc.id
    //         }))

    //         console.log({ data, snapshot, docs: snapshot.docs });
    //     }))
    // }, [])

    const { user: {
        displayName,
        photoURL
    } } = useContext(AuthContext);


    return (
        <WrapperStyled>
            <div>
                <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}</Avatar>
                <Typography.Text className='username'>{displayName}</Typography.Text>
            </div>
            <Button ghost onClick={() => signOut(auth)}>
                Dang Xuat
            </Button>
        </WrapperStyled>
    )
}
