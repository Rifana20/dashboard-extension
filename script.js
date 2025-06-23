// script.js

// --- Configuration: No SERVER_API_URL needed for purely frontend simulation ---
// const SERVER_API_URL = 'http://localhost:5000'; // COMMENTED OUT

// --- DOM Elements ---
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const loggedInUserEmailSpan = document.getElementById('loggedInUserEmail');
const dashboardContent = document.getElementById('dashboardContent');
const attendanceDetailsList = document.getElementById('attendance-details');
const summaryTextarea = document.querySelector('.card:nth-of-type(2) textarea');
const transcriptTextarea = document.querySelector('.card:nth-of-type(3) textarea');
const agendaTextarea = document.querySelector('.card:nth-of-type(4) textarea');
const aiQuestionInput = document.getElementById('ai-question');
const aiResponseDiv = document.getElementById('ai-response');

// New card elements
const alertsCard = document.getElementById('alerts-card');
const devicesCard = document.getElementById('devices-card');
const tokensCard = document.getElementById('tokens-card');

// Elements within new cards
const alertKeywordInput = document.getElementById('alertKeyword');
const alertEmailInput = document.getElementById('alertEmail');
const alertList = document.getElementById('alertList');

const cliStatusSpan = document.getElementById('cliStatus');
const extensionStatusSpan = document.getElementById('extensionStatus');
const lastSeenDeviceSpan = document.getElementById('lastSeenDevice');

const tokenList = document.getElementById('tokenList');

// --- Global Simulated Data (Replaces Backend Data) ---
let isAuthenticated = false;
let currentUserEmail = 'guest@example.com'; // Default user
let simulatedAttendance = {
    participants: 12,
    shortAttendance: 3,
    details: [
        { name: "Alice Johnson", joined: "09:00 AM", left: "09:45 AM", duration: "45 mins" },
        { name: "Bob Williams", joined: "09:02 AM", left: "10:00 AM", duration: "58 mins" },
        { name: "Charlie Brown", joined: "09:07 AM", left: "09:30 AM", duration: "23 mins" },
        { name: "Diana Prince", joined: "09:01 AM", left: "10:00 AM", duration: "59 mins" }
    ]
};
let simulatedSummary = "This is a placeholder summary of your last meeting. Key discussion points included project milestones, budget review, and next steps for marketing. Action items assigned to John and Jane.";
let simulatedTranscript = "Speaker A: Good morning, everyone. Thanks for joining.\nSpeaker B: Morning. Ready to discuss the new features.\nSpeaker A: Great. Let's start with the Q3 targets...\nSpeaker C: ...and the final point is about customer feedback. \nSpeaker D: Yes, we need to integrate that feedback loop sooner. \nSpeaker C: Agreed. Let's aim for end of week.";
let simulatedAgenda = "1. Review Q2 performance\n2. Discuss Q3 strategic initiatives\n3. Budget allocation for new projects\n4. AOB";
let simulatedAlerts = [
    { id: 'alert-1', keyword: 'deadline', email: 'user@example.com' },
    { id: 'alert-2', keyword: 'bug fix', email: 'user@example.com' }
];
let simulatedDevices = {
    cli: { status: 'offline', lastSeen: '2024-06-20 10:30 AM' },
    extension: { status: 'online', lastSeen: '2024-06-23 01:55 PM' }
};
let simulatedTokens = [
    { id: 'token-abc', maskedToken: '************xyz', lastUsed: '2024-06-20' },
    { id: 'token-def', maskedToken: '************uvw', lastUsed: '2024-06-18' }
];


// --- UI Update Helper Functions ---

function showCard(cardElement) {
    // Hide all feature cards first
    [alertsCard, devicesCard, tokensCard].forEach(card => {
        card.style.display = 'none';
    });
    // Show the requested card
    cardElement.style.display = 'flex';
}

function updateAttendanceDisplay(participants, shortAttendance, details = []) {
    document.getElementById('participants').textContent = participants;
    document.getElementById('shortAttendance').textContent = shortAttendance;

    attendanceDetailsList.innerHTML = ''; // Clear previous details
    if (details.length > 0) {
        details.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.name} (Joined: ${p.joined}, Left: ${p.left}, Duration: ${p.duration})`;
            attendanceDetailsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No detailed attendance records available.';
        attendanceDetailsList.appendChild(li);
    }
}

function updateMeetingSummary(summaryText) {
    summaryTextarea.value = summaryText;
}

function updateTranscript(transcriptText) {
    transcriptTextarea.value = transcriptText;
}

function updateAgenda(agendaText) {
    agendaTextarea.value = agendaText;
}

function updateAIResponse(responseText) {
    aiResponseDiv.textContent = responseText;
}


// --- User Authentication & Session Management (Simulated) ---

function updateLoginUI() {
    if (isAuthenticated) {
        loggedInUserEmailSpan.textContent = currentUserEmail;
        alertEmailInput.value = currentUserEmail; // Pre-fill alert email with logged-in user
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        dashboardContent.style.display = 'flex'; // Show dashboard content
        fetchDashboardData(); // Load initial data
    } else {
        loggedInUserEmailSpan.textContent = 'Guest';
        alertEmailInput.value = ''; // Clear email input
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        dashboardContent.style.display = 'none'; // Hide dashboard content
    }
}

function simulateLogin() {
    currentUserEmail = prompt("Enter your simulated email for login (e.g., user@example.com):", "user@example.com");
    if (currentUserEmail) {
        isAuthenticated = true;
        updateLoginUI();
        alert("Simulated login successful for " + currentUserEmail);
    } else {
        alert("Login cancelled.");
    }
}

function handleLogout() {
    isAuthenticated = false;
    currentUserEmail = 'guest@example.com';
    updateLoginUI();
    alert("Simulated logout successful.");
}

logoutButton.addEventListener('click', handleLogout);


// --- Data Display Functions (Use Simulated Data) ---

function getAttendance() {
    // Simulate API call delay
    setTimeout(() => {
        updateAttendanceDisplay(simulatedAttendance.participants, simulatedAttendance.shortAttendance, simulatedAttendance.details);
        console.log('Attendance data displayed (simulated):', simulatedAttendance);
    }, 300);
}

function getSummary() {
    setTimeout(() => {
        updateMeetingSummary(simulatedSummary);
        console.log('Summary data displayed (simulated):', simulatedSummary);
    }, 300);
}

function getTranscript() {
    setTimeout(() => {
        updateTranscript(simulatedTranscript);
        console.log('Transcript data displayed (simulated):', simulatedTranscript);
    }, 300);
}

function askAI() {
    const question = aiQuestionInput.value.trim();
    if (!question) {
        alert("Please enter a question for the AI.");
        return;
    }
    updateAIResponse("AI is thinking..."); // Show loading state

    setTimeout(() => {
        const mockResponse = `Simulated AI response to "${question}": Based on the provided summary, the key outcome was project milestone review. Action items are pending follow-up.`;
        updateAIResponse(mockResponse);
        console.log('AI response displayed (simulated):', mockResponse);
    }, 1500); // Simulate AI processing time
}

// Function to load all dashboard data initially when user logs in
function fetchDashboardData() {
    getAttendance();
    getSummary();
    getTranscript();
    updateAgenda(simulatedAgenda);
    updateAIResponse("Ask me a question about the meeting transcript or summary!");
    // No need to call getAlerts/Devices/Tokens here, as they are loaded when their sidebar item is clicked.
}


// --- Sidebar Action Functions (Now trigger simulated updates) ---

function addAttendance() {
    alert("Simulating 'Add Attendance'. This would normally involve the Extension capturing data.");
    // Simulate a change in attendance
    simulatedAttendance.participants = Math.floor(Math.random() * 5) + 15; // New random count
    simulatedAttendance.shortAttendance = Math.floor(Math.random() * 3) + 1;
    simulatedAttendance.details.push({ name: `New Participant ${simulatedAttendance.participants}`, joined: new Date().toLocaleTimeString(), left: 'Still in meet', duration: 'Ongoing' });
    getAttendance(); // Refresh display
}

function prepareAgenda() {
    const newAgendaItem = prompt("Add a new agenda item:");
    if (newAgendaItem) {
        simulatedAgenda += `\n${newAgendaItem}`;
        updateAgenda(simulatedAgenda);
        alert("Agenda updated locally (simulated).");
    }
}

function sendCommand() {
    const command = prompt("Enter command for the bot (e.g., 'remind me', 'create task'):");
    if (command) {
        alert(`Simulating sending command to bot: "${command}".`);
    }
}

function integrateCalendar() {
    alert("Simulating Calendar Integration. This would involve actual OAuth and fetching events from a Calendar API.");
}


// --- New Feature Functions (All Simulated) ---

function setAlertsUI() {
    showCard(alertsCard);
    getAlerts(); // Load current alerts
}

function getAlerts() {
    alertList.innerHTML = '<li>Loading alerts...</li>';
    setTimeout(() => {
        alertList.innerHTML = '';
        if (simulatedAlerts.length > 0) {
            simulatedAlerts.forEach(alert => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${alert.keyword}</strong> to ${alert.email} <button onclick="deleteAlert('${alert.id}')">Delete</button>`;
                alertList.appendChild(li);
            });
        } else {
            alertList.innerHTML = '<li>No alerts configured.</li>';
        }
        console.log('Alerts data displayed (simulated):', simulatedAlerts);
    }, 300);
}

function saveAlert() {
    const keyword = alertKeywordInput.value.trim();
    const email = alertEmailInput.value.trim();

    if (!keyword || !email) {
        alert("Please enter both a keyword and an email for the alert.");
        return;
    }

    const newAlert = { id: `alert-${Date.now()}`, keyword, email };
    simulatedAlerts.push(newAlert);
    alert("Simulated: Alert saved successfully!");
    alertKeywordInput.value = ''; // Clear input
    getAlerts(); // Refresh the list
    console.log('New alert added (simulated):', newAlert);
}

function deleteAlert(id) {
    if (!confirm(`Are you sure you want to delete alert with ID: ${id}?`)) return;
    simulatedAlerts = simulatedAlerts.filter(alert => alert.id !== id);
    alert("Simulated: Alert deleted successfully!");
    getAlerts(); // Refresh the list
    console.log('Alert deleted (simulated):', id);
}


function viewDevices() {
    showCard(devicesCard);
    getDeviceStatus(); // Load current device status
}

function getDeviceStatus() {
    cliStatusSpan.textContent = 'Loading...';
    cliStatusSpan.className = '';
    extensionStatusSpan.textContent = 'Loading...';
    extensionStatusSpan.className = '';
    lastSeenDeviceSpan.textContent = 'N/A';

    setTimeout(() => {
        // Simulate device status change randomly for demonstration
        const cliOnline = Math.random() > 0.5;
        const extOnline = Math.random() > 0.5;

        simulatedDevices.cli.status = cliOnline ? 'online' : 'offline';
        simulatedDevices.cli.lastSeen = cliOnline ? new Date().toLocaleTimeString() : simulatedDevices.cli.lastSeen;
        simulatedDevices.extension.status = extOnline ? 'online' : 'offline';
        simulatedDevices.extension.lastSeen = extOnline ? new Date().toLocaleTimeString() : simulatedDevices.extension.lastSeen;

        cliStatusSpan.textContent = simulatedDevices.cli.status.toUpperCase();
        cliStatusSpan.className = simulatedDevices.cli.status.toLowerCase();
        extensionStatusSpan.textContent = simulatedDevices.extension.status.toUpperCase();
        extensionStatusSpan.className = simulatedDevices.extension.status.toLowerCase();
        lastSeenDeviceSpan.textContent = simulatedDevices.cli.lastSeen || simulatedDevices.extension.lastSeen || 'N/A';
        console.log('Device status displayed (simulated):', simulatedDevices);
    }, 500); // Simulate network delay
}

function refreshDeviceStatus() {
    getDeviceStatus();
    alert("Simulating refresh of device status...");
}


function manageTokensUI() {
    showCard(tokensCard);
    getTokens(); // Load current tokens
}

function generateToken() {
    alert("Simulating new token generation. This token is temporary and local.");
    const newTokenId = `token-${Date.now()}`;
    const newMaskedToken = `************${Math.random().toString(36).substring(7).slice(-4)}`; // Last 4 chars
    const newToken = { id: newTokenId, maskedToken: newMaskedToken, lastUsed: new Date().toISOString().split('T')[0] };
    simulatedTokens.push(newToken);
    alert('Simulated: New token generated! ' + newMaskedToken + '\n(In a real app, you would copy the full token string here)');
    getTokens(); // Refresh list
    console.log('New token generated (simulated):', newToken);
}

function getTokens() {
    tokenList.innerHTML = '<li>Loading tokens...</li>';
    setTimeout(() => {
        tokenList.innerHTML = '';
        if (simulatedTokens.length > 0) {
            simulatedTokens.forEach(token => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="token-id">${token.maskedToken}</span> (Last Used: ${token.lastUsed}) <button onclick="revokeToken('${token.id}')">Revoke</button>`;
                tokenList.appendChild(li);
            });
        } else {
            tokenList.innerHTML = '<li>No active tokens.</li>';
        }
        console.log('Tokens data displayed (simulated):', simulatedTokens);
    }, 300);
}

function revokeToken(id) {
    if (!confirm(`Are you sure you want to revoke token ID: ${id}?`)) return;
    simulatedTokens = simulatedTokens.filter(token => token.id !== id);
    alert("Simulated: Token revoked successfully!");
    getTokens(); // Refresh list
    console.log('Token revoked (simulated):', id);
}


// --- Initial Setup on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    updateLoginUI(); // Initialize UI based on current simulated state
    // No need for URLSearchParams for OAuth redirect as it's simulated
});
