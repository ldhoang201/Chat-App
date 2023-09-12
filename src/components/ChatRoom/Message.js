import { Avatar, Typography, Image, Tooltip } from 'antd';
import { FileWordTwoTone, FilePdfTwoTone, FileExcelTwoTone, FileTextTwoTone, FileTwoTone } from '@ant-design/icons';
import React, { useContext, useState } from 'react';
import { styled } from 'styled-components';
import { formatRelative } from 'date-fns';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";



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

  .seen-list {
    display: flex;
    margin-left: 16px;
    margin-top: 2px;
  }


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

export default function Message({ fileURL, text, displayName, createdAt, photoURL, uid, seenList, isLatest }) {
  const { user } = useContext(AuthContext);
  const { members } = useContext(AppContext);
  const isSelf = uid === user.uid;

  console.log(isLatest);

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

  const formatSeenByMessage = (seenList, members) => {
    const seenUsers = seenList.map((seenUid) => {
      const seenUser = members.find((member) => member.uid === seenUid);
      return seenUser ? seenUser.displayName : seenUid;
    });

    if (seenUsers.length > 0) {
      return `Seen by ${seenUsers.join(' and ')}`;
    }

    return '';
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

  const renderDocument = (fileURL) => {
    // Define a mapping of file extensions to Ant Design icons
    const fileIcons = {
      '.pdf': <FilePdfTwoTone size='large' style={{fontSize: '18px'}} twoToneColor="#ff5722" />,
      '.doc': <FileWordTwoTone size='large' style={{fontSize: '18px'}} twoToneColor="#007acc" />,
      '.docx': <FileWordTwoTone size='large' style={{fontSize: '18px'}} twoToneColor="#007acc" />,
      '.xls': <FileExcelTwoTone size='large' style={{fontSize: '18px'}} twoToneColor="#4caf50" />,
      '.xlsx': <FileExcelTwoTone size='large' style={{fontSize: '18px'}} twoToneColor="#4caf50" />,
      '.txt': <FileTextTwoTone size='large' style={{fontSize: '18px'}} twoToneColor="#333" />,
    };
  
    // Get the file extension from the file URL
    const fileExtension = fileURL
      .substring(0, fileURL.indexOf('?'))
      .substring(fileURL.lastIndexOf('.'))
      .toLowerCase();
  
    // Check if the file extension is in the mapping
    if (fileIcons[fileExtension]) {
      // Render a clickable link with the file icon
      return (
        <a href={fileURL} target="_blank" rel="noopener noreferrer" className='content'>
          {fileIcons[fileExtension]} {getFileName(fileURL)}
        </a>
      );
    } else {
      // Default to a generic file icon if the type is not recognized
      return (
        <a href={fileURL} target="_blank" rel="noopener noreferrer" className='content'>
          <FileTwoTone twoToneColor="#999" />
        </a>
      );
    }
  };

  const seenByMessage = formatSeenByMessage(seenList, members);

  const seenListWithoutSender = seenList.filter((seenUid) => seenUid !== uid);


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
                <Image src={fileURL} alt="img" className="image" style={{ cursor: 'pointer', borderRadius: '10px' }} />
              </div>
            ) : (
              renderDocument(fileURL)
            )}
          </div>
        ) : (
          <>
            <Typography.Text className="content">
              {formatText(text)}
            </Typography.Text>
            {seenListWithoutSender.length > 0 && (
              <Avatar.Group size="small" maxCount={2} className='seen-list'>
                <Tooltip title={`Seen by ${seenListWithoutSender.map(seenUid => {
                  const seenUser = members.find(member => member.uid === seenUid);
                  return seenUser ? seenUser.displayName : seenUid;
                }).join(', ')}`}>
                  {seenListWithoutSender.map((seenUid) => {
                    const seenUser = members.find((member) => member.uid === seenUid);
                    return (
                      <Avatar key={seenUid} src={seenUser ? seenUser.photoURL : ''}>
                        {seenUser ? '' : seenUid.charAt(0).toUpperCase()}
                      </Avatar>
                    );
                  })}
                </Tooltip>
              </Avatar.Group>
            )}

          </>
        )}
      </div>
    </WrapperStyled>
  );

}
