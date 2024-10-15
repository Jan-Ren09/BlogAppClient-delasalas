import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Login() {
    const navigate = useNavigate();
    const notyf = new Notyf({
        duration: 3000, 
        position: {
            x: 'right', 
            y: 'top'    
        }
    });

    const { user, setUser } = useContext(UserContext);
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const [isActive, setIsActive] = useState(true);
    
    // Changed the function declaration from "function" to "const" to maintain consistency.
    const authenticate = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Product user:", data);
            if (data.accessToken) { 
                console.log(data.accessToken);
                localStorage.setItem('token', data.accessToken);
                retrieveUserDetails(data.accessToken);

                setEmail('');
                setPassword('');
                notyf.success(`You are now logged in`);
                navigate('/');
            } else if (data.message === "Invalid password") {
                notyf.error(`Invalid password`);
            } else {
                notyf.error(`${email} does not exist`);
            }
        })
        .catch(error => {
            // Added error handling for the fetch call.
            console.error('Error during login:', error);
            notyf.error('An error occurred during login. Please try again later.');
        });
    };

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}users/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setUser({
                id: data._id,
                email: data.email,
                username: data.username,
                isAdmin: data.isAdmin
            });
        })
        .catch(error => {
            // Added error handling for the fetch call.
            console.error('Error fetching user details:', error);
        });
    };

    useEffect(() => {
        setIsActive(email !== '' && password !== ''); 
    }, [email, password]);

    return (    
        (user.id !== null)
        ?
        <Navigate to="/" />
        :
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <Form 
                onSubmit={authenticate} 
                className='container p-4 border shadow text-light rounded'
            >
                <h1 className="my-3 text-center">Login</h1>
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant={isActive ? "primary" : "danger"} type="submit" id="loginBtn" disabled={!isActive}>
                    Login
                </Button>
                <p className="text-center mt-3">No account yet? <Link to="/register" style={{ color: '#0d6efd' }}>Sign up</Link> here</p>
            </Form>
        </div>
    );
}
