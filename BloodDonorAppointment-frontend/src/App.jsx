import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const emptyForm = {
  donorName: '',
  bloodGroup: '',
  appointmentDate: '',
  confirmed: false,
}

function App() {
  const [appointments, setAppointments] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const confirmedCount = useMemo(
    () => appointments.filter((appointment) => appointment.confirmed).length,
    [appointments],
  )

  useEffect(() => {
    loadAppointments()
  }, [])

  async function loadAppointments() {
    setLoading(true)
    setError('')

    try {
      if (!API_BASE_URL) {
        throw new Error('VITE_API_BASE_URL is not configured in the frontend .env file.')
      }
      const response = await fetch(`${API_BASE_URL}/DisplayAll`)
      if (!response.ok) {
        throw new Error('Unable to load appointments.')
      }
      setAppointments(await response.json())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function startEditing(appointment) {
    setEditingId(appointment.id)
    setForm({
      donorName: appointment.donorName,
      bloodGroup: appointment.bloodGroup,
      appointmentDate: appointment.appointmentDate,
      confirmed: appointment.confirmed,
    })
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditing() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const endpoint = editingId
      ? `${API_BASE_URL}/Update/${editingId}`
      : `${API_BASE_URL}/Add`

    try {
      if (!API_BASE_URL) {
        throw new Error('VITE_API_BASE_URL is not configured in the frontend .env file.')
      }
      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error(
          editingId
            ? 'Unable to update this appointment.'
            : 'Unable to create this appointment.',
        )
      }

      setMessage(editingId ? 'Appointment updated.' : 'Appointment scheduled.')
      cancelEditing()
      await loadAppointments()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm('Delete this appointment?')) {
      return
    }

    setError('')
    try {
      if (!API_BASE_URL) {
        throw new Error('VITE_API_BASE_URL is not configured in the frontend .env file.')
      }
      const response = await fetch(`${API_BASE_URL}/Delete/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Unable to delete this appointment.')
      }
      setMessage('Appointment deleted.')
      if (editingId === id) {
        cancelEditing()
      }
      await loadAppointments()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <a className="brand" href="#dashboard" aria-label="LifeLine home">
          <span className="brand-mark">+</span>
          <span>
            <strong>LifeLine</strong>
            <small>Donor appointments</small>
          </span>
        </a>
        <div className="nav-links">
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#appointments">Appointments</a>
          <a href="#about">About</a>
        </div>
        <a className="nav-action" href="#new-appointment">New appointment <span>+</span></a>
      </nav>

      <main>
        <section className="hero" id="dashboard">
          <div>
            <p className="eyebrow">Blood donor care</p>
            <h1>Make every donation<br /><em>count.</em></h1>
            <p className="hero-copy">
              Keep your donation journey organized and help make lifesaving care
              available to everyone who needs it.
            </p>
            <a className="primary-button" href="#new-appointment">Schedule a donation <span>→</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun"></div>
            <div className="art-card card-back"></div>
            <div className="art-card card-front">
              <span className="drop">♥</span>
              <strong>Give blood.<br />Give hope.</strong>
              <small>One appointment can save up to three lives.</small>
            </div>
            <span className="spark spark-one">✦</span>
            <span className="spark spark-two">✦</span>
          </div>
        </section>

        <section className="stats-row" aria-label="Appointment summary">
          <div className="stat">
            <span className="stat-icon coral">♥</span>
            <div><strong>{appointments.length}</strong><span>Total appointments</span></div>
          </div>
          <div className="stat">
            <span className="stat-icon mint">✓</span>
            <div><strong>{confirmedCount}</strong><span>Confirmed visits</span></div>
          </div>
          <div className="stat">
            <span className="stat-icon yellow">+</span>
            <div><strong>3</strong><span>Lives per donation</span></div>
          </div>
        </section>

        <section className="content-grid">
          <div className="appointments-panel" id="appointments">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your schedule</p>
                <h2>Upcoming appointments</h2>
              </div>
              <button className="text-button" type="button" onClick={loadAppointments}>Refresh <span>↻</span></button>
            </div>

            {message && <p className="feedback success">{message}</p>}
            {error && <p className="feedback error">{error}</p>}

            {loading ? (
              <div className="empty-state"><span className="loader"></span><p>Loading appointments...</p></div>
            ) : appointments.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">♡</span>
                <h3>No appointments yet</h3>
                <p>Schedule your first donation to get started.</p>
              </div>
            ) : (
              <div className="appointment-list">
                {appointments.map((appointment) => (
                  <article className="appointment-card" key={appointment.id}>
                    <div className="date-block">
                      <span>{formatDay(appointment.appointmentDate)}</span>
                      <strong>{formatDate(appointment.appointmentDate)}</strong>
                    </div>
                    <div className="appointment-details">
                      <h3>{appointment.donorName}</h3>
                      <p>Blood group <b>{appointment.bloodGroup}</b></p>
                    </div>
                    <span className={`status ${appointment.confirmed ? 'confirmed' : 'pending'}`}>
                      {appointment.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                    <div className="card-actions">
                      <button type="button" onClick={() => startEditing(appointment)} aria-label={`Edit ${appointment.donorName}`}>Edit</button>
                      <button type="button" onClick={() => deleteAppointment(appointment.id)} aria-label={`Delete ${appointment.donorName}`}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="form-panel" id="new-appointment">
            <p className="eyebrow">{editingId ? 'Manage visit' : 'Get involved'}</p>
            <h2>{editingId ? 'Update appointment' : 'Schedule a donation'}</h2>
            <p className="form-intro">A few details are all it takes to reserve your spot.</p>
            <form onSubmit={handleSubmit}>
              <label>
                Donor name
                <input name="donorName" value={form.donorName} onChange={handleChange} placeholder="Enter full name" required />
              </label>
              <label>
                Blood group
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                  <option value="" disabled>Select blood group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group} value={group}>{group}</option>)}
                </select>
              </label>
              <label>
                Appointment date
                <input name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} required />
              </label>
              <label className="checkbox-label">
                <input name="confirmed" type="checkbox" checked={form.confirmed} onChange={handleChange} />
                <span>Mark appointment as confirmed</span>
              </label>
              <div className="form-actions">
                <button className="primary-button full-width" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Book appointment'} <span>→</span>
                </button>
                {editingId && <button className="cancel-button" type="button" onClick={cancelEditing}>Cancel edit</button>}
              </div>
            </form>
          </aside>
        </section>

        <section className="about-section" id="about">
          <p className="eyebrow">Small act, big impact</p>
          <h2>Your time can be someone else's second chance.</h2>
          <p>Thank you for helping communities stay ready with a safe and reliable blood supply.</p>
        </section>
      </main>
      <footer><span>LifeLine</span><span>Connected to BloodDonorAppointment API</span></footer>
    </div>
  )
}

function formatDay(date) {
  if (!date) return '--'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' })
}

function formatDate(date) {
  if (!date) return '--'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default App
