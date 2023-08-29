import React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { signInWithPopup } from "firebase/auth";
import { auth, db, fbProvider, ggProvider } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateKeywords } from '../../firebase/service';

const { Title } = Typography;


export default function Login() {

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
                createdAt: serverTimestamp()
            })
        }
    }

    return (
        <div>
            <Row justify='center' style={{ height: '800' }}>
                <Col span={8}>
                    <Title style={{ textAlign: 'center' }} level={3}>Fun Chat</Title>
                    <Button style={{ width: '100%', marginBottom: 5 }}
                        onClick={handleGoogleLogin}
                    >
                        Dang nhap bang Google
                    </Button>
                    <Button style={{ width: '100%' }}>
                        Dang nhap bang Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
