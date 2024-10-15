import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

import { CgProfile } from "react-icons/cg";

export default function AppNavbar() {
  const { user } = useContext(UserContext);


  return (
    <Navbar expand="lg" className="bg-dark navbar-dark border-bottom shadow rounded-4" sticky="top">
      <Container>
      <img src='/images/transparent logo.png' alt="" style={{ width: '3rem', height: 'auto' }} className='mb-2'/>
        <Navbar.Brand as={NavLink} to="/">Post & Roast</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {(user.id !== null) ? 
              user.isAdmin 
                ? <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                : <>
                    <Nav.Link as={NavLink} to="/profile"><CgProfile size={18} /></Nav.Link>
                    <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                  </>
              : <>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
