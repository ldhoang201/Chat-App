import React, { useContext } from 'react';
import { Button, Collapse, Typography } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AppContext } from '../../Context/AppProvider';

const PanelStyled = styled(Collapse.Panel)`
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
  const { rooms, setIsOpenAddRoom, setSelectedRoomId } = useContext(AppContext);

  const handleAddRoom = () => {
    setIsOpenAddRoom(true);
  };

  return (
    <Collapse ghost>
      <PanelStyled header='Room List' key='1'>
        {rooms.map((room) => (
          <LinkStyled onClick={() => setSelectedRoomId(room.id)} key={room.id}>
            {room.name}
          </LinkStyled>
        ))}
        <Button type='text' className='add-room' icon={<PlusSquareOutlined />} onClick={handleAddRoom}>
          Add Room
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
