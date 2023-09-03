import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Avatar, Modal, Image, Upload, message, Button, Spin } from 'antd';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { EditOutlined, CameraOutlined, UploadOutlined } from '@ant-design/icons';
import { AppContext } from '../../Context/AppProvider';

const ChatInfoWrapper = styled.div`
  background-color: #f0f0f0;
  width: 280px;
  height: 100vh;
  overflow-y: auto;
  position: fixed;
  right: 0;
  top: 0;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
`;

const RoomImage = styled(Avatar)`
  cursor: pointer;
  width: 120px !important;
  height: 120px !important;
  font-size: 36px !important;
`;

const RoomName = styled.h2`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const RoomDescription = styled.p`
  margin: 0;
  font-size: 14px;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageItem = styled.div`
  width: calc(33.33% - 10px);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  .img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ChatInfo = ({ room }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newRoomImage, setNewRoomImage] = useState(room.roomImage || '');
    const [uploading, setUploading] = useState(false);
    const { selectedRoom } = useContext(AppContext);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleImageClick = () => {
        showModal();
    };

    const handleImageChange = async (info) => {
        if (info.file.status === 'done') {
            message.success(`Update Room Image successfully.`);
        } else if (info.file.status === 'error') {
            message.error(`Update Room Image failed.`);
        }
    };

    const customRequest = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        const storageRef = ref(storage, `images/roomImages/${selectedRoom?.name}/${file.name}`);

        try {
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);
            onSuccess();
            setNewRoomImage(imageUrl);
            updateRoomImage(imageUrl);
            setUploading(false);
        } catch (error) {
            onError(error);
            setUploading(false);
        }
    };

    const updateRoomImage = async (imageUrl) => {
        const roomRef = doc(db, 'rooms', selectedRoom?.id);

        try {
            await updateDoc(roomRef, { imageURL: imageUrl });
            // Cập nhật thành công, tôi không cần thực hiện bất kỳ xử lý nào khác ở đây
        } catch (error) {
            console.error('Lỗi khi cập nhật hình ảnh phòng:', error);
            message.error('Có lỗi xảy ra khi cập nhật hình ảnh phòng');
        }
    };

    return (
        <ChatInfoWrapper>
            <Header>
                <RoomImage
                    size={120}
                    src={room.avatar ? room.avatar : room.name?.charAt(0).toUpperCase()}
                    icon={<EditOutlined onClick={handleImageClick} />}
                />
                <RoomName>{room.name}</RoomName>
                <RoomDescription>{room.description}</RoomDescription>
            </Header>
            <h3>Images Shared in Chat:</h3>
            <ImageList>
                {room.sharedImages.map((item, index) => (
                    <ImageItem key={index}>
                        <Image className="img" src={item} />
                    </ImageItem>
                ))}
            </ImageList>
            <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                title="Cập Nhật Ảnh Phòng"
                footer={null}
                centered
            >
                <ModalContentWrapper>
                    {uploading ? (
                        <LoadingWrapper>
                            <Spin size="large" />
                        </LoadingWrapper>
                    ) : (
                        <>
                            <Image
                                width={200}
                                height={200}
                                src={newRoomImage || ''}
                                style={{ marginBottom: '16px' }}
                                onClick={handleImageClick}
                            />
                            <Upload
                                customRequest={customRequest}
                                onChange={handleImageChange}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} size="large">
                                </Button>
                            </Upload>
                        </>
                    )}
                </ModalContentWrapper>
            </Modal>
        </ChatInfoWrapper>
    );
};

export default ChatInfo;
