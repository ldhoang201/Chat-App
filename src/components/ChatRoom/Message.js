import { Avatar, Typography } from 'antd'
import React from 'react'
import { styled } from 'styled-components';
import { formatRelative } from 'date-fns';


const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }
`;

const formatTime = (seconds) => {
  let formattedTime = ''
  if (seconds) {
    formattedTime = formatRelative(new Date(seconds * 1000), new Date());
    formattedTime = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
  }

  return formattedTime;
}


export default function Message({ text, displayName, createdAt, photoURL }) {
  return (
    <WrapperStyled>
      <div>
        <Avatar size='small' src={photoURL}>
          {photoURL ? '' : displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>{formatTime(createdAt?.seconds)}</Typography.Text>
      </div>
      <div>
        <Typography.Text className='content'>{text}</Typography.Text>
      </div>
    </WrapperStyled>
  )
}
