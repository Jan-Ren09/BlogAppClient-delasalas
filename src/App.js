import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from './components/AppNavBar';
// import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
// import Profile from './pages/Profile';

function App() {
  
  const [user, setUser] = useState({
    id: null,
    username: null,
    email: null,
    isAdmin: false
  });

  function unsetUser() {
    localStorage.clear();
    setUser({ 
      id: null,
      username: null,
      email: null,
      isAdmin: false
    });
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (!data.message) {
                setUser({
                    id: data._id,
                    username: data.username,
                    email: data.email,
                    isAdmin: data.isAdmin
                });
            } else {
                console.log(data);
                setUser({
                    id: null,
                    username: null,
                    email: null,
                    isAdmin: false
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            setUser({
                id: null,
                username: null,
                email: null,
                isAdmin: false
            });
        });
    }
}, []);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  return (
    <div className='bg-dark text-light'>
      <UserProvider value={{ user, setUser, unsetUser }} >
        <Router >
          <AppNavBar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="*" element={<ErrorPage />} /> */}
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Container>
        </Router> 
      </UserProvider>
    </div>
  );
}

export default App;
