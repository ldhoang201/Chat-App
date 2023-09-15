import React, { useContext } from 'react';
import { Button, Collapse, Typography } from 'antd';
import { PlusCircleFilled, PlusCircleTwoTone, PlusSquareOutlined } from '@ant-design/icons';
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
  transition: color 0.3s ease;
  padding: 8px; 
  border-radius: 4px; 
  
  &:hover {
    color: #1890ff;
  }
  
  &.active-room { 
    background-color: #1890ff; 
    border: 1px solid #1890ff; 
    color: white; 
    width: 50%;
  }
`;


export default function RoomList() {
  const { rooms, setIsOpenAddRoom, setSelectedRoomId,selectedRoomId } = useContext(AppContext);

  const handleAddRoom = () => {
    setIsOpenAddRoom(true);
  };

  return (

    <Collapse ghost>
      <PanelStyled header='Room List' key='1'>
        {rooms.map((room) => (
          <LinkStyled 
          onClick={() => setSelectedRoomId(room.id)} 
          key={room.id}
          className={room.id === selectedRoomId ? 'active-room' : ''}
          >
            {room.name}
          </LinkStyled>
        ))}
        <Button type='text' className='add-room' icon={<PlusCircleTwoTone/>} onClick={handleAddRoom}>
          Add Room
        </Button>
      </PanelStyled>
    </Collapse>
  );
}
