import React, { useContext, useState } from 'react'
import { Form, Input, Modal, message } from 'antd'

import { useForm } from 'antd/es/form/Form';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';


export default function AddRoom() {

    const { isOpenAddRoom, setIsOpenAddRoom } = useContext(AppContext);
    const { user: { uid } } = useContext(AuthContext)
    const [form] = useForm()

    const handleOk = async () => {
        const roomsCollection = collection(db, 'rooms');
        const roomName = form.getFieldValue('name');

        if (roomName) {
            const roomQuery = query(roomsCollection, where('name', '==', roomName));
            const roomQuerySnapshot = await getDocs(roomQuery);

            if (!roomQuerySnapshot.empty) {
                message.error({
                    content: 'Room existed!',
                    'duration': 3
                });
                return;
            }
        }
        else {
            message.error({
                content: 'Input rooms name',
                'duration': 3
            })
            return;
        }

        await addDoc(roomsCollection, {
            ...form.getFieldsValue(),
            members: [uid],
            roomImage:null,
            createdAt: serverTimestamp()
        })
        setIsOpenAddRoom(false);
        form.resetFields(['name', 'description']);
    }

    const handleCancel = () => {
        setIsOpenAddRoom(false);
    }

    return (
        <div>
            <Modal
                title='Create a room'
                open={isOpenAddRoom}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item name='name' label='Room name'>
                        <Input placeholder='Enter room name' />
                    </Form.Item>
                    <Form.Item label='Description' name='description'>
                        <Input.TextArea placeholder='Enter room description' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
