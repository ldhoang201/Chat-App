import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { Avatar, Button, Typography, Space } from 'antd';
import styled from 'styled-components';
import { AuthContext } from '../../Context/AuthProvider';
import { auth } from '../../firebase/config';

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;

  .ant-avatar {
    background-color: #663399;
    border: 2px solid white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-size: 24px;
  }

  .username {
    color: white;
    font-size: 18px;
    margin-top: 8px;
  }

  .logout-button {
    color: white;
    border: none;
    background: none;
    font-size: 16px;
    cursor: pointer;
    margin-top: 16px;
    transition: color 0.3s;

    &:hover {
      color: #ff4d4f;
    }
  }
`;

export default function UserInfo() {
  const { user: { displayName, photoURL } } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <UserInfoWrapper>
      <Avatar src={photoURL} size={64}>
        {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
      </Avatar>
      <Typography.Text className='username'>{displayName}</Typography.Text>
      <Button className='logout-button' onClick={() => handleLogout()}>
        Log out
      </Button>
    </UserInfoWrapper>
  );
}
