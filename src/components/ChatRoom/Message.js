import { Avatar, Typography, Image } from 'antd';
import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { formatRelative } from 'date-fns';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';

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

  /* CSS */
  .content {
    display: inline-block;
    padding: 8px;
    border-radius: 10px;
    border: 1px solid ${(props) => (props.isSelf ? '#0084FF' : '#E4E6EB')};
    background-color: ${(props) => (props.isSelf ? '#0084FF' : '#E4E6EB')};
    color: ${(props) => (props.isSelf ? '#FFF' : '#000')};
    max-width:${(props) => (props.isSelf ? '95%' : '17%')};
  }

  margin-left: ${(props) => (props.isSelf ? '80%' : '0px')};
`;

const formatTime = (seconds) => {
  let formattedTime = '';
  if (seconds) {
    formattedTime = formatRelative(new Date(seconds * 1000), new Date());
    formattedTime = formattedTime.charAt(0).toUpperCase() + formattedTime.slice(1);
  }

  return formattedTime;
};

export default function Message({ fileURL, text, displayName, createdAt, photoURL, uid }) {
  const { user } = useContext(AuthContext);
  const { members } = useContext(AppContext);
  const isSelf = uid === user.uid;


  const formatText = (text) => {
    const tagRegex = /@(\w+)/g;
    const parts = text.split(tagRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>@{part}</strong>;
      } else {
        return part;
      }
    });
  };



  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const fileExtension = url
      .substring(0, url.indexOf('?'))
      .substring(url.lastIndexOf('.'))
      .toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const getFileName = (url) => {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1].split('?')[0];
    const decodeFileName = decodeURIComponent(lastPart);

    return decodeFileName.split('/')[2];
  }


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

      <br />
      <div>
        {fileURL ? (
          <div>
            {isImageFile(fileURL) ? (
              <div>
                <Image src={fileURL}
                  alt="img"
                  className="image"
                  style={{ cursor: 'pointer',borderRadius: '10px' }} />
              </div>
            ) : (
              <a href={fileURL} target="_blank" rel="noopener noreferrer">
                {getFileName(fileURL)}
              </a>
            )}
          </div>
        ) : (
          <Typography.Text className='content'>{formatText(text)}</Typography.Text>
        )}
      </div>
    </WrapperStyled>
  );
}
