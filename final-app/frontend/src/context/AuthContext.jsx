import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

// Single Master Admin Account
export const MASTER_ADMIN = {
  id: 'ADMIN-MASTER-01',
  name: 'Chief Campus Administrator',
  email: 'admin@campusconnect.edu',
  role: 'admin',
  department: 'University Administration',
  avatar: 'AD'
};

// Initial Seed of Registered Organizers with Approval Statuses
const INITIAL_ORGANIZERS = [
  {
    id: 'ORG-01',
    name: 'Elena Rostova',
    email: 'techclub@campusconnect.edu',
    clubName: 'Coding & Technology Club',
    department: 'Computer Engineering',
    status: 'approved',
    role: 'organizer',
    avatar: 'ER'
  },
  {
    id: 'ORG-02',
    name: 'Devansh Verma',
    email: 'robotics@campusconnect.edu',
    clubName: 'Robotics & AI Society',
    department: 'Electronics & Telecomm',
    status: 'pending',
    role: 'organizer',
    avatar: 'DV',
    appliedAt: '22 Nov 2026'
  },
  {
    id: 'ORG-03',
    name: 'Rohan Deshmukh',
    email: 'sportslead@campusconnect.edu',
    clubName: 'Campus Sports Council',
    department: 'Athletics & Physical Ed',
    status: 'pending',
    role: 'organizer',
    avatar: 'RD',
    appliedAt: '21 Nov 2026'
  }
];

const INITIAL_STUDENTS = [
  {
    id: 'STU-01',
    name: 'Aarav Sharma',
    email: 'aarav@campusconnect.edu',
    studentId: 'STU2024001',
    department: 'Computer Science',
    year: '3rd Year',
    role: 'student',
    avatar: 'AS'
  }
];

const STORAGE_KEY_USER = 'campusconnect_auth_user';
const STORAGE_KEY_ORGANIZERS = 'campusconnect_organizers_roster';
const STORAGE_KEY_STUDENTS = 'campusconnect_students_roster';

export function AuthProvider({ children }) {
  // Current active user (defaults to null if not logged in = Guest)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return null; // Guest by default!
  });

  // Organizers roster (with approval status)
  const [organizers, setOrganizers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORGANIZERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved organizers:', e);
    }
    return INITIAL_ORGANIZERS;
  });

  // Students roster
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved students:', e);
    }
    return INITIAL_STUDENTS;
  });

  // Load registered users from MongoDB Atlas on initial load
  useEffect(() => {
    const fetchCloudUsers = async () => {
      try {
        const cloudUsers = await apiService.getUsers();
        if (cloudUsers && cloudUsers.length > 0) {
          const cloudOrganizers = cloudUsers.filter(u => u.role === 'organizer');
          const cloudStudents = cloudUsers.filter(u => u.role === 'student');

          if (cloudOrganizers.length > 0) {
            setOrganizers(prev => {
              const map = new Map();
              prev.forEach(o => map.set(o.email.toLowerCase(), o));
              cloudOrganizers.forEach(o => map.set(o.email.toLowerCase(), o));
              return Array.from(map.values());
            });
          }

          if (cloudStudents.length > 0) {
            setStudents(prev => {
              const map = new Map();
              prev.forEach(s => map.set(s.email.toLowerCase(), s));
              cloudStudents.forEach(s => map.set(s.email.toLowerCase(), s));
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        console.warn('Could not sync users from MongoDB Atlas:', err.message);
      }
    };
    fetchCloudUsers();
  }, []);

  // Persist state
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to save user session:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORGANIZERS, JSON.stringify(organizers));
    } catch (e) {
      console.error('Failed to save organizers roster:', e);
    }
  }, [organizers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students roster:', e);
    }
  }, [students]);

  // Login Handler with Single Admin rule and Organizer Approval gate
  const loginWithCredentials = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Single Master Admin Check
    if (cleanEmail === MASTER_ADMIN.email.toLowerCase()) {
      setUser(MASTER_ADMIN);
      return MASTER_ADMIN;
    }

    // 2. Check if user is a Club Organizer
    const foundOrganizer = organizers.find(
      o => o.email.toLowerCase() === cleanEmail
    );

    if (foundOrganizer) {
      if (foundOrganizer.status === 'pending') {
        throw new Error(
          `Approval Required: The Club Organizer account for "${foundOrganizer.clubName}" is pending authorization from the Campus Administrator. You cannot log in until approved.`
        );
      }
      if (foundOrganizer.status === 'rejected') {
        throw new Error(
          `Application Rejected: The Club Organizer account for "${foundOrganizer.clubName}" was not approved by the Administrator.`
        );
      }
      // Approved Organizer
      setUser(foundOrganizer);
      return foundOrganizer;
    }

    // 3. Check if user is a registered Student
    const foundStudent = students.find(
      s => s.email.toLowerCase() === cleanEmail
    );

    if (foundStudent) {
      setUser(foundStudent);
      return foundStudent;
    }

    // 4. If email is not in pre-seeded lists, treat as a newly logging-in student
    const newStudent = {
      id: `STU-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
      email: cleanEmail,
      studentId: `STU${Math.floor(100000 + Math.random() * 900000)}`,
      department: 'Computer Science',
      year: '3rd Year',
      role: 'student',
      avatar: cleanEmail.slice(0, 2).toUpperCase()
    };
    setStudents(prev => [...prev, newStudent]);
    setUser(newStudent);
    return newStudent;
  };

  // Sign up as a new Student
  const registerStudent = (studentData) => {
    const newStudent = {
      id: `STU-${Date.now()}`,
      name: studentData.name,
      email: studentData.email.trim().toLowerCase(),
      studentId: studentData.studentId || `STU${Math.floor(100000 + Math.random() * 900000)}`,
      department: studentData.department || 'Computer Science',
      year: studentData.year || '3rd Year',
      role: 'student',
      status: 'active',
      avatar: (studentData.name || 'ST').slice(0, 2).toUpperCase()
    };
    setStudents(prev => [...prev, newStudent]);
    setUser(newStudent);

    // Save to MongoDB Atlas
    apiService.createUser(newStudent).catch(err => {
      console.warn('Failed to persist student to MongoDB:', err.message);
    });

    return newStudent;
  };

  // Apply as a new Club Organizer (Requires Admin Approval!)
  const registerOrganizer = (organizerData) => {
    const cleanEmail = organizerData.email.trim().toLowerCase();
    
    // Prevent registering with admin email
    if (cleanEmail === MASTER_ADMIN.email.toLowerCase()) {
      throw new Error('Cannot register as administrator. Master admin is unique.');
    }

    const newOrganizer = {
      id: `ORG-${Date.now()}`,
      name: organizerData.name,
      email: cleanEmail,
      clubName: organizerData.clubName,
      department: organizerData.department || 'General',
      status: 'pending', // Awaiting Admin Approval!
      role: 'organizer',
      avatar: (organizerData.name || 'OR').slice(0, 2).toUpperCase(),
      appliedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setOrganizers(prev => [...prev, newOrganizer]);

    // Save to MongoDB Atlas
    apiService.createUser(newOrganizer).catch(err => {
      console.warn('Failed to persist organizer to MongoDB:', err.message);
    });

    return newOrganizer;
  };

  // Admin approves an organizer
  const approveOrganizer = (organizerId) => {
    setOrganizers(prev =>
      prev.map(o => (o.id === organizerId ? { ...o, status: 'approved' } : o))
    );
    // Update in MongoDB Atlas
    apiService.updateUserStatus(organizerId, 'approved').catch(err => {
      console.warn('Failed to update organizer approval in MongoDB:', err.message);
    });
  };

  // Admin rejects an organizer
  const rejectOrganizer = (organizerId) => {
    setOrganizers(prev =>
      prev.map(o => (o.id === organizerId ? { ...o, status: 'rejected' } : o))
    );
    // Update in MongoDB Atlas
    apiService.updateUserStatus(organizerId, 'rejected').catch(err => {
      console.warn('Failed to update organizer rejection in MongoDB:', err.message);
    });
  };

  // Quick switch role for testing
  const switchRole = (role) => {
    if (role === 'admin') {
      setUser(MASTER_ADMIN);
    } else if (role === 'organizer') {
      const approvedOrg = organizers.find(o => o.status === 'approved') || organizers[0];
      setUser(approvedOrg);
    } else if (role === 'student') {
      setUser(students[0] || INITIAL_STUDENTS[0]);
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isOrganizer: user?.role === 'organizer',
    organizers,
    students,
    loginWithCredentials,
    registerStudent,
    registerOrganizer,
    approveOrganizer,
    rejectOrganizer,
    switchRole,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
