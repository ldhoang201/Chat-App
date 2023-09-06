import { UserAddOutlined, UploadOutlined, MessageOutlined, SmileOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip, Upload, Modal, Mentions, Image } from 'antd';
import React, { useContext, useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config';
import { useForm } from 'antd/es/form/Form';
import useFirestore from '../../hooks/useFirestore';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ChatInfo from './ChatInfo';

const HeaderStyled = styled.div`
      display: flex;
      justify-content: space-between;
      height: 56px;
      padding: 0 16px;
      align-items: center;
      border-bottom: 1px solid rgb(230, 230, 230);

      .header {
            &__info {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            &__title {
              margin: 0;
              font-weight: bold;
            }

            &__description {
              font-size: 12px;
            }
          }
      `;

const ButtonGroupStyled = styled.div`
      display: flex;
      align-items: center;
      margin-right: ${(props) => (props.isChatInfoVisible ? '300px' : '0')};

`;

const WrapperStyled = styled.div`
      height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 0px;
  justify-content: flex-end;
  transition: width 0.3s ease-in-out; /* Add transition for smooth animation */

  /* Conditionally set the width based on isChatInfoVisible state */
  width: ${(props) => (props.isChatInfoVisible ? "calc(100% - 320px)" : "100%")};
`;




const FormStyled = styled(Form)`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 2px 2px 0;
      border: 1px solid rgb(230, 230, 230);
      border-radius: 2px;

      .ant-form-item {
        flex: 1;
        margin-bottom: 0;
      }
      `;

const MessageListStyled = styled.div`
      max-height: 100%;
      overflow-y: auto;
      margin-left:20px;
      overflow-wrap: break-word;
`;


const { Option } = Mentions;

export default function ChatWindown() {

  const { selectedRoom, members, setIsOpenInviteMember } = useContext(AppContext);
  const { user: { uid, photoURL, displayName } } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [isChatInfoVisible, setIsChatInfoVisible] = useState(false);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);
  const [selectedRoomFiles, setSelectedRoomFiles] = useState([]);
  const [form] = useForm();
  const messageListRef = useRef(null);


  const handleInputChange = (value) => {
    setInputValue(value)
  }

  const isImageFile = (file) => {
    return file.type.startsWith('image/');
  };

  const isImageType = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const fileExtension = url
      .substring(0, url.indexOf('?'))
      .substring(url.lastIndexOf('.'))
      .toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const handleOnSubmit = async () => {
    if (inputValue || selectedFile) {
      const messageData = {
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom?.id,
        displayName,
        createdAt: serverTimestamp()
      };


      if (selectedFile) {
        const storageRef = ref(storage, `files/${selectedRoom?.name}/${selectedFile.name}`);
        const metadata = {
          contentType: selectedFile.type,
        };
        await uploadBytes(storageRef, selectedFile, metadata).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        })
          .catch((err) => {
            console.log(err);
          })

        await getDownloadURL(storageRef).then((url) => {
          messageData['fileURL'] = url
        })
          .catch((err) => {
            console.log(err);
          })

        setPreviewVisible(false);
      }

      console.log(messageData);

      await addDoc(collection(db, 'messages'), messageData);

      form.resetFields(['message', 'upload-files']);
      setSelectedFile(null);
    }
  };

  const messagesCondition = useMemo(() => {
    return {
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom?.id
    }
  }, [selectedRoom?.id])

  const messages = useFirestore('messages', messagesCondition)


  const toggleChatInfo = () => {
    setIsChatInfoVisible((prev) => !prev);
  };



  useEffect(() => {
    const RoomImages = [];
    const RoomFiles = [];


    messages.filter((message) => (
      'fileURL' in message && isImageType(message.fileURL)
    ))
      .map((message) => RoomImages.push(message.fileURL))

    setSelectedRoomImages(RoomImages);

    messages.filter((message) => (
      'fileURL' in message && !isImageType(message.fileURL)
    ))
      .map((message) => RoomFiles.push(message.fileURL))

    setSelectedRoomFiles(RoomFiles)

  }, [messages]);


  useEffect(() => {
    if (messageListRef.current) {
      const maxScrollHeight = 500;
      messageListRef.current.scrollTop = Math.max(
        messageListRef.current.scrollHeight,
        maxScrollHeight
      );
    }
  }, [messages, selectedRoom?.id]);



  return (
    <WrapperStyled>
      {
        selectedRoom?.id ?
          (
            <>
              <HeaderStyled>
                <div className='header__info'>
                  <p className='header__title'>
                    {selectedRoom?.name}
                  </p>
                  <span className='header__description'>
                    {selectedRoom?.description}
                  </span>
                </div>
                <ButtonGroupStyled isChatInfoVisible={isChatInfoVisible}>
                  <Button
                    icon={<UserAddOutlined />}
                    type='text'
                    onClick={() => setIsOpenInviteMember(true)}
                  >
                    Invite
                  </Button>
                  {
                    members.map(member => (
                      member.uid !== uid
                      &&
                      (
                        <Avatar.Group size='small' maxCount={2} key={member.id}>
                          <Tooltip title={member.displayName}>
                            <Avatar src={member.photoURL}></Avatar>
                          </Tooltip>
                        </Avatar.Group>
                      )

                    ))
                  }
                  <Button
                    icon={<InfoCircleTwoTone />}
                    size='large'
                    type='text'
                    onClick={toggleChatInfo}
                  />
                </ButtonGroupStyled>
              </HeaderStyled>
              <ContentStyled isChatInfoVisible={isChatInfoVisible}>


                <MessageListStyled ref={messageListRef}>
                  {
                    messages.map((message) => (
                      <Message
                        key={message.id}
                        text={message.text}
                        photoURL={message.photoURL}
                        displayName={message.displayName}
                        createdAt={message.createdAt}
                        fileURL={message.fileURL}
                        uid={message.uid}
                      />
                    ))
                  }
                </MessageListStyled>
                <FormStyled form={form}>
                  <Form.Item name='upload-files' style={{ flex: 'none' }}>
                    <Upload
                      accept='image/*, .pdf, .doc, .docx, .txt'
                      showUploadList={false}
                      customRequest={({ file }) => {
                        setSelectedFile(file);
                      }}
                      onChange={(info) => {
                        console.log('File onChange event:', info);
                        setPreviewVisible(true);
                      }}
                    >
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </Form.Item>
                  <Form.Item name='message' style={{ flex: 1, marginBottom: 0 }}>
                    <Mentions
                      value={inputValue}
                      onChange={handleInputChange}
                      onPressEnter={handleOnSubmit}
                      style={{ flex: 1, marginBottom: 0 }}
                      placeholder="Nhập tin nhắn"
                      options={
                        members.filter(member => member.uid !== uid)
                          .map(member => ({
                            value: member.displayName,
                            label: member.displayName
                          }))
                      }
                    >
                    </Mentions>
                  </Form.Item>

                  <Button
                    type='primary'
                    onClick={handleOnSubmit}
                  >
                    Gửi
                  </Button>
                </FormStyled>

                <Modal
                  open={previewVisible}
                  onCancel={() => setPreviewVisible(false)}
                  footer={[
                    <Button key="submit" type="primary" onClick={handleOnSubmit} style={{ alignSelf: 'center' }}>
                      Gửi
                    </Button>,
                  ]}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {selectedFile && isImageFile(selectedFile) ? (
                    <Image
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '60%', marginTop: '20px', display: 'block', borderRadius: '20px' }}
                    />
                  ) : (
                    <div>
                      <p>Tên tệp: {selectedFile?.name}</p>
                      <p>Kích thước: {selectedFile?.size} bytes</p>
                    </div>
                  )}
                </Modal>


              </ContentStyled>
              {isChatInfoVisible && (
                <ChatInfo
                  room={{
                    avatar: selectedRoom?.imageURL,
                    name: selectedRoom?.name,
                    description: selectedRoom?.description,
                    sharedImages: selectedRoomImages,
                    sharedFiles: selectedRoomFiles,
                    members: members
                  }}

                />
              )}
            </>
          )
          :
          <Alert
            message='Select a room to chat'
            type='info'
            showIcon
            closable
            style={{ margin: 5 }}
          />

      }

    </WrapperStyled >
  )
}
