import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import UserContext from '../context/UserContext';

export default function Register() {
    const navigate = useNavigate();
    const notyf = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top'
        }
    });

    const { user } = useContext(UserContext);
    console.log(user)

    // State variables
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (
            username !== "" &&
            email !== "" &&
            password !== "" &&
            confirmPassword !== "" &&
            password === confirmPassword
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [username, email, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.message === "Registered successfully") {
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    notyf.success("Registration successful");
                    navigate('/login');

                } else if (data.message === "User email already registered") {
                    notyf.error("User email already registered");

                } else if (data.message === "Invalid email format") {
                    notyf.error("Email Invalid");

                } else if (data.message === "Username already taken") {
                    notyf.error("Username already taken");

                } else if (data.message === "Password must be at least 8 characters") {
                    notyf.error("Password must be at least 8 characters");
                }
            });
    }

    return (
        (user.id !== null) 
        ? 
        <Navigate to="/" /> 
        :
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundImage: 'url()', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            <Row className="w-100 justify-content-center">
                <Col className='col-lg-8'>
                    <Card className="p-4 shadow-lg bg-dark border" style={{ color: 'white', borderRadius: '10px' }}>
                        <Card.Body>
                            <h1 className="text-center mb-4">Sign Up</h1>
                            <Form onSubmit={registerUser}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                {isActive 
                                ? 
                                (
                                    <Button variant="primary" type="submit" className="w-100">
                                        Sign Up
                                    </Button>
                                ) 
                                : 
                                (
                                    <Button variant="danger" type="submit" className="w-100" disabled>
                                        Sign Up
                                    </Button>
                                )}
                            </Form>
                            <p className="text-center mt-3">Already have an account? <Link to="/login" style={{ color: '#0d6efd' }}>Sign in</Link> here</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
