import React, { useState } from 'react';
import { Row, Col, Button, Typography, Input, Form, message, Upload, Spin } from 'antd';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { storage, db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { generateKeywords } from '../../firebase/service';
import { useForm } from 'antd/es/form/Form';

const { Title } = Typography;
const { Item } = Form;

const SignUpContainer = styled.div`
    // display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const FormContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
`;

const InputContainer = styled.div`
    width: 100%;
    margin-bottom: 16px;
`;

const SignUpButton = styled(Button)`
    width: 100%;
    margin-top: 16px;
`;

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [userPhotoURL, setUserPhotoURL] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form] = useForm();


    const customRequest = async ({ file, onSuccess, onError }) => {
        setUploading(true);
        const storageRef = ref(storage, `images/users/${username}/${file.name}`);

        try {
            await uploadBytes(storageRef, file);
            const imageUrl = await getDownloadURL(storageRef);
            setUserPhotoURL(imageUrl);
            onSuccess();
            setUploading(false);
            console.log(form.getFieldsValue());
        } catch (error) {
            onError(error);
            setUploading(false);
        }
    };

    const handleRegister = async () => {
        try {
            setLoading(true); // Start loading

            // Create a new user with email and password
            await createUserWithEmailAndPassword(auth, email, password);

            // Get the user's UID
            console.log(username)
            console.log(userPhotoURL)

            await updateProfile(auth.currentUser, { displayName: username, photoURL: userPhotoURL });

            console.log(auth.currentUser);

            // // Store the user's profile data in Firestore
            await addUserProfileToFirestore(auth.currentUser.uid, username, userPhotoURL);

            setLoading(false); // Stop loading
            message.success('Sign up successfully.');
        } catch (error) {
            setLoading(false); // Stop loading
            message.error('Sign up failed.');
        }

        // console.log(form.getFieldsValue());
    };

    const addUserProfileToFirestore = async (uid, displayName, photoURL) => {
        try {
            const usersCollection = collection(db, 'users');
            await addDoc(usersCollection, {
                uid,
                displayName,
                photoURL,
                email,
                keywords: generateKeywords(displayName),
                providerId: auth.currentUser.providerId,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error adding user profile to Firestore:', error);
        }
    };

    const handleImageUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            setImageFile(info.file.originFileObj);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    return (
        <SignUpContainer>
            <Row justify='center'>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>
                        Create an account
                    </Title>
                    <FormContainer>
                        <Form form={form}>
                            <InputContainer>
                                <Form.Item label="Email" name='email'>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Item>
                            </InputContainer>
                            <InputContainer>
                                <Form.Item label="Password" name='password'>
                                    <Input.Password
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Item>
                            </InputContainer>
                            <InputContainer>
                                <Form.Item label="Username" name='username'>
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Item>
                            </InputContainer>
                            <InputContainer>
                                <Form.Item label="User Photo" name='photoURL'>
                                    <Upload
                                        customRequest={customRequest}
                                        onChange={handleImageUpload}
                                        showUploadList={false}
                                    >
                                        {uploading ? (
                                            <Spin />
                                        ) : (
                                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                                        )}
                                    </Upload>
                                </Form.Item>
                            </InputContainer>
                            <Form.Item>
                                <SignUpButton
                                    type="primary"
                                    onClick={handleRegister}
                                    loading={loading}
                                >
                                    Sign Up
                                </SignUpButton>
                            </Form.Item>
                        </Form>
                    </FormContainer>
                </Col>
            </Row>
        </SignUpContainer>
    );
}
