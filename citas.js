const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let workers = [];
let schedules = {}; 
let selectedDay = null;

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
    const name = document.getElementById('workerName').value.trim();
    if (!name) return;
    workers.push(name);
    updateWorkerUI();
    document.getElementById('workerName').value = '';
}

function deleteWorker(index) {
    workers.splice(index, 1);
    updateWorkerUI();
}

function updateWorkerUI() {
    const list = document.getElementById('workerList');
    const dropdown = document.getElementById('workerDropdown');
    list.innerHTML = "";
    dropdown.innerHTML = "";
    
    workers.forEach((w, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <span>${w}</span>
            <button class="del-btn" onclick="deleteWorker(${index})">×</button>
        `;
        list.appendChild(li);
        
        let opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        dropdown.appendChild(opt);
    });
}

function renderCalendar() {
    const monthIndex = parseInt(document.getElementById('monthSelect').value);
    const year = 2026; 
    const grid = document.getElementById('calendarGrid');
    const display = document.getElementById('currentMonthDisplay');
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    display.innerText = `${months[monthIndex]} ${year}`;
    grid.innerHTML = "";

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        // Calculate the day of the week
        const dateObj = new Date(year, monthIndex, i);
        const dayName = dayNames[dateObj.getDay()];

        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.onclick = (e) => {
            if (e.target.className !== 'shift-tag') openModal(i);
        };
        
        const dateKey = `${monthIndex}-${i}`;
        
        let shiftsHtml = (schedules[dateKey] || []).map((s, shiftIdx) => {
            // Convert start and end times to 12-hour format
            const start12 = formatTwelveHour(s.shiftStart);
            const end12 = formatTwelveHour(s.shiftEnd);
            
            return `<div class="shift-tag" onclick="removeShift('${dateKey}', ${shiftIdx})">
                ${s.workerName} (${start12} - ${end12})
            </div>`;
        }).join('');

        // Updated innerHTML to show "Mon 1", "Tue 2", etc.
        cell.innerHTML = `
            <div class="day-header">
                <span class="day-label">${dayName}</span>
                <span class="day-num">${i}</span>
            </div>
            <div class="shift-container">${shiftsHtml}</div>
        `;
        grid.appendChild(cell);
    }
}

function openModal(day) {
    if (workers.length === 0) {
        alert("Please add a worker in the sidebar first.");
        return;
    }
    selectedDay = day;
    document.getElementById('selectedDateText').innerText = `Schedule for Day ${day}`;
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
// This object acts as your JSON database


// Function to export your current schedule as a JSON file
function downloadJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schedules, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "work_schedule.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveShift() {
    const month = document.getElementById('monthSelect').value;
    const name = document.getElementById('workerDropdown').value;
    const start = document.getElementById('startTime').value;
    const end = document.getElementById('endTime').value;
    const key = `${month}-${selectedDay}`;

    // NO LIMIT: We just keep pushing new worker objects into the array
    if (!schedules[key]) schedules[key] = [];
    
    schedules[key].push({
        workerName: name,
        shiftStart: start,
        shiftEnd: end,
        timestamp: new Date().toISOString()
    });

    closeModal();
    renderCalendar();
}
function removeShift(key, index) {
    schedules[key].splice(index, 1);
    renderCalendar();
}

function formatTwelveHour(timeString) {
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // convert '0' to '12'
    return `${hours}:${minutes} ${ampm}`;
}