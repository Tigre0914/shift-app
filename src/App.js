import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import EmployeeManagement from './EmployeeManagement';
import ShiftCreator from './ShiftCreator';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // 後で作成するカスタムCSS

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">シフト作成アプリ</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">スタッフ・店舗管理</Nav.Link>
              <Nav.Link as={Link} to="/shift">シフト作成</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<EmployeeManagement />} />
        <Route path="/shift" element={<ShiftCreator />} />
      </Routes>
    </Router>
  );
}

export default App;
