import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('ticketapp_session');
    if (!session) navigate('/login');

    const savedTickets = localStorage.getItem('ticketapp_tickets');
    if (savedTickets) setTickets(JSON.parse(savedTickets));
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('ticketapp_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleLogout = () => {
    localStorage.removeItem('ticketapp_session');
    navigate('/login');
  };

  const handleCreateOrUpdateTicket = (e) => {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const assignedTo = e.target.assignedTo.value.trim();
    const status = e.target.status.value;

    if (!title || !assignedTo) {
      toast.error('All fields are required');
      return;
    }

    if (editingTicket) {
      const updated = tickets.map(t =>
        t.id === editingTicket.id ? { ...t, title, assignedTo, status } : t
      );
      setTickets(updated);
      setEditingTicket(null);
      toast.success('Ticket updated');
    } else {
      const newTicket = {
        id: Date.now(),
        title,
        assignedTo,
        status,
      };
      setTickets([...tickets, newTicket]);
      toast.success('Ticket created');
    }

    e.target.reset();
  };

  const handleDeleteTicket = (id) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
    toast.info('Ticket deleted');
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'All' || ticket.status === filterStatus;
    const assigneeMatch = !filterAssignee || ticket.assignedTo.toLowerCase().includes(filterAssignee.toLowerCase());
    return statusMatch && assigneeMatch;
  });

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="dashboard-header">
        <h2>Welcome to Your Dashboard</h2>
        <p>This is a protected page only visible to logged-in users.</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Filter by assignee"
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
        />
      </div>

      {/* Ticket List */}
      <div className="ticket-list">
        <h3>Your Tickets</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {filteredTickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <h4>{ticket.title}</h4>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`ticket-status ${ticket.status.toLowerCase().replace(' ', '-')}`}>
                  {ticket.status}
                </span>
              </p>
              <p><strong>Assigned to:</strong> {ticket.assignedTo}</p>

              <div className="ticket-actions">
                <button className="edit" onClick={() => setEditingTicket(ticket)}>Edit</button>
                <button className="delete" onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Ticket Form */}
      <div className="ticket-form">
        <h3>{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}</h3>
        <form onSubmit={handleCreateOrUpdateTicket}>
          <input
            name="title"
            defaultValue={editingTicket?.title || ''}
            required
            placeholder="Title"
          />
          <input
            name="assignedTo"
            defaultValue={editingTicket?.assignedTo || ''}
            required
            placeholder="Assigned To"
          />
          <select
            name="status"
            defaultValue={editingTicket?.status || 'Open'}
            required
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          <button type="submit" className={editingTicket ? 'update' : 'create'}>
            {editingTicket ? 'Update Ticket' : 'Create Ticket'}
          </button>
        </form>
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardPage;
