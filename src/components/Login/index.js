import React from 'react';
import { useState, useEffect } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import { signInWithPopup } from "firebase/auth";
import { auth, fbProvider, ggProvider } from '../firebase/config';

const { Title } = Typography;


export default function Login() {

    const handleGoogleLogin = () => {
        signInWithPopup(auth, ggProvider); 
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
