/**
 * CampusConnect API Client Service
 * Centralized REST API wrapper communicating with Express Backend & MongoDB
 * Practical 6: RESTful CRUD API operations
 * Practical 7: MongoDB Persistence
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // GET /api/events - Retrieve all events with optional filters
  async getEvents(category = 'All', search = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim() !== '') params.append('search', search.trim());

    const url = `${BASE_URL}/events${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load events (Status: ${res.status})`);
    }
    const data = await res.json();
    return data.data || [];
  },

  // GET /api/events/:id - Retrieve single event
  async getEventById(id) {
    const res = await fetch(`${BASE_URL}/events/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Event with ID '${id}' not found`);
    }
    return data.data;
  },

  // POST /api/events - Create new campus event (Practical 6: Create)
  async createEvent(payload) {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create event');
    }
    return data.data;
  },

  // PUT /api/events/:id - Update existing event (Practical 6: Update)
  async updateEvent(id, payload) {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update event');
    }
    return data.data;
  },

  // DELETE /api/events/:id - Delete an event (Practical 6: Delete)
  async deleteEvent(id) {
    const res = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete event');
    }
    return data;
  },

  // GET /api/registrations - Retrieve active registration passes
  async getRegistrations() {
    const res = await fetch(`${BASE_URL}/registrations`);
    if (!res.ok) {
      throw new Error(`Failed to load registrations`);
    }
    const data = await res.json();
    return data.data || [];
  },

  // GET /api/registrations/:id - Retrieve registration pass
  async getRegistrationById(id) {
    const res = await fetch(`${BASE_URL}/registrations/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Registration with ID '${id}' not found`);
    }
    return data.data;
  },

  // POST /api/registrations - Create registration pass & reserve seat
  async createRegistration(payload) {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data.data;
  },

  // PUT /api/registrations/:id - Update registration details
  async updateRegistration(id, payload) {
    const res = await fetch(`${BASE_URL}/registrations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update registration');
    }
    return data.data;
  },

  // DELETE /api/registrations/:id - Cancel pass & release seat
  async cancelRegistration(id) {
    const res = await fetch(`${BASE_URL}/registrations/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to cancel registration');
    }
    return data;
  },

  // GET /api/statistics - Retrieve aggregated campus metrics
  async getStatistics() {
    const res = await fetch(`${BASE_URL}/statistics`);
    if (!res.ok) {
      throw new Error('Failed to load statistics');
    }
    const data = await res.json();
    return data.data;
  },

  // GET /api/health - Diagnostic check on backend & MongoDB
  async getHealth() {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) {
      throw new Error('Backend health check failed');
    }
    return await res.json();
  }
};
