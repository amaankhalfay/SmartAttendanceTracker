const bcrypt = require('bcryptjs');
const db = require('../../config/db');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error occurred.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
        [name, email, hashedPassword], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error occurred.' });
          }
          res.status(201).json({ message: 'User registered successfully.' });
        });
      } catch (error) {
        console.error('Password hashing error:', error);
        res.status(500).json({ message: 'Error processing password.' });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error occurred.' });
  }
};

module.exports = { registerUser };
