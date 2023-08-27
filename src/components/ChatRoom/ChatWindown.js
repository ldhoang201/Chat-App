import { UserAddOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import React, { useContext, useMemo } from 'react'
import styled from 'styled-components';
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';

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
padding: 11px;
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
`;


export default function ChatWindown() {

  const { selectedRoom, members, setIsOpenInviteMember } = useContext(AppContext);



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
                      <Avatar.Group size='small' maxCount={2} key={member.id}>
                        <Tooltip title={member.displayName}>
                          <Avatar src={member.photoURL}></Avatar>
                        </Tooltip>
                      </Avatar.Group>
                    ))
                  }
                </ButtonGroupStyled>
              </HeaderStyled>
              <ContentStyled>
                <MessageListStyled>
                  <Message text='alo' displayName='hoang' createdAt={1692976074} />
                </MessageListStyled>
                <FormStyled>
                  <Form.Item>
                    <Input bordered={false} autoComplete='off' placeholder='Nhap tin nhan' />
                  </Form.Item>
                  <Button type='primary'>Gui</Button>
                </FormStyled>
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

    </WrapperStyled>
  )
}
