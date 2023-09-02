// ChatInfo.js

import React from 'react';
import styled from 'styled-components';
import { Avatar, Image, List } from 'antd';

const ChatInfoWrapper = styled.div`
  padding: 16px;
  background-color: #f0f0f0;
  width: 300px;
  height: 100%;
  overflow-y: auto;
`;

const ChatInfo = ({ room }) => {
    return (
        <ChatInfoWrapper>
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <Avatar size={64} src={room.roomImage ? room.roomImage : ''} />
                <h2>{room.roomName}</h2>
                <p>{room.roomDescription}</p>
            </div>
            <h3>Images Shared in Chat:</h3>
            <List
                dataSource={room.images}
                renderItem={(item) => (
                    <List.Item>
                        <Image src={item} width={50} />
                    </List.Item>
                )}
            />
        </ChatInfoWrapper>
    );
};

export default ChatInfo;
