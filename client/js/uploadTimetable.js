// client/js/uploadTimetable.js

document.getElementById('timetableForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user) {
      alert('User not found. Please login again.');
      window.location.href = 'index.html';
      return;
    }
  
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const subject = document.getElementById('subject').value.trim();
    const location = document.getElementById('location').value.trim();
    const faculty = document.getElementById('faculty').value.trim();
  
    if (!day || !startTime || !endTime || !subject) {
      alert('Please fill all required fields.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          day,
          startTime,
          endTime,
          subject,
          location,
          faculty
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Class added successfully! You can add another.');
        document.getElementById('timetableForm').reset();
      } else {
        throw new Error(data.message || 'Failed to add class.');
      }
  
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Something went wrong.');
    }
  });
  