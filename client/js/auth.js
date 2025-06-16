// client/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        alert('Registration successful! Please login.');
        window.location.href = 'index.html'; // Redirect to login
      } catch (error) {
        console.error('Registration failed:', error);
        alert(error.message || 'Registration failed. Please try again.');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert('Login successful!');

        // Check if College Info exists
        const checkCollegeInfo = await fetch(`http://localhost:5000/api/auth/collegeinfo/${data.user.id}`);
        
        if (checkCollegeInfo.ok) {
          // College info exists
          window.location.href = 'dashboard.html';
        } else {
          // College info not filled yet
          window.location.href = 'collegeinfo.html';
        }

      } catch (error) {
        console.error('Login failed:', error);
        alert(error.message || 'Login failed. Please try again.');
      }
    });
  }
});
