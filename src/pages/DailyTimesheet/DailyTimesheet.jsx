import React from 'react'
import './DailyTimesheet.css';

const DailyTimesheet = ({ collapsed }) => {
  return (
    <div className={`timesheet-container ${collapsed ? 'collapsed' : ''}`}>
      <div className="timesheet-header d-flex justify-content-between align-items-center mb-4">
        <h5 className="title">Daily Timesheet</h5>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary">+ Add Manual Time</button>
        </div>
      </div>

      <div className="filters d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        {/* Left Filters */}
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <select className="form-select">
            <option>Select Project</option>
          </select>

          <select className="form-select">
            <option>Select Task</option>
          </select>

          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-circle fs-5"></i>
            <input type="date" className="form-control" value="2025-06-26" />
            <button className="btn btn-outline-primary">Today</button>
          </div>
        </div>

        {/* Right Timezone and Organization */}
        <div className="d-flex align-items-center gap-3">
          <div className="timezone-label">
            <span className="text-muted small">Timezone:</span>
            <span className="ms-2 fw-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <select className="form-select small-dropdown">
            <option>Organization</option>
            <option>Pranathi Software Services</option>
            <option>Dev Team</option>
          </select>
        </div>
      </div>

      <div className="profile-summary card p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="User"
              className="rounded-circle"
              style={{ width: '45px', height: '45px' }}
            />
            <div>
              <h6 className="mb-0">Byron Jett</h6>
              <small className="text-muted">26-06-2025 - Thursday</small>
            </div>
          </div>
          <div className="text-end">
            <div className="fw-semibold">2h 0m</div>
            <small className="text-muted">Total Time</small>
          </div>
        </div>
        <div className="text-muted mt-2 small">
          <i className="bi bi-exclamation-circle me-2"></i>
          Activity tracking is turned off from activity settings.
        </div>
      </div>
    </div>
  );
};

export default DailyTimesheet