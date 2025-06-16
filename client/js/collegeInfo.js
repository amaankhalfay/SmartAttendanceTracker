// client/js/collegeInfo.js

document.getElementById('collegeInfoForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const collegeName = document.getElementById('collegeName').value.trim();
  const collegeEmail = document.getElementById('collegeEmail').value.trim();
  const department = document.getElementById('department').value;
  const section = document.getElementById('section').value;
  const semester = document.getElementById('semester').value;
  const year = document.getElementById('year').value;
  const academicYear = document.getElementById('academicYear').value;
  const rollNo = document.getElementById('rollNo').value.trim();
  const contactNumber = document.getElementById('contactNumber').value.trim();
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('User not found. Please login again.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/collegeinfo', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
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
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Information saved successfully!');
      window.location.href = 'dashboard.html';
    } else {
      throw new Error(data.message || 'Failed to save information.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Something went wrong!');
  }
});

document.addEventListener('DOMContentLoaded', function() {
    // Function to get current academic year
    function getCurrentAcademicYear() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
        
        // If current month is June or later, the academic year starts this year
        // Otherwise, it started last year
        const startYear = currentMonth >= 6 ? currentYear : currentYear - 1;
        return startYear;
    }

    // Function to format academic year
    function formatAcademicYear(year) {
        const nextYear = year + 1;
        return `${year}-${nextYear.toString().slice(-2)}`;
    }

    // Function to populate academic year dropdown
    function populateAcademicYearDropdown() {
        const academicYearSelect = document.getElementById('academicYear');
        const currentAcademicYear = getCurrentAcademicYear();
        
        // Clear existing options except the first one
        while (academicYearSelect.options.length > 1) {
            academicYearSelect.remove(1);
        }

        // Add options for current academic year and next 2 years
        for (let i = 0; i < 3; i++) {
            const year = currentAcademicYear + i;
            const option = document.createElement('option');
            option.value = formatAcademicYear(year);
            option.textContent = formatAcademicYear(year);
            academicYearSelect.appendChild(option);
        }
    }

    // Populate the dropdown when the page loads
    populateAcademicYearDropdown();
});
