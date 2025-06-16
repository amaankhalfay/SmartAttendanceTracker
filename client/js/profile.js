// js/profile.js

let profileData = {};

async function loadProfile() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    alert('User not found. Please login again.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/collegeinfo/${user.id}`);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON. Please check your backend.');
    }
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load profile');
    }

    profileData = data; // Save for edit

    const profileContainer = document.getElementById('profileContainer');

    profileContainer.innerHTML = `
      <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-bold text-blue-600 mb-4">Account Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <p class="text-gray-600"><span class="font-semibold">Name:</span> ${user.name}</p>
            <p class="text-gray-600"><span class="font-semibold">Email:</span> ${user.email}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-bold text-blue-600 mb-4">College Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <p class="text-gray-600"><span class="font-semibold">College Name:</span> ${data.college_name}</p>
            <p class="text-gray-600"><span class="font-semibold">College Email:</span> ${data.college_email}</p>
            <p class="text-gray-600"><span class="font-semibold">Department:</span> ${data.department}</p>
            <p class="text-gray-600"><span class="font-semibold">Section:</span> ${data.section}</p>
          </div>
          <div class="space-y-2">
            <p class="text-gray-600"><span class="font-semibold">Semester:</span> ${data.semester}</p>
            <p class="text-gray-600"><span class="font-semibold">Year:</span> ${data.year}</p>
            <p class="text-gray-600"><span class="font-semibold">Academic Year:</span> ${data.academic_year}</p>
            <p class="text-gray-600"><span class="font-semibold">Roll No:</span> ${data.roll_no}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
        <h3 class="text-xl font-bold text-blue-600 mb-4">Personal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <p class="text-gray-600"><span class="font-semibold">Contact Number:</span> ${data.contact_number}</p>
            <p class="text-gray-600"><span class="font-semibold">Date of Birth:</span> ${new Date(data.dob).toLocaleDateString()}</p>
            <p class="text-gray-600"><span class="font-semibold">Gender:</span> ${data.gender}</p>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Something went wrong!');
  }
}

function editProfile() {
  const profileContainer = document.getElementById('profileContainer');
  const editProfileButton = document.getElementById('editProfileButton');
  const editProfileForm = document.getElementById('editProfileForm');

  // Hide profile info and show edit form
  profileContainer.classList.add('hidden');
  editProfileButton.classList.add('hidden');
  editProfileForm.classList.remove('hidden');

  const updateForm = document.getElementById('updateProfileForm');
  updateForm.innerHTML = `
    <div class="space-y-8">
      <!-- Academic Information Section -->
      <div>
        <h3 class="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">Academic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">College Name</label>
            <input type="text" id="collegeName" value="${profileData.college_name}" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">College Email ID</label>
            <input type="email" id="collegeEmail" value="${profileData.college_email}" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Department/Branch</label>
            <select id="department" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
              <option value="" disabled>Select Department</option>
              <option value="CSE" ${profileData.department === 'CSE' ? 'selected' : ''}>Computer Science & Engineering</option>
              <option value="CE" ${profileData.department === 'CE' ? 'selected' : ''}>Computer Engineering</option>
              <option value="IT" ${profileData.department === 'IT' ? 'selected' : ''}>Information Technology</option>
              <option value="ME" ${profileData.department === 'ME' ? 'selected' : ''}>Mechanical Engineering</option>
              <option value="EE" ${profileData.department === 'EE' ? 'selected' : ''}>Electrical Engineering</option>
              <option value="ECE" ${profileData.department === 'ECE' ? 'selected' : ''}>Electronics & Communication</option>
            </select>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Section</label>
            <select id="section" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
              <option value="" disabled>Select Section</option>
              <option value="A" ${profileData.section === 'A' ? 'selected' : ''}>Section A</option>
              <option value="B" ${profileData.section === 'B' ? 'selected' : ''}>Section B</option>
              <option value="C" ${profileData.section === 'C' ? 'selected' : ''}>Section C</option>
              <option value="D" ${profileData.section === 'D' ? 'selected' : ''}>Section D</option>
            </select>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Semester</label>
            <select id="semester" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
              <option value="" disabled>Select Semester</option>
              <option value="1" ${profileData.semester === '1' ? 'selected' : ''}>Semester 1</option>
              <option value="2" ${profileData.semester === '2' ? 'selected' : ''}>Semester 2</option>
              <option value="3" ${profileData.semester === '3' ? 'selected' : ''}>Semester 3</option>
              <option value="4" ${profileData.semester === '4' ? 'selected' : ''}>Semester 4</option>
              <option value="5" ${profileData.semester === '5' ? 'selected' : ''}>Semester 5</option>
              <option value="6" ${profileData.semester === '6' ? 'selected' : ''}>Semester 6</option>
              <option value="7" ${profileData.semester === '7' ? 'selected' : ''}>Semester 7</option>
              <option value="8" ${profileData.semester === '8' ? 'selected' : ''}>Semester 8</option>
            </select>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Year</label>
            <select id="year" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
              <option value="" disabled>Select Year</option>
              <option value="1" ${profileData.year === '1' ? 'selected' : ''}>First Year</option>
              <option value="2" ${profileData.year === '2' ? 'selected' : ''}>Second Year</option>
              <option value="3" ${profileData.year === '3' ? 'selected' : ''}>Third Year</option>
              <option value="4" ${profileData.year === '4' ? 'selected' : ''}>Fourth Year</option>
            </select>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Academic Year</label>
            <select id="academicYear" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
              <option value="" disabled>Select Academic Year</option>
            </select>
            <p class="text-sm text-gray-500 mt-1">Academic year changes in June (e.g., 2025-26 starts from June 2025)</p>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Roll Number</label>
            <input type="text" id="rollNo" value="${profileData.roll_no}" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
          </div>
        </div>
      </div>

      <hr class="border-gray-200 my-8">

      <!-- Personal Information Section -->
      <div>
        <h3 class="text-xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">Personal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" value="${profileData.name}" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Contact Number</label>
            <input type="tel" id="contactNumber" value="${profileData.contact_number}" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Date of Birth</label>
            <input type="date" id="dob" value="${profileData.dob}" 
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
          </div>

          <div class="form-group">
            <label class="block mb-2 font-medium text-gray-700">Gender</label>
            <select id="gender" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required>
              <option value="" disabled>Select Gender</option>
              <option value="male" ${profileData.gender === 'male' ? 'selected' : ''}>Male</option>
              <option value="female" ${profileData.gender === 'female' ? 'selected' : ''}>Female</option>
              <option value="other" ${profileData.gender === 'other' ? 'selected' : ''}>Other</option>
              <option value="prefer_not_to_say" ${profileData.gender === 'prefer_not_to_say' ? 'selected' : ''}>Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex justify-center space-x-4 mt-8">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Save Changes
        </button>
        <button type="button" onclick="cancelEdit()" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Cancel
        </button>
      </div>
    </div>
  `;

  // Populate academic year dropdown
  populateAcademicYearDropdown(profileData.academic_year);

  updateForm.addEventListener('submit', updateProfile);
}

function cancelEdit() {
  const profileContainer = document.getElementById('profileContainer');
  const editProfileButton = document.getElementById('editProfileButton');
  const editProfileForm = document.getElementById('editProfileForm');

  // Show profile info and hide edit form
  profileContainer.classList.remove('hidden');
  editProfileButton.classList.remove('hidden');
  editProfileForm.classList.add('hidden');
}

async function updateProfile(e) {
  e.preventDefault();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const updatedData = {
    name: document.getElementById('name').value,
    collegeName: document.getElementById('collegeName').value,
    collegeEmail: document.getElementById('collegeEmail').value,
    department: document.getElementById('department').value,
    section: document.getElementById('section').value,
    semester: document.getElementById('semester').value,
    year: document.getElementById('year').value,
    academicYear: document.getElementById('academicYear').value,
    rollNo: document.getElementById('rollNo').value,
    contactNumber: document.getElementById('contactNumber').value,
    dob: document.getElementById('dob').value,
    gender: document.getElementById('gender').value
  };

  try {
    const response = await fetch(`http://localhost:5000/api/collegeinfo/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData)
    });
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON. Please check your backend.');
    }
    const data = await response.json();

    if (response.ok) {
      // Update the user's name in localStorage
      const updatedUser = { ...user, name: updatedData.name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Profile updated successfully!');
      window.location.reload(); // Reload to show updated profile
    } else {
      throw new Error(data.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Something went wrong!');
  }
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

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
function populateAcademicYearDropdown(currentAcademicYear) {
    const academicYearSelect = document.getElementById('academicYear');
    const currentYear = getCurrentAcademicYear();
    
    // Clear existing options except the first one
    while (academicYearSelect.options.length > 1) {
        academicYearSelect.remove(1);
    }

    // Add options for current academic year and next 2 years
    for (let i = 0; i < 3; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        const formattedYear = formatAcademicYear(year);
        option.value = formattedYear;
        option.textContent = formattedYear;
        if (currentAcademicYear === formattedYear) {
            option.selected = true;
        }
        academicYearSelect.appendChild(option);
    }
}

document.addEventListener('DOMContentLoaded', loadProfile);
