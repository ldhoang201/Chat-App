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
    margin-left: ${(props) => (props.isSelf ? '10px' : '30px')};
    padding: 8px;
    border-radius: 10px;
    border: 1px solid ${(props) => (props.isSelf ? '#0084FF' : '#E4E6EB')}; 
    background-color: ${(props) => (props.isSelf ? '#0084FF' : '#E4E6EB')}; 
    color: ${(props) => (props.isSelf ? '#FFF' : '#000')}; /* Điều chỉnh màu sắc văn bản ở đây */
  }


  margin-left: ${(props) => (props.isSelf ? '80%' : '0px')};

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

  return (
    <WrapperStyled isSelf={isSelf}>
      <div>
        {!isSelf && (
          <>
            <Avatar size="small" src={photoURL}>
              {photoURL ? '' : displayName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography.Text className="author">{displayName}</Typography.Text>
          </>
        )}
        <Typography.Text className="date">{formatTime(createdAt?.seconds)}</Typography.Text>
      </div>

      <br/>
      <div>
        {
          imgUrl ? <img src={imgUrl} alt='img' className='image' /> : <Typography.Text className='content'>{text}</Typography.Text>
        }
      </div>
    </WrapperStyled>
  )
}
