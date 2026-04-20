const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let workers = [];
let schedules = {}; // Key: "month-day", Value: Array of shifts
let selectedDay = null;

// Initialize
window.onload = () => {
    const selector = document.getElementById('monthSelect');
    months.forEach((m, i) => {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = m;
        selector.appendChild(opt);
    });
    selector.value = new Date().getMonth();
    renderCalendar();
};

function addWorker() {
    const name = document.getElementById('workerName').value;
    if (!name) return;
    workers.push(name);
    updateWorkerUI();
    document.getElementById('workerName').value = '';
}

function updateWorkerUI() {
    const list = document.getElementById('workerList');
    const dropdown = document.getElementById('workerDropdown');
    list.innerHTML = "";
    dropdown.innerHTML = "";
    
    workers.forEach(w => {
        let li = document.createElement('li');
        li.textContent = w;
        list.appendChild(li);
        
        let opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        dropdown.appendChild(opt);
    });
}

function renderCalendar() {
    const monthIndex = parseInt(document.getElementById('monthSelect').value);
    const year = 2026; // Current year
    const grid = document.getElementById('calendarGrid');
    const display = document.getElementById('currentMonthDisplay');
    
    display.innerText = `${months[monthIndex]} ${year}`;
    grid.innerHTML = "";

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.onclick = () => openModal(i);
        
        const dateKey = `${monthIndex}-${i}`;
        let shiftsHtml = (schedules[dateKey] || []).map(s => 
            `<div class="shift-tag">${s.name}: ${s.start}-${s.end}</div>`
        ).join('');

        cell.innerHTML = `<div class="day-header">${i}</div>${shiftsHtml}`;
        grid.appendChild(cell);
    }
}

function openModal(day) {
    if (workers.length === 0) {
        alert("Add a worker first!");
        return;
    }
    selectedDay = day;
    document.getElementById('selectedDateText').innerText = `Date: ${months[document.getElementById('monthSelect').value]} ${day}`;
    document.getElementById('scheduleModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('scheduleModal').style.display = 'none';
}

function saveShift() {
    const month = document.getElementById('monthSelect').value;
    const name = document.getElementById('workerDropdown').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;
    const key = `${month}-${selectedDay}`;

    if (!schedules[key]) schedules[key] = [];
    schedules[key].push({ name, start, end });

    closeModal();
    renderCalendar();
}