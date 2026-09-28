/**
 * CampusConnect API Client Service
 * Centralized REST API wrapper communicating with Express Backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // GET /api/events
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

  // GET /api/events/:id
  async getEventById(id) {
    const res = await fetch(`${BASE_URL}/events/${id}`);
    if (!res.ok) {
      throw new Error(`Event with ID '${id}' not found`);
    }
    const data = await res.json();
    return data.data;
  },

  // GET /api/registrations
  async getRegistrations() {
    const res = await fetch(`${BASE_URL}/registrations`);
    if (!res.ok) {
      throw new Error(`Failed to load registrations`);
    }
    const data = await res.json();
    return data.data || [];
  },

  // POST /api/registrations
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

  // DELETE /api/registrations/:id
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

  // GET /api/statistics
  async getStatistics() {
    const res = await fetch(`${BASE_URL}/statistics`);
    if (!res.ok) {
      throw new Error('Failed to load statistics');
    }
    const data = await res.json();
    return data.data;
  }
};
