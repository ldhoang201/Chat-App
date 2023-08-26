import React, { useContext, useMemo } from 'react'
import { Button, Collapse, Typography } from 'antd'
import { PlusSquareOutlined } from '@ant-design/icons';
import { styled } from 'styled-components';
import useFirestore from '../../hooks/useFirestore';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';

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

  const { rooms, setIsOpenAddRoom } = useContext(AppContext);


  const handleAddRoom = () => {
    setIsOpenAddRoom(true);
  }

  return (
    <Collapse ghost>
      <PanelStyled header='danh sach cach phong' key='1'>
        {
          rooms.map((room) =>
            <LinkStyled key={room.id}>{room.name}</LinkStyled>
          )
        }
        <Button type='text'
          className='add-room'
          icon={<PlusSquareOutlined />}
          onClick={handleAddRoom}
        >Them phong
        </Button>
      </PanelStyled>
    </Collapse>
  )
}
