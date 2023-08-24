import { UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip } from 'antd';
import React from 'react'
import styled from 'styled-components';

export default function ChatWindown() {

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



    return (
        <div>
            <HeaderStyled>
                <div className='header__info'>
                    <p className='header__title'>
                        Room1
                    </p>
                    <span className='header__description'>
                        Day la room 1
                    </span>
                </div>
                <ButtonGroupStyled>
                    <Button icon={<UserAddOutlined />}>Moi</Button>
                    <Avatar.Group size='small' maxCount={2}>
                        <Tooltip title='A'>
                            <Avatar>A</Avatar>
                        </Tooltip>
                        <Tooltip title='B'>
                            <Avatar>B</Avatar>
                        </Tooltip>
                        <Tooltip title='C'>
                            <Avatar>C</Avatar>
                        </Tooltip>
                    </Avatar.Group>
                </ButtonGroupStyled>
            </HeaderStyled>
            <ContentStyled>

            </ContentStyled>
        </div>
    )
}
