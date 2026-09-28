const { useState, useMemo, useRef, useEffect } = React;

/* ---------- Data ---------- */
const CATEGORIES = [
  { key: "tech", label: "Technical", icon: "bi-cpu", desc: "Hackathons, coding contests and workshops." },
  { key: "cultural", label: "Cultural", icon: "bi-music-note-beamed", desc: "Music, dance, drama and art festivals." },
  { key: "sports", label: "Sports", icon: "bi-trophy", desc: "Inter-department tournaments and meets." },
  { key: "clubs", label: "Clubs", icon: "bi-people", desc: "Club meetups, talks and recruitment drives." },
];

const EVENTS = [
  { id: 1, title: "CodeSprint Hackathon", category: "tech", day: 12, month: "Oct", time: "9:00 AM", venue: "Computer Lab 2", desc: "24-hour team hackathon to build solutions for campus problems." },
  { id: 2, title: "Annual Cultural Fest", category: "cultural", day: 20, month: "Oct", time: "5:00 PM", venue: "Main Auditorium", desc: "Dance, music and drama performances by students of all years." },
  { id: 3, title: "Inter-Department Cricket", category: "sports", day: 27, month: "Oct", time: "8:30 AM", venue: "College Ground", desc: "Knockout cricket tournament between all departments." },
  { id: 4, title: "Web Dev Workshop", category: "tech", day: 3, month: "Nov", time: "11:00 AM", venue: "Seminar Hall", desc: "Hands-on session on HTML, CSS, Bootstrap and React." },
  { id: 5, title: "Photography Club Walk", category: "clubs", day: 9, month: "Nov", time: "4:00 PM", venue: "Campus Garden", desc: "Golden-hour photo walk with tips from senior members." },
  { id: 6, title: "Battle of Bands", category: "cultural", day: 15, month: "Nov", time: "6:00 PM", venue: "Open Air Theatre", desc: "Live band competition judged by guest musicians." },
];

const SLIDES = [
  { bg: "slide-bg-1", pill: "Highlight", title: "Record 1,200 students at last year's Tech Fest", desc: "Relive the projects, talks and wins from our biggest event yet." },
  { bg: "slide-bg-2", pill: "Announcement", title: "Registrations are open for CodeSprint", desc: "Form your team of up to four and register before seats fill up." },
  { bg: "slide-bg-3", pill: "Sports", title: "Inter-department league kicks off this month", desc: "Cricket, football and athletics — cheer for your department." },
];

const catOf = (key) => CATEGORIES.find((c) => c.key === key);

/* ---------- Components ---------- */
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#home">
          <i className="bi bi-calendar2-event"></i> CampusConnect
          <span className="brand-badge">Events</span>
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto">
            {[["home", "Home"], ["events", "Events"], ["categories", "Categories"], ["highlights", "Highlights"], ["about", "About"]].map(([id, label]) => (
              <li className="nav-item" key={id}>
                <a className="nav-link" href={"#" + id}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Hero({ registrations, onRegister }) {
  const next = EVENTS.slice(0, 3);
  return (
    <header className="hero-section" id="home" style={{ paddingTop: "7rem" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="hero-tag"><i className="bi bi-stars"></i> Semester events are live</span>
            <h1 className="hero-title">Discover, plan and join every event on campus.</h1>
            <p className="hero-subtitle">One place to browse college events, filter by interest and register in seconds.</p>
            <div className="hero-actions d-flex gap-3 flex-wrap">
              <button className="btn-primary-custom" onClick={() => onRegister(null)}>
                <i className="bi bi-pencil-square"></i> Register now
              </button>
              <a className="btn-outline-custom" href="#events">Browse events</a>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-visual-card">
              <div className="pulse-header">
                <strong>Campus pulse</strong>
                <span className="pulse-indicator"><span className="pulse-dot"></span> {registrations.length} registered</span>
              </div>
              {next.map((e) => (
                <div className="pulse-item" key={e.id}>
                  <div className="pulse-icon-box"><i className={"bi " + catOf(e.category).icon}></i></div>
                  <div>
                    <div className="fw-semibold">{e.title}</div>
                    <small className="text-muted">{e.day} {e.month} · {e.venue}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function EventCard({ event, registered, onRegister }) {
  const cat = catOf(event.category);
  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-date-badge">
          <span className="event-date-day">{event.day}</span>
          <span className="event-date-month">{event.month}</span>
        </div>
        <span className={"badge-category badge-" + event.category}>{cat.label}</span>
      </div>
      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.desc}</p>
        <ul className="event-metadata">
          <li><i className="bi bi-clock"></i> {event.time}</li>
          <li><i className="bi bi-geo-alt"></i> {event.venue}</li>
        </ul>
        {registered ? (
          <button className="btn-outline-custom justify-content-center" disabled>
            <i className="bi bi-check-circle-fill text-success"></i> Registered
          </button>
        ) : (
          <button className="btn-primary-custom justify-content-center" onClick={() => onRegister(event.id)}>
            Register
          </button>
        )}
      </div>
    </div>
  );
}

function Events({ filter, setFilter, registrations, onRegister }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () => EVENTS.filter((e) => (filter === "all" || e.category === filter) && e.title.toLowerCase().includes(query.toLowerCase())),
    [filter, query]
  );
  const isReg = (id) => registrations.some((r) => r.eventId === id);

  return (
    <section className="section-wrapper" id="events">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Upcoming</span>
          <h2 className="section-title">Upcoming events</h2>
          <p className="section-desc">Search or filter to find what fits you.</p>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
          {[{ key: "all", label: "All" }, ...CATEGORIES].map((c) => (
            <button key={c.key} onClick={() => setFilter(c.key)}
              className={filter === c.key ? "btn-primary-custom" : "btn-outline-custom"}>
              {c.label}
            </button>
          ))}
          <input className="form-control ms-lg-auto" style={{ maxWidth: 260 }} placeholder="Search events..."
            value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        {visible.length === 0 ? (
          <p>No events match your search.</p>
        ) : (
          <div className="row g-4">
            {visible.map((e) => (
              <div className="col-md-6 col-lg-4" key={e.id}>
                <EventCard event={e} registered={isReg(e.id)} onRegister={onRegister} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Categories({ setFilter }) {
  const pick = (key) => {
    setFilter(key);
    document.getElementById("events").scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="section-wrapper bg-alt" id="categories">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Event categories</h2>
        </div>
        <div className="row g-4">
          {CATEGORIES.map((c) => (
            <div className="col-6 col-lg-3" key={c.key}>
              <div className={"category-card " + c.key} role="button" onClick={() => pick(c.key)} style={{ cursor: "pointer" }}>
                <div className="category-icon-wrapper"><i className={"bi " + c.icon}></i></div>
                <h3 className="category-title">{c.label}</h3>
                <p className="category-desc">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="section-wrapper" id="highlights">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Highlights</span>
          <h2 className="section-title">Campus highlights</h2>
        </div>
        <div id="hl" className="carousel slide highlights-carousel" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {SLIDES.map((_, i) => (
              <button key={i} type="button" data-bs-target="#hl" data-bs-slide-to={i}
                className={i === 0 ? "active" : ""} aria-label={"Slide " + (i + 1)}></button>
            ))}
          </div>
          <div className="carousel-inner">
            {SLIDES.map((s, i) => (
              <div key={i} className={"carousel-item" + (i === 0 ? " active" : "")}>
                <div className={"carousel-slide-content " + s.bg}>
                  <div className="slide-text-box">
                    <span className="slide-pill">{s.pill}</span>
                    <h3 className="slide-title">{s.title}</h3>
                    <p className="slide-desc">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#hl" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span><span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#hl" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span><span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function About() {
  const points = [
    ["bi-search", "Easy discovery", "Search and filter every event in one place."],
    ["bi-lightning-charge", "Quick registration", "Sign up for events in a few clicks."],
    ["bi-bell", "Never miss out", "Clear dates, times and venues at a glance."],
  ];
  return (
    <section className="section-wrapper bg-alt" id="about">
      <div className="container">
        <div className="about-card">
          <div className="section-header">
            <span className="section-tag">About</span>
            <h2 className="section-title">Why CampusConnect?</h2>
          </div>
          {points.map(([icon, title, text]) => (
            <div className="feature-point" key={title}>
              <div className="feature-icon-badge"><i className={"bi " + icon}></i></div>
              <div><h4>{title}</h4><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="footer-brand"><i className="bi bi-calendar2-event"></i> CampusConnect</div>
            <p className="footer-desc">A simple college event planner built with HTML, CSS, Bootstrap 5 and React.</p>
          </div>
          <div className="col-md-3">
            <h5 className="footer-heading">Links</h5>
            <ul className="footer-links">
              <li><a href="#events">Events</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5 className="footer-heading">Contact</h5>
            <div className="footer-contact-item"><i className="bi bi-envelope"></i> events@college.edu</div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CampusConnect. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Registration modal ---------- */
function RegisterModal({ show, presetEventId, onClose, onSubmit, registrations }) {
  const ref = useRef(null);
  const modal = useRef(null);
  const empty = { name: "", email: "", phone: "", eventId: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  // Create the Bootstrap modal once, and tell React when it closes
  useEffect(() => {
    modal.current = new bootstrap.Modal(ref.current);
    ref.current.addEventListener("hidden.bs.modal", onClose);
  }, []);

  // Open/close when the parent changes `show`
  useEffect(() => {
    if (show) {
      setForm({ ...empty, eventId: presetEventId ? String(presetEventId) : "" });
      setErrors({});
      setDone(false);
      modal.current.show();
    } else {
      modal.current.hide();
    }
  }, [show, presetEventId]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 2) err.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email.";
    if (!/^\d{10}$/.test(form.phone)) err.phone = "Phone must be 10 digits.";
    if (!form.eventId) err.eventId = "Choose an event.";
    else if (registrations.some((r) => r.eventId === Number(form.eventId) && r.email === form.email))
      err.email = "This email is already registered for that event.";
    return err;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      onSubmit({ ...form, eventId: Number(form.eventId) });
      setDone(true);
    }
  };

  const field = (name, label, type = "text") => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} value={form[name]} onChange={change}
        className={"form-control" + (errors[name] ? " is-invalid" : "")} />
      <div className="invalid-feedback">{errors[name]}</div>
    </div>
  );

  return (
    <div className="modal fade" tabIndex="-1" ref={ref}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="bi bi-pencil-square"></i> Event registration</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          {done ? (
            <div className="modal-body text-center py-5">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3rem" }}></i>
              <h4 className="mt-3">You're registered!</h4>
              <p>See you at the event, {form.name.split(" ")[0]}.</p>
              <button className="btn-primary-custom" data-bs-dismiss="modal">Done</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="modal-body">
                {field("name", "Full name")}
                {field("email", "College email", "email")}
                {field("phone", "Phone number", "tel")}
                <div className="mb-1">
                  <label className="form-label" htmlFor="eventId">Event</label>
                  <select id="eventId" name="eventId" value={form.eventId} onChange={change}
                    className={"form-select" + (errors.eventId ? " is-invalid" : "")}>
                    <option value="">Select an event</option>
                    {EVENTS.map((ev) => <option key={ev.id} value={ev.id}>{ev.title} — {ev.day} {ev.month}</option>)}
                  </select>
                  <div className="invalid-feedback">{errors.eventId}</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-outline-custom" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn-primary-custom">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [presetId, setPresetId] = useState(null);

  // Registrations persist in the browser between visits
  const [registrations, setRegistrations] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cc_registrations")) || []; }
    catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem("cc_registrations", JSON.stringify(registrations));
  }, [registrations]);

  const openRegister = (id) => { setPresetId(id); setModalOpen(true); };

  return (
    <>
      <Navbar />
      <Hero registrations={registrations} onRegister={openRegister} />
      <Events filter={filter} setFilter={setFilter} registrations={registrations} onRegister={openRegister} />
      <Categories setFilter={setFilter} />
      <Highlights />
      <About />
      <Footer />
      <RegisterModal show={modalOpen} presetEventId={presetId} registrations={registrations}
        onClose={() => setModalOpen(false)}
        onSubmit={(r) => setRegistrations([...registrations, r])} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);