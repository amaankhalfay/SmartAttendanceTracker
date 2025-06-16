document.addEventListener('DOMContentLoaded', async () => {
    const timetableGrid = document.getElementById('timetableGrid');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (!user || !user.id) {
      alert('Please login');
      return location.href = 'index.html';
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/auth/timetable/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch timetable data');
  
      const classes = await response.json();
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      renderBlockTimetable(timetableGrid, days, classes);
    } catch (err) {
      console.error(err);
      alert('Could not load timetable.');
    }
  });
  
  function renderBlockTimetable(container, days, classes) {
    container.innerHTML = '';
  
    // Extract all time points
    const timePoints = new Set();
    classes.forEach(cls => {
      timePoints.add(cls.start_time.slice(0, 5));
      timePoints.add(cls.end_time.slice(0, 5));
    });
  
    const sortedTimes = Array.from(timePoints).sort((a, b) => {
      const [ah, am] = a.split(':').map(Number);
      const [bh, bm] = b.split(':').map(Number);
      return ah * 60 + am - (bh * 60 + bm);
    });
  
    // Header row
    container.innerHTML += `<div class="timetable-header">Time</div>`;
    days.forEach(day => {
      container.innerHTML += `<div class="timetable-header">${day}</div>`;
    });
  
    // For each time slot between two points
    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const slotStart = sortedTimes[i];
      const slotEnd = sortedTimes[i + 1];
  
      // Time cell
      container.innerHTML += `<div class="timetable-header">${slotStart} - ${slotEnd}</div>`;
  
      days.forEach(day => {
        const cell = document.createElement('div');
        cell.className = 'timetable-cell';
  
        const match = classes.find(cls =>
          cls.day === day &&
          cls.start_time.slice(0, 5) === slotStart &&
          cls.end_time.slice(0, 5) === slotEnd
        );
  
        if (match) {
          cell.innerHTML = `
            <div class="class-entry">
              <div class="font-semibold">${match.subject}</div>
              ${match.location ? `<div class="text-sm">${match.location}</div>` : ''}
              ${match.faculty ? `<div class="text-sm">${match.faculty}</div>` : ''}
            </div>
          `;
        } else {
          cell.classList.add('empty');
        }
  
        container.appendChild(cell);
      });
    }
  }
  
  function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
  