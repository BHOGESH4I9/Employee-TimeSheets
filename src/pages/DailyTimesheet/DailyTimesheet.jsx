import React, { useEffect, useState } from 'react'
import './DailyTimesheet.css';

const DailyTimesheet = ({ collapsed }) => {
  const [employees, setEmployees] = useState([]);
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
        setSelectedProject(data[0]?.projects?.[0]?.project || '');
      })
      .catch((err) => console.error('Failed to load employee data', err));
  }, []);

  const getAllTasksForMember = (member) => {
    if (!member || !member.projects) return [];
    return member.projects.flatMap((proj, pIdx) =>
      proj.tasks.map((task, tIdx) => ({
        ...task,
        value: `${pIdx}-${tIdx}`,
        label: task.title,
        project: proj.project,
      }))
    );
  };

  return (
    <div className={`timesheet-container ${collapsed ? 'collapsed' : ''}`}>
      <div className="timesheet-header d-flex justify-content-between align-items-center mb-4">
        <h5 className="title">Daily Timesheet</h5>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary">+ Add Manual Time</button>
        </div>
      </div>

      <div className="filters d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <div className="d-flex flex-column">
            <label htmlFor="projectSelect" className="form-label mb-1">Project</label>
            <select
              id="projectSelect"
              className="form-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select Project</option>
              {[...new Set(
                selectedMember?.projects?.map(p => p.project) || []
              )].map((proj, idx) => (
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
              value={selectedTaskIndex || ''}
              onChange={(e) => setSelectedTaskIndex(e.target.value)}
            >
              <option value="">Select Task</option>
              {getAllTasksForMember(selectedMember).map((task, idx) => (
                <option key={idx} value={task.value}>
                  {task.title} ({task.project})
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
                          setSelectedProject(emp?.projects?.[0]?.project || '');
                          setSelectedTaskIndex(null);
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
              <h6 className="mb-0">{selectedMember?.name || 'Member'}</h6>
              <small className="text-muted">{selectedDate} - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}</small>
            </div>
          </div>
            {selectedMember && (
                <div className="text-end">
                  <div className="fw-semibold">
                    {Math.floor(selectedMember.totalHours)}h {Math.round((selectedMember.totalHours % 1) * 60)}m
                  </div>
                  <small className="text-muted">Total Time</small>
                </div>
              )}
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
            <>
              {/* Member Summary */}
             <div className="mb-3 px-3 py-2 border rounded bg-light-subtle d-flex flex-wrap gap-4 align-items-center small">
              <div>
                <strong className="text-primary">Lunch:</strong>{" "}
                <span className="text-dark">
                  {new Date(selectedMember.lunchStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                  {new Date(selectedMember.lunchEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <strong className="text-primary">Regular Hours:</strong>{" "}
                <span className="text-dark">{selectedMember.regularHours} hrs</span>
              </div>
              <div>
                <strong className="text-primary">Overtime Hours:</strong>{" "}
                <span className="text-dark">{selectedMember.overtimeHours} hrs</span>
              </div>
              <div>
                <strong className="text-primary">Total Hours:</strong>{" "}
                <span className="fw-semibold">
                  {Math.floor(selectedMember.totalHours)}h {Math.round((selectedMember.totalHours % 1) * 60)}m
                </span>
              </div>
            </div>
              {selectedMember.projects?.map((proj, pIdx) => (
                <div key={pIdx} className="employee-hourly mb-4">
                  <h6 className="mb-2">
                    {selectedMember.name} — <span className="text-muted">{proj.project}</span>
                  </h6>

                  {/* Currently Working On block */}
                  {(() => {
                    const currentTime = new Date();
                    const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

                    const currentTask = proj.tasks?.find((task) => (
                      currentHour >= task.startHour && currentHour < task.endHour
                    ));

                    if (currentTask) {
                      const formattedStart = new Date(2025, 0, 1, Math.floor(currentTask.startHour)).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit'
                      });
                      const formattedEnd = new Date(2025, 0, 1, Math.ceil(currentTask.endHour)).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit'
                      });

                      return (
                        <div className="alert alert-current-task py-2 px-3 mb-3">
                          <strong>Currently Working On:</strong> {currentTask.title} <span className="text-muted">({proj.project})</span>
                          <div className="small text-muted">
                            {formattedStart} - {formattedEnd}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Lunch Break block */}
                  {selectedMember.lunchStart && selectedMember.lunchEnd && (() => {
                    const lunchStart = new Date(selectedMember.lunchStart);
                    const lunchEnd = new Date(selectedMember.lunchEnd);

                    const formattedLunchStart = lunchStart.toLocaleTimeString([], {
                      hour: '2-digit', minute: '2-digit'
                    });
                    const formattedLunchEnd = lunchEnd.toLocaleTimeString([], {
                      hour: '2-digit', minute: '2-digit'
                    });

                    return (
                      <div className="alert alert-lunch py-2 px-3 mb-3">
                        <strong>Lunch Break:</strong>
                        <div className="small text-primary">
                          {formattedLunchStart} - {formattedLunchEnd}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="schedule-grid">
                    {(() => {
                      const blocks = [];
                      const hours = Array.from({ length: 15 }, (_, i) => 9 + i); // 9 AM to 11 PM
                      let lastTask = null;
                      let blockStart = null;

                      const pushBlock = (task, start, end) => {
                        const formattedStart = new Date(2025, 0, 1, start).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit'
                        });
                        const formattedEnd = new Date(2025, 0, 1, end).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit'
                        });

                        if (task || !selectedTaskIndex) {
                          const isLunchBlock = selectedMember.lunchStart && selectedMember.lunchEnd &&
                            start >= new Date(selectedMember.lunchStart).getHours() &&
                            end <= new Date(selectedMember.lunchEnd).getHours();

                          const isCurrentTask = (() => {
                            const currentTime = new Date();
                            const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
                            return task && currentHour >= task.startHour && currentHour < task.endHour;
                          })();

                          blocks.push(
                            <div key={`${start}-${end}-${task?.title || 'free'}`} className="hour-block d-flex align-items-start mb-2">
                              <div className="hour-label text-muted" style={{ width: '100px' }}>
                                {formattedStart} - {formattedEnd}
                              </div>
                              <div className={`hour-task rounded w-100 px-3 py-2 ${
                                isLunchBlock ? 'lunch-block' :
                                isCurrentTask ? 'highlight-task alert-current-task' :
                                task ? (
                                  selectedTaskIndex && `${pIdx}-${proj.tasks.indexOf(task)}` !== selectedTaskIndex
                                    ? 'worked'
                                    : 'highlight-task') : 'not-worked'
                              }`}>
                                {isLunchBlock ? (
                                  <>
                                    <div className="task-title fw-semibold">Lunch Break</div>
                                    <div className="task-time small text-muted">{formattedStart} - {formattedEnd}</div>
                                  </>
                                ) : task ? (
                                  <>
                                    <div className="task-title fw-semibold">{task.title}</div>
                                    <div className="task-desc small text-muted">{task.description}</div>
                                    <div className="task-time small text-muted">{formattedStart} - {formattedEnd}</div>
                                    <div className="task-project small text-muted"><i>{proj.project}</i></div>
                                  </>
                                ) : (
                                  !selectedTaskIndex && <small className="text-muted">No activity</small>
                                )}
                              </div>
                            </div>
                          );
                        }
                      };

                      hours.forEach((hour, i) => {
                        const matchedTask = proj.tasks?.find((task, tIdx) => {
                          const taskValue = `${pIdx}-${tIdx}`;
                          return (
                            hour >= Math.floor(task.startHour) &&
                            hour < Math.ceil(task.endHour) &&
                            (!selectedTaskIndex || selectedTaskIndex === taskValue)
                          );
                        });

                        const isSameAsLast =
                          lastTask && matchedTask &&
                          matchedTask.title === lastTask.title &&
                          matchedTask.description === lastTask.description;

                        if (isSameAsLast) {
                          // Continue same block
                        } else {
                          if (blockStart !== null) {
                            pushBlock(lastTask, blockStart, hour);
                          }
                          blockStart = hour;
                          lastTask = matchedTask || null;
                        }

                        if (i === hours.length - 1) {
                          pushBlock(matchedTask || null, blockStart, hour + 1);
                        }
                      });

                      return blocks;
                    })()}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted">Please select a member to view their hourly breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTimesheet;
