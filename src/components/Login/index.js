import React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Typography, Form, message, Input } from 'antd';
import { signInWithPopup } from "firebase/auth";
import { auth, db, fbProvider, ggProvider } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc, onSnapshot, where, query } from 'firebase/firestore';
import { generateKeywords } from '../../firebase/service';
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Title } = Typography;
const { Item } = Form;

const FormContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
    width: 75%;
    margin-bottom: 16px;
    margin-left: 25px
`;

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = async () => {
        try {

            await signInWithEmailAndPassword(auth, email, password);
            message.success('Login successfully.');
        } catch (error) {
            message.error('Login failed.');
        }
    };



    const handleGoogleLogin = async () => {
        const { _tokenResponse, user } = await signInWithPopup(auth, ggProvider);
        console.log(user);
        if (_tokenResponse.hasOwnProperty('isNewUser') && _tokenResponse.isNewUser) {
            const userCollection = collection(db, 'users');
            await addDoc(userCollection, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: _tokenResponse.providerId,
                keywords: generateKeywords(user.displayName),
                isOnline: true,
                createdAt: serverTimestamp()
            })
        }
        else {
            const userCollection = collection(db, 'users');
            const q = query(userCollection, where('uid', '==', user.uid));

            onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                if (!data[0].isOnline) {
                    updateDoc(doc(db, 'users', data[0].id), {
                        isOnline: true
                    })
                }
            })
        }
        message.success('Login successfully.');
    }

    return (
        <div>
            <Row justify='center' style={{ height: '800' }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>Welcome to Chat App</Title>
                    <FormContainer>
                        <Form>
                            <InputContainer>
                                <Form.Item label="Email" style={{ width: '90%' }}>
                                    <Input
                                        style={{ marginLeft: '28px' }}
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Item>
                            </InputContainer>
                            <InputContainer>
                                <Form.Item label="Password">
                                    <Input.Password
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Item>
                            </InputContainer>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type="primary" onClick={handleEmailLogin}>
                                    Login
                                </Button>
                            </Form.Item>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <span>Not have account yet? </span>
                                <Link to="/signup">Sign up now</Link>
                            </Form.Item>
                        </Form>

                        <Button style={{ width: '75%', marginBottom: 5, marginLeft: '50px' }}
                            onClick={handleGoogleLogin}
                        >
                            Login with <GoogleOutlined />
                        </Button>
                    </FormContainer>
                    {/* <Button style={{ width: '75%', marginLeft: '50px' }}>
                        Login with <FacebookOutlined />
                    </Button> */}
                </Col>
            </Row>
        </div>
    );
}

