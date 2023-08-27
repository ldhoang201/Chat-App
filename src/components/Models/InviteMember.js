import React, { useContext, useMemo, useState } from 'react'
import { Avatar, Form, Input, Modal, Select, Spin, message } from 'antd'
import { useForm } from 'antd/es/form/Form';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { db } from '../../firebase/config';
import { debounce } from 'lodash'
import { updateDoc, getDocs, query, where, collection, orderBy, limit, doc, getDoc } from 'firebase/firestore'


function DebounceSelect({ fetchOption, debouceTimeout = 300, ...props }) {
    const [fetching, setIsFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setIsFetching(true);

            fetchOption(value).then(newOption => {
                setOptions(newOption);
                setIsFetching(false);
            })
        }
        return debounce(loadOptions, debouceTimeout);
    }, [debouceTimeout, fetchOption])
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {
                options.map(option => (
                    <Select.Option key={option.value}
                        value={option.value}
                        title={option.label}
                    >
                        <Avatar size='small' src={option.photoURL}>
                            {option.photoURL ? null : option.label?.charAt(0).toUpperCase()}
                        </Avatar>
                        {`${option.label}`}
                    </Select.Option>
                ))
            }
        </Select>

    )
}

const fetchUserList = async (search) => {
    const q = query(
        collection(db, 'users'),
        where('keywords', 'array-contains', search),
        orderBy('displayName'),
        limit(20)
    );

    const querySnapshot = await getDocs(q);

    const userList = [];
    querySnapshot.forEach((doc) => {
        userList.push({
            value: doc.data().uid,
            label: doc.data().displayName,
            photoURL: doc.data().photoURL
        });
    });

    return userList;
}


export default function InviteMember() {

    const { isOpenInviteMember, setIsOpenInviteMember, selectedRoom, selectedRoomId } = useContext(AppContext);
    const { user: { uid } } = useContext(AuthContext);
    const [value, setValue] = useState([]);
    const [form] = useForm();

    const handleOk = () => {

        const roomsCollect = collection(db, 'rooms');
        const roomRef = doc(roomsCollect, selectedRoomId);

        updateDoc(roomRef, {
            members: [...selectedRoom.members, ...value.map(val => val.value)]
        })

        setIsOpenInviteMember(false);
    }

    const handleCancel = () => {
        setIsOpenInviteMember(false);
    }

    return (
        <div>
            <Modal
                title='Moi them thanh vien'
                open={isOpenInviteMember}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        name='search-user'
                        label='Ten cac thanh vien'
                        value={value}
                        placeholder="Nhap ten thanh vien"
                        fetchOption={fetchUserList}
                        onChange={newValue => setValue(newValue)}
                        style={{ width: '100%' }}
                    />

                </Form>
            </Modal>
        </div>
    )
}
