import React from 'react'
import { Button, Collapse, Typography } from 'antd'
import {PlusSquareOutlined }from '@ant-design/icons';
import { styled } from 'styled-components';

const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;


export default function RoomList() {
    return (
        <Collapse ghost>
            <PanelStyled header='danh sach cach phong' key='1'>
                <LinkStyled>Room 1</LinkStyled>
                <LinkStyled>Room 1</LinkStyled>
                <LinkStyled>Room 1</LinkStyled>
                <Button type='text' className='add-room' icon={<PlusSquareOutlined/>}>Them phong</Button>
            </PanelStyled>
        </Collapse>
    )
}
