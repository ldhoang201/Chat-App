import { UserAddOutlined, UploadOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip, Upload, Modal } from 'antd';
import React, { cloneElement, useContext, useMemo, useState } from 'react'
import styled from 'styled-components';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config';
import { useForm } from 'antd/es/form/Form';
import useFirestore from '../../hooks/useFirestore';

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
margin-left:20px
`;


export default function ChatWindown() {

  const { selectedRoom, members, setIsOpenInviteMember } = useContext(AppContext);
  const { user: { uid, photoURL, displayName } } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [form] = useForm()

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleOnSubmit = async () => {
    if (inputValue || image) {
      const messageData = {
        text: inputValue,
        uid,
        photoURL,
        roomId: selectedRoom?.id,
        displayName,
        createdAt: serverTimestamp()
      };


      if (image) {
        const storageRef = ref(storage, 'images/' + image.name);
        const metadata = {
          contentType: 'image/*',
        };
        await uploadBytes(storageRef, image, metadata).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        })
          .catch((err) => {
            console.log(err);
          })

        await getDownloadURL(storageRef).then((url) => {
          messageData['imageURL'] = url
        })
          .catch((err) => {
            console.log(err);
          })

        setImagePreviewVisible(false);
      }

      console.log(messageData);

      await addDoc(collection(db, 'messages'), messageData);

      form.resetFields(['message', 'image']);
      setImage(null);
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
                <ButtonGroupStyled>
                  <Button
                    icon={<UserAddOutlined />}
                    type='text'
                    onClick={() => setIsOpenInviteMember(true)}
                  >
                    Moi
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
                </ButtonGroupStyled>
              </HeaderStyled>
              <ContentStyled>
                <MessageListStyled>
                  {
                    messages.map((message) => (
                      <Message
                        key={message.id}
                        text={message.text}
                        photoURL={message.photoURL}
                        displayName={message.displayName}
                        createdAt={message.createdAt}
                        imgUrl={message.imageURL}
                        uid={message.uid}
                      />
                    ))
                  }
                </MessageListStyled>
                <FormStyled form={form}>
                  <Form.Item name='message'>
                    <Input
                      onChange={handleInputChange}
                      onPressEnter={handleOnSubmit}
                      bordered={false}
                      autoComplete='off'
                      placeholder='Nhập tin nhắn' />
                  </Form.Item>
                  <Form.Item name='image'>
                    <Upload
                      accept='image/*'
                      showUploadList={false}
                      customRequest={({ file }) => {
                        setImage(file);
                      }}
                      onChange={(info) => {
                        console.log('File onChange event:', info);
                        setImagePreviewVisible(true);
                      }}
                    >
                      <Button icon={<UploadOutlined />} />
                    </Upload>
                  </Form.Item>


                  <Button
                    type='primary'
                    onClick={handleOnSubmit}
                  >
                    Gửi
                  </Button>
                </FormStyled>

                <Modal
                  open={imagePreviewVisible}
                  onCancel={() => setImagePreviewVisible(false)}
                  footer={[
                    <Button key="submit" type="primary" onClick={handleOnSubmit}>
                      Gửi
                    </Button>,
                  ]}
                >
                  {image && <img src={URL.createObjectURL(image)} alt="Preview" style={{ maxWidth: '100%' }} />}
                </Modal>

              </ContentStyled>
            </>
          )
          :
          <Alert
            message='Hay chon phong'
            type='info'
            showIcon
            closable
            style={{ margin: 5 }}
          />

      }

    </WrapperStyled >
  )
}
