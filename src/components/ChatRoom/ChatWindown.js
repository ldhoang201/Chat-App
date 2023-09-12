import { UserAddOutlined, UploadOutlined, MessageOutlined, SmileOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip, Upload, Modal, Mentions, Image, notification, Popover } from 'antd';
import React, { useContext, useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDoc, collection, serverTimestamp, query, where, orderBy, limit, onSnapshot, getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config';
import { useForm } from 'antd/es/form/Form';
import useFirestore from '../../hooks/useFirestore';
import ChatInfo from './ChatInfo';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

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
  const { setSelectedRoomId } = useContext(AppContext);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    console.log(inputValue);
  }, [inputValue])




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

  const markMessageAsSeen = async (messageId, seenUid) => {
    const messageRef = doc(db, 'messages', messageId);

    // Get the message data from Firestore
    const messageDoc = await getDoc(messageRef);

    if (messageDoc.exists()) {
      // Check if the UID of the user has already been added to the "seenBy" list
      const seenBy = messageDoc.data().seenBy || [];

      if (!seenBy.includes(seenUid)) {
        // If the UID is not in the list, add it
        seenBy.push(seenUid);

        // Update the "seen" status and the "seenBy" list in the message document
        await updateDoc(messageRef, {
          seenBy: seenBy,
        });
      }
    }
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prevState) => !prevState);
  };



  const handleOnSubmit = async () => {
    if (inputValue || selectedFile) {
      const messageData = {
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom?.id,
        displayName,
        createdAt: serverTimestamp(),
        seenBy: [],
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

      // console.log(messageData);

      const newMessageRef = await addDoc(collection(db, 'messages'), messageData);

      // Mark the newly sent message as seen by the current user
      markMessageAsSeen(newMessageRef.id, uid);

      form.resetFields(['message', 'upload-files']);
      setInputValue('');
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

  const getAllMessages = useMemo(async () => {
    const messagesRef = collection(db, 'messages');
    const roomMessagesQuery = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
    );

    onSnapshot(roomMessagesQuery, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllMessages(allMessages)
    })

    return allMessages;
  }, [addDoc, db]);

  console.log(allMessages);



  const toggleChatInfo = () => {
    setIsChatInfoVisible((prev) => !prev);
  };



  useEffect(() => {

    const messagesToUpdate = messages.filter(
      (message) => !message.seenBy.includes(uid)
    );

    messagesToUpdate.forEach(async (message) => {
      // Mark each message as seen by the current user
      markMessageAsSeen(message.id, uid);
    });
  }, [selectedRoom?.id]);



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

  useEffect(() => {
    if (selectedRoom) {
      const messagesRef = collection(db, 'messages');
      const roomMessagesQuery = query(
        messagesRef,
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const unsubscribe = onSnapshot(roomMessagesQuery, (querySnapshot) => {
        querySnapshot.forEach(async (document) => {
          const newMessage = document.data();


          if (newMessage.roomId !== selectedRoom.id && newMessage.uid !== uid) {
            const roomRef = doc(db, 'rooms', newMessage.roomId);
            const roomSnapshot = await getDoc(roomRef);
            const roomData = roomSnapshot.data();
            const notifiKey = `new-message-${roomData.id}`

            notification.open({
              key: notifiKey,
              message: `${newMessage.displayName} to ${roomData.name} : ${newMessage.text}`,
              duration: 2,
              onClick: () => {
                setSelectedRoomId(newMessage.roomId);
                notification.destroy(notifiKey);
              }
            });
          }
        });
      });

      return () => {

        unsubscribe();
      };
    }
  }, [addDoc, db]);

  const [mostRecentMessageTimestamp, setMostRecentMessageTimestamp] = useState(null);

  useEffect(() => {
    // Find the most recent message in the messages array
    const latestMessage = messages.reduce((latest, message) => {
      const messageTimestamp = message.createdAt?.seconds || 0;
      return messageTimestamp > (latest?.createdAt?.seconds || 0) ? message : latest;
    }, null);

    // Update the mostRecentMessageTimestamp
    if (latestMessage) {
      setMostRecentMessageTimestamp(latestMessage.createdAt?.seconds);
    }
  }, [messages]);


  const seenListWithoutSender = (seenBy) => {
    return seenBy.filter((seenUid) => seenUid !== uid)
  }

  useEffect(() => {
    if (messages) {
      // Assuming 'members' is an array of members in the room
      members.forEach((member) => {
        // Find the most recent seen message for the current member (excluding their own messages)
        const mostRecentSeenMessage = messages
          .filter((message) => message.uid !== member.uid && message.seenBy.includes(member.uid))
          .reduce((mostRecent, message) => {
            return mostRecent.createdAt.seconds > message.createdAt.seconds ? mostRecent : message;
          }, { createdAt: { seconds: 0 } });

        if (mostRecentSeenMessage.createdAt.seconds > 0) {
          // Display the most recent seen message for the current user
          console.log(`Most recent seen message for ${member.displayName}:`, mostRecentSeenMessage);
          console.log(`Seen list for ${member.displayName}:`, mostRecentSeenMessage.seenBy.filter((seenUid) => seenUid !== member.uid));
        } else {
          console.log(`No seen message available for ${member.displayName}.`);
        }
      });


    }
  }, [])


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
                  {messages.map((message) => (
                    <Message
                      key={message.id}
                      text={message.text}
                      photoURL={message.photoURL}
                      displayName={message.displayName}
                      createdAt={message.createdAt}
                      fileURL={message.fileURL}
                      uid={message.uid}
                      isLatest={message.createdAt?.seconds === mostRecentMessageTimestamp}
                      seenList={seenListWithoutSender(message.seenBy)}
                    />
                  ))}
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
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Mentions
                        value={inputValue}
                        onChange={handleInputChange}
                        onPressEnter={handleOnSubmit}
                        style={{ flex: 1, marginBottom: 0 }}
                        placeholder="Nhập tin nhắn"
                      >
                        {members
                          .filter((member) => member.uid !== uid)
                          .map((member) => (
                            <Mentions.Option
                              key={member.uid}
                              value={`${member.displayName}`} // Mention format
                            >
                              <Avatar src={member.photoURL} size={24} style={{ marginRight: 8 }} />
                              {member.displayName}
                            </Mentions.Option>
                          ))}
                      </Mentions>
                      <Popover
                        content={
                          <Picker
                            data={data}
                            onEmojiSelect={(emoji) => {
                              setInputValue(inputValue + emoji.native);
                            }}
                          />
                        }
                        trigger="click" // Change to 'hover' if you prefer hover behavior
                        placement="top" // Adjust placement as needed
                        open={isEmojiPickerVisible}
                        onOpenChange={setIsEmojiPickerVisible}
                        style={{ position: 'absolute', right: 0, top: '100%' }}
                      >
                        <Button icon={<SmileOutlined />} type="text" style={{ marginLeft: 8 }} />
                      </Popover>
                    </div>

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
