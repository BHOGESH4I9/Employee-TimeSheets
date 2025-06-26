import React, { useEffect, useState } from 'react'
import './DailyTimesheet.css';

const DailyTimesheet = ({ collapsed }) => {
  const[employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-06-26');

  useEffect(() => {
  fetch('/employee-details.json')
    .then((res) => res.json())
    .then((data) => {
      setEmployees(data);
      setSelectedMember(data[0]);
      setSelectedProject(data[0].project);  
    })
    .catch((err) => console.error('Failed to load employee data', err));
  }, []);


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
    <div className="d-flex flex-column">
      <label htmlFor="projectSelect" className="form-label mb-1">Project</label>
      <select id="projectSelect" className="form-select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
        <option value="">Select Project</option>
        {[...new Set(employees.map(emp => emp.project))].map((proj, idx) => (
          <option key={idx} value={proj}>{proj}</option>
        ))}
      </select>
    </div>

    <div className="d-flex flex-column">
  <label htmlFor="taskSelect" className="form-label mb-1">Task</label>
  <select
    id="taskSelect"
    className="form-select"
    disabled={!selectedMember}
    onChange={(e) => setSelectedTaskIndex(e.target.value)}
  >
    <option value="">Select Task</option>
    {selectedMember?.tasks?.map((task, index) => (
      <option key={index} value={index}>
        {task.title}
      </option>
    ))}
  </select>
</div>


    <div className="d-flex flex-column position-relative">
  <label className="form-label mb-1">Member</label>
  <div className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => setShowMemberDropdown(!showMemberDropdown)}>
    <i className="bi bi-person-circle fs-5"></i>
    <span>{selectedMember ? selectedMember.name : 'Select Member'}</span>
  </div>

  {showMemberDropdown && (
    <div className="dropdown-menu show p-2 mt-1" style={{ minWidth: '220px', zIndex: 10 }}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search member..."
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
          />
          <div className="member-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {employees
              .filter(emp => emp.name.toLowerCase().includes(memberSearch.toLowerCase()))
              .map((emp, idx) => (
                <div
                  key={idx}
                  className="dropdown-item"
                  role="button"
                  onClick={() => {
                    setSelectedMember(emp);
                    setShowMemberDropdown(false);
                    setMemberSearch('');
                  }}
                >
                  {emp.name}
                </div>
              ))}
            {employees.filter(emp => emp.name.toLowerCase().includes(memberSearch.toLowerCase())).length === 0 && (
              <div className="text-muted px-2 small">No members found</div>
            )}
          </div>
        </div>
      )}
    </div>

    <div className="d-flex flex-column">
      <label htmlFor="dateInput" className="form-label mb-1">Select Date</label>
      <input
        id="dateInput"
        type="date"
        className="form-control"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>

    <div className="d-flex align-items-end">
      <button className="btn btn-outline-primary mt-auto">Today</button>
    </div>
  </div>

  {/* Right Timezone and Org */}
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

      <div className="hourly-schedule mt-4">
  <div className="card p-3">
    <h6 className="mb-3">Hourly Breakdown</h6>
    {selectedMember ? (
      <div className="employee-hourly mb-4">
        <h6 className="mb-2">
          {selectedMember.name} — <span className="text-muted">{selectedMember.project}</span>
        </h6>
        <div className="schedule-grid">
          {Array.from({ length: 15 }, (_, i) => {
            const hour = 9 + i;
            const startHour = new Date(selectedMember.startDate).getHours();
            const endHour = new Date(selectedMember.endDate).getHours();
            const lunchStart = new Date(selectedMember.lunchStart).getHours();
            const lunchEnd = new Date(selectedMember.lunchEnd).getHours();

            const isWorked = hour >= startHour && hour < endHour;
            const isLunch = hour >= lunchStart && hour < lunchEnd;

            // Identify matched task for this hour
            const matchedTask = selectedMember?.tasks?.find((task, index) =>
              hour >= Math.floor(task.startHour) &&
              hour < Math.ceil(task.endHour) &&
              (selectedTaskIndex === null || Number(selectedTaskIndex) === index)
            );

            const formattedHour = new Date(2025, 0, 1, hour).toLocaleTimeString([], {
              hour: '2-digit', minute: '2-digit'
            });
            const formattedNext = new Date(2025, 0, 1, hour + 1).toLocaleTimeString([], {
              hour: '2-digit', minute: '2-digit'
            });

            return (
              <div key={hour} className="hour-block d-flex align-items-start mb-2">
                <div className="hour-label text-muted" style={{ width: '100px' }}>
                  {formattedHour} - {formattedNext}
                </div>
                <div
                  className={`hour-task rounded w-100 px-3 py-2 ${
                    isLunch
                      ? 'lunch'
                      : matchedTask
                      ? 'highlight-task'
                      : isWorked
                      ? 'worked'
                      : 'not-worked'
                  }`}
                >
                  {isLunch ? (
                    <div className="task-title">Lunch Break</div>
                  ) : matchedTask ? (
                    <>
                      <div className="task-title fw-semibold">{matchedTask.title}</div>
                      <div className="task-desc small text-muted">{matchedTask.description}</div>
                      <div className="task-time small text-muted">
                        {formattedHour} - {formattedNext}
                      </div>
                    </>
                  ) : isWorked ? (
                    <>
                      <div className="fw-semibold">{selectedMember.project}</div>
                      <small className="text-muted">Working</small>
                    </>
                  ) : (
                    <small className="text-muted">No activity</small>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <p className="text-muted">Please select a member to view their hourly breakdown.</p>
    )}
  </div>
</div>
    </div>
  );
};

export default DailyTimesheet