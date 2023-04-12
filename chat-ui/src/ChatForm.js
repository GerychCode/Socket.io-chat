import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { io } from "socket.io-client";

const ChatForm = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [username, setUsername] = useState('');
    const [connection, setconnection] = useState(0);
    const messagesContainerRef = useRef(null);
    const socketRef = useRef(null);
    const options = {
        "force new connection": true,
        reconnectionAttempts: "Infinity",
        timeout : 10000,
        transports : ["websocket"]
    }
    useEffect(() => {
        socketRef.current = io('localhost:3001', options);
        socketRef.current.on('client-get-msg', (message) => {
            setMessages([...messages, message]);
        });
        socketRef.current.on('client-get-connection', (count) => setconnection(count))
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        return () => {
            socketRef.current.disconnect();
        };
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(username.trim() && inputText.trim()) {
            const newMessage = {
                name: username,
                text: inputText,
            };
            socketRef.current.emit("server-get-msg", newMessage);
            setInputText('');
        }
    };
    return (
        <Container style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h1>Чат</h1>
            <h5>Пользователей онлайн: {connection}</h5>
            <Container style={{ flex: '1', overflowY: 'auto', maxHeight: '70vh' }} ref={messagesContainerRef}>
                <ListGroup>
                    {messages.map((message, index) => (
                        <ListGroup.Item key={index}>
                            <strong>{message.name}: </strong>
                            {message.text}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={4}>
                        <Form.Group controlId="usernameInput">
                            <Form.Label>Ник</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите ник..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group controlId="messageInput">
                            <Form.Label>Сообщение</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите сообщение..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-2">
                    Отправить
                </Button>
            </Form>
        </Container>
    );
};

export default ChatForm;
