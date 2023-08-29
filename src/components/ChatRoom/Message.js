import { Avatar, Typography } from 'antd'
import React, { useContext } from 'react'
import { styled } from 'styled-components';
import { formatRelative } from 'date-fns';
import { AuthContext } from '../../Context/AuthProvider';


const WrapperStyled = styled.div`
  margin-bottom: 15px;

  .image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 5px;
  }

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


  align-self: ${(props) => (props.isSelf ? 'flex-end' : 'flex-start')};
  margin-left: ${(props) => (props.isSelf ? 'auto' : 'initial')};
  margin-right: ${(props) => (props.isSelf ? 'initial' : 'auto')};

`;

const formatTime = (seconds) => {
  let formattedTime = ''
  if (seconds) {
    formattedTime = formatRelative(new Date(seconds * 1000), new Date());
    formattedTime = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
  }

  return formattedTime;
}


export default function Message({ imgUrl, text, displayName, createdAt, photoURL, uid }) {
  const { user } = useContext(AuthContext);

  const isSelf = (uid === user.uid);
  console.log(isSelf);
  return (
    <WrapperStyled isSelf={isSelf}>
      <div>
        <Avatar size='small' src={photoURL}>
          {photoURL ? '' : displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>{formatTime(createdAt?.seconds)}</Typography.Text>
      </div>

      <div>
        {
          imgUrl ? <img src={imgUrl} alt='img' className='image' /> : <Typography.Text className='content'>{text}</Typography.Text>
        }
      </div>
    </WrapperStyled>
  )
}
