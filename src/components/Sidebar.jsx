import React, { useState } from 'react';
import { Accordion, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  return (
    <div className={`sidebar bg-white d-flex flex-column shadow-sm ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo p-3 d-flex align-items-center justify-content-between">
        <img src="../assets/AppIcon.svg" alt="logo" style={{ height: 28 }} />
        <button className="btn btn-sm toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      <div className="section-title px-3 text-muted small label-text">Analyze</div>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/dashboard" className="nav-item custom-link" active={location.pathname === "/dashboard"}>
          <i className="bi bi-speedometer2 me-2" />
          <span className="label-text">Dashboard</span>
        </Nav.Link>

        <Nav.Link as={Link} to="/live-feed" className="nav-item custom-link" active={location.pathname === "/live-feed"}>
          <span className="dot me-2" />
          <span className="label-text">Live Feed</span>
        </Nav.Link>

        <Accordion activeKey={open ? '0' : null} flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header onClick={() => setOpen(!open)}>
              <i className="bi bi-journal-text me-2" />
              <span className="label-text timesheets">Timesheets</span>
            </Accordion.Header>
            <Accordion.Body className="p-0 ps-4">
              <Nav className="flex-column">
                {[
                  ['daily', 'D', 'Daily'],
                  ['weekly', 'W', 'Weekly'],
                  ['bi-weekly', 'B', 'Bi-Weekly'],
                  ['monthly', 'M', 'Monthly'],
                  ['custom', 'C', 'Custom'],
                  ['approval', 'A', 'Approval'],
                  ['work-notes', 'W', 'Work Notes'],
                ].map(([path, icon, label]) => (
                  <Nav.Link
                    key={path}
                    as={Link}
                    to={`/timesheet/${path}`}
                    active={location.pathname.includes(path)}
                    className="custom-link"
                  >
                    <span className="icon-circle">{icon}</span>
                    <span className="label-text">{label}</span>
                  </Nav.Link>
                ))}
              </Nav>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Nav.Link as={Link} to="/reports" className="nav-item custom-link" active={location.pathname === "/reports"}>
          <i className="bi bi-file-earmark-text me-2" />
          <span className="label-text">Reports</span>
        </Nav.Link>
      </Nav>

      <div className="section-title px-3 mt-4 text-muted small label-text">Manage</div>
      <Nav className="flex-column">
        <Nav.Link className="custom-link"><i className="bi bi-list-task me-2" /> <span className="label-text">Tasks</span></Nav.Link>
        <Nav.Link className="custom-link"><i className="bi bi-clock-history me-2" /> <span className="label-text">Attendance</span></Nav.Link>
        <Nav.Link className="custom-link"><i className="bi bi-journals me-2" /> <span className="label-text">Projects</span></Nav.Link>
        <Nav.Link className="custom-link"><i className="bi bi-receipt me-2" /> <span className="label-text">Invoice</span></Nav.Link>
        <Nav.Link className="custom-link"><i className="bi bi-people me-2" /> <span className="label-text">Clients</span></Nav.Link>
      </Nav>

      <div className="section-title px-3 mt-4 text-muted small label-text">Admin</div>
      <Nav className="flex-column mb-4">
        <Nav.Link className="custom-link"><i className="bi bi-diagram-3 me-2" /> <span className="label-text">Teams</span></Nav.Link>
        <Nav.Link className="custom-link"><i className="bi bi-person-lines-fill me-2" /> <span className="label-text">Members</span></Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;