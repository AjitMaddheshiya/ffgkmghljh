// Secure Online Examination System - Pure JS
const app = document.getElementById('app');

// Simple in-memory user/session store
let currentUser = null;
let users = [
  { email: 'admin@example.com', password: 'admin123', name: 'Admin', role: 'admin' },
  { email: 'instructor@example.com', password: 'instructor123', name: 'Instructor', role: 'instructor' },
  { email: 'student@example.com', password: 'student123', name: 'Student', role: 'student' },
];

function render() {
  if (!currentUser) {
    renderLogin();
  } else if (currentUser.role === 'admin') {
    renderAdminDashboard();
  } else if (currentUser.role === 'instructor') {
    renderInstructorDashboard();
  } else if (currentUser.role === 'student') {
    renderStudentDashboard();
  }
}

function renderLogin() {
  app.innerHTML = `
    <div class="container">
      <h1>Login</h1>
      <form id="loginForm">
        <input type="email" id="loginEmail" placeholder="Email" required />
        <input type="password" id="loginPassword" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p style="text-align:center;">Don't have an account? <a href="#" id="gotoSignup">Sign up</a></p>
      <div id="loginError" class="error"></div>
    </div>
  `;
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      currentUser = user;
      render();
    } else {
      document.getElementById('loginError').textContent = 'Invalid credentials.';
    }
  };
  document.getElementById('gotoSignup').onclick = function(e) {
    e.preventDefault();
    renderSignup();
  };
}

function renderSignup() {
  app.innerHTML = `
    <div class="container">
      <h1>Sign Up</h1>
      <form id="signupForm">
        <input type="text" id="signupName" placeholder="Full Name" required />
        <input type="email" id="signupEmail" placeholder="Email" required />
        <input type="password" id="signupPassword" placeholder="Password" required />
        <select id="signupRole" required>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
      <p style="text-align:center;">Already have an account? <a href="#" id="gotoLogin">Login</a></p>
      <div id="signupError" class="error"></div>
    </div>
  `;
  document.getElementById('signupForm').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    if (users.some(u => u.email === email)) {
      document.getElementById('signupError').textContent = 'Email already registered.';
      return;
    }
    users.push({ name, email, password, role });
    currentUser = { name, email, password, role };
    render();
  };
  document.getElementById('gotoLogin').onclick = function(e) {
    e.preventDefault();
    renderLogin();
  };
}

function renderAdminDashboard() {
  app.innerHTML = `
    <div class="container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, ${currentUser.name}!</p>
      <h3>All Users</h3>
      <ul>
        ${users.map(u => `<li>${u.name} (${u.role}) - ${u.email}</li>`).join('')}
      </ul>
      <button onclick="logout()">Logout</button>
    </div>
  `;
}

function renderInstructorDashboard() {
  app.innerHTML = `
    <div class="container">
      <h2>Instructor Dashboard</h2>
      <p>Welcome, ${currentUser.name}!</p>
      <h3>Exam Management (Demo)</h3>
      <p>Create and manage exams here.</p>
      <button onclick="logout()">Logout</button>
    </div>
  `;
}

function renderStudentDashboard() {
  app.innerHTML = `
    <div class="container">
      <h2>Student Dashboard</h2>
      <p>Welcome, ${currentUser.name}!</p>
      <button onclick="startExam()">Start Exam</button>
      <button onclick="logout()">Logout</button>
    </div>
  `;
}

function startExam() {
  let questions = [
    { q: 'What is 2 + 2?', a: '', type: 'short' },
    { q: 'Capital of France?', a: '', type: 'short' },
    { q: 'Is the sky blue? (yes/no)', a: '', type: 'short' },
  ];
  let current = 0;
  let time = 60; // seconds
  let timer;
  function renderExam() {
    app.innerHTML = `
      <div class="container">
        <h2>Exam</h2>
        <div>Time left: <span id="timer">${time}s</span></div>
        <div style="margin:1em 0;">
          <div><b>Question ${current + 1} of ${questions.length}:</b></div>
          <div style="margin:0.5em 0;">${questions[current].q}</div>
          <input id="answerInput" value="${questions[current].a}" placeholder="Your answer..." />
        </div>
        <div style="display:flex;justify-content:space-between;">
          <button id="prevBtn" ${current === 0 ? 'disabled' : ''}>Previous</button>
          <button id="nextBtn" ${current === questions.length - 1 ? 'disabled' : ''}>Next</button>
        </div>
        <button id="submitBtn" style="margin-top:1em;width:100%;background:#16a34a;">Submit Exam</button>
      </div>
    `;
    document.getElementById('answerInput').oninput = e => {
      questions[current].a = e.target.value;
    };
    document.getElementById('prevBtn').onclick = () => { current--; renderExam(); };
    document.getElementById('nextBtn').onclick = () => { current++; renderExam(); };
    document.getElementById('submitBtn').onclick = submitExam;
  }
  function tick() {
    time--;
    if (document.getElementById('timer'))
      document.getElementById('timer').textContent = time + 's';
    if (time <= 0) {
      clearInterval(timer);
      submitExam();
    }
  }
  function submitExam() {
    clearInterval(timer);
    app.innerHTML = `
      <div class="container">
        <h2>Exam Submitted!</h2>
        <p>Thank you, ${currentUser.name}. Your answers:</p>
        <ul>${questions.map(q => `<li>${q.q} <b>${q.a || '(no answer)'}</b></li>`).join('')}</ul>
        <button onclick="renderStudentDashboard()">Back to Dashboard</button>
      </div>
    `;
  }
  renderExam();
  timer = setInterval(tick, 1000);
}

function logout() {
  currentUser = null;
  render();
}

// Expose for inline onclick
window.logout = logout;
window.renderStudentDashboard = renderStudentDashboard;
window.startExam = startExam;

render(); 