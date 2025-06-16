// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const { registerUser } = require('../api/register/register');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error occurred.' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'User not found.' });
      }

      const user = results[0];

      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Incorrect password.' });
        }

        res.status(200).json({ 
          message: 'Login successful.', 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email 
          } 
        });
      } catch (error) {
        console.error('Password comparison error:', error);
        res.status(500).json({ message: 'Error verifying password.' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error occurred.' });
  }
});

// College Info route
router.post('/collegeinfo', (req, res) => {
  const {
    userId,
    collegeName,
    collegeEmail,
    department,
    section,
    semester,
    year,
    academicYear,
    rollNo,
    contactNumber,
    dob,
    gender
  } = req.body;

  if (!userId || !collegeName || !collegeEmail || !department || !section || !semester || !year || !academicYear || !rollNo || !contactNumber || !dob || !gender) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO college_info 
    (user_id, college_name, college_email, department, section, semester, year, academic_year, roll_no, contact_number, dob, gender)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    userId,
    collegeName,
    collegeEmail,
    department,
    section,
    semester,
    year,
    academicYear,
    rollNo,
    contactNumber,
    dob,
    gender
  ], (err, result) => {
    if (err) {
      console.error('Error saving college info:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(201).json({ message: 'College information saved successfully!' });
  });
});

// Get college info by user ID
router.get('/collegeinfo/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = 'SELECT * FROM college_info WHERE user_id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching college info:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'College information not found.' });
    }

    res.status(200).json(results[0]);
  });
});

// Update College Info (PUT)
router.put('/collegeinfo/:userId', (req, res) => {
  const { userId } = req.params;
  const {
    collegeName,
    collegeEmail,
    department,
    section,
    semester,
    year,
    academicYear,
    rollNo,
    contactNumber,
    dob,
    gender
  } = req.body;

  const sql = `
    UPDATE college_info
    SET college_name = ?, college_email = ?, department = ?, section = ?, semester = ?, year = ?, academic_year = ?, roll_no = ?, contact_number = ?, dob = ?, gender = ?
    WHERE user_id = ?
  `;

  db.query(sql, [
    collegeName,
    collegeEmail,
    department,
    section,
    semester,
    year,
    academicYear,
    rollNo,
    contactNumber,
    dob,
    gender,
    userId
  ], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(200).json({ message: 'Profile updated successfully.' });
  });
});

// POST route for uploading timetable class
router.post('/timetable', (req, res) => {
  const { userId, day, startTime, endTime, subject, location, faculty } = req.body;

  if (!userId || !day || !startTime || !endTime || !subject) {
    return res.status(400).json({ message: 'Required fields missing.' });
  }

  const sql = `
    INSERT INTO timetable (user_id, day, start_time, end_time, subject, location, faculty)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, day, startTime, endTime, subject, location, faculty], (err, result) => {
    if (err) {
      console.error('Error inserting timetable:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.status(201).json({ message: 'Class added successfully!' });
  });
});

// GET: Fetch all timetable entries for a user
router.get('/timetable/:userId', (req, res) => {
  const { userId } = req.params;

  const sql = `SELECT * FROM timetable WHERE user_id = ? ORDER BY 
                FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
                start_time`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching timetable:', err);
      return res.status(500).json({ message: 'Database error.' });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
