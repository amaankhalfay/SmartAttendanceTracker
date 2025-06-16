// client/js/timetableSettings.js

// Default settings
const defaultSettings = {
    startTime: '08:45',
    endTime: '15:30',
    interval: 60, // minutes
    showWeekend: true
  };
  
  // Save settings to localStorage
  function saveTimetableSettings(settings) {
    localStorage.setItem('timetableSettings', JSON.stringify(settings));
  }
  
  // Get saved settings or return defaults
  function getTimetableSettings() {
    const saved = localStorage.getItem('timetableSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  }
  
  // Generate time slots from settings
  function generateTimeSlots(settings) {
    const slots = [];
    const [startHour, startMin] = settings.startTime.split(':').map(Number);
    const [endHour, endMin] = settings.endTime.split(':').map(Number);
  
    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);
  
    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);
  
    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + settings.interval);
    }
  
    return slots;
  }
  