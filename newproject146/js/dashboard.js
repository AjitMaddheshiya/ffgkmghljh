// Dashboard Management Module

class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeData();
    }

    bindEvents() {
        // Tab switching
        $$('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Admin dashboard events
        $('#addUserBtn')?.addEventListener('click', () => this.showAddUserModal());
        $('#addExamBtn')?.addEventListener('click', () => this.showAddExamModal());

        // Instructor dashboard events
        $('#addQuestionBtn')?.addEventListener('click', () => this.addQuestion());
        $('#examForm')?.addEventListener('submit', (e) => this.handleExamSubmit(e));

        // Modal events
        $('#modalClose')?.addEventListener('click', () => this.closeModal());
        $('#modalOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') {
                this.closeModal();
            }
        });
    }

    initializeData() {
        // Initialize sample data if not exists
        if (!utils.storage.get('users')) {
            this.createSampleUsers();
        }
        if (!utils.storage.get('exams')) {
            this.createSampleExams();
        }
        if (!utils.storage.get('examResults')) {
            utils.storage.set('examResults', []);
        }
    }

    createSampleUsers() {
        const sampleUsers = [
            {
                id: 'admin1',
                name: 'Admin User',
                email: 'admin@exam.com',
                password: 'admin123',
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'instructor1',
                name: 'John Instructor',
                email: 'instructor@exam.com',
                password: 'instructor123',
                role: 'instructor',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'student1',
                name: 'Alice Student',
                email: 'student@exam.com',
                password: 'student123',
                role: 'student',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        utils.storage.set('users', sampleUsers);
    }

    createSampleExams() {
        const sampleExams = [
            {
                id: 'exam1',
                title: 'JavaScript Fundamentals',
                description: 'Test your knowledge of JavaScript basics',
                duration: 30,
                questions: [
                    {
                        id: 'q1',
                        text: 'What is JavaScript?',
                        options: [
                            'A programming language',
                            'A markup language',
                            'A styling language',
                            'A database'
                        ],
                        correctAnswer: 0
                    },
                    {
                        id: 'q2',
                        text: 'Which keyword is used to declare a variable?',
                        options: [
                            'var',
                            'let',
                            'const',
                            'All of the above'
                        ],
                        correctAnswer: 3
                    }
                ],
                createdBy: 'instructor1',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        utils.storage.set('exams', sampleExams);
    }

    switchTab(e) {
        const targetTab = e.target.dataset.tab;
        const tabContainer = e.target.closest('.tab-container');
        
        // Update active tab button
        tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update active tab panel
        tabContainer.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        $(`#${targetTab}Tab`).classList.add('active');
    }

    loadAdminDashboard() {
        this.updateAdminStats();
        this.loadUsersTable();
        this.loadExamsTable();
    }

    loadInstructorDashboard() {
        this.updateInstructorStats();
        this.loadInstructorExamsTable();
    }

    loadStudentDashboard() {
        this.updateStudentStats();
        this.loadAvailableExams();
        this.loadCompletedExams();
        this.updateStudentProfile();
    }

    updateAdminStats() {
        const users = utils.storage.get('users') || [];
        const exams = utils.storage.get('exams') || [];
        
        $('#totalUsers').textContent = users.length;
        $('#totalExams').textContent = exams.length;
        $('#activeSessions').textContent = Math.floor(Math.random() * 10) + 1; // Mock data
    }

    updateInstructorStats() {
        const exams = utils.storage.get('exams') || [];
        const currentUser = authManager.getCurrentUser();
        const myExams = exams.filter(exam => exam.createdBy === currentUser.id);
        
        $('#myExams').textContent = myExams.length;
        $('#activeExams').textContent = myExams.filter(exam => exam.status === 'active').length;
        $('#totalSubmissions').textContent = Math.floor(Math.random() * 50) + 10; // Mock data
    }

    updateStudentStats() {
        const exams = utils.storage.get('exams') || [];
        const results = utils.storage.get('examResults') || [];
        const currentUser = authManager.getCurrentUser();
        const myResults = results.filter(result => result.studentId === currentUser.id);
        
        $('#availableExams').textContent = exams.filter(exam => exam.status === 'active').length;
        $('#completedExams').textContent = myResults.length;
        
        if (myResults.length > 0) {
            const averageScore = myResults.reduce((sum, result) => sum + result.score, 0) / myResults.length;
            $('#averageScore').textContent = `${Math.round(averageScore)}%`;
        } else {
            $('#averageScore').textContent = '0%';
        }
    }

    loadUsersTable() {
        const users = utils.storage.get('users') || [];
        const tbody = $('#usersTableBody');
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>
                    <button class="action-btn edit" onclick="dashboardManager.editUser('${user.id}')">Edit</button>
                    <button class="action-btn delete" onclick="dashboardManager.deleteUser('${user.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    loadExamsTable() {
        const exams = utils.storage.get('exams') || [];
        const tbody = $('#examsTableBody');
        
        tbody.innerHTML = exams.map(exam => `
            <tr>
                <td>${exam.title}</td>
                <td>${exam.duration} minutes</td>
                <td>${exam.questions.length}</td>
                <td><span class="status-badge ${exam.status}">${exam.status}</span></td>
                <td>
                    <button class="action-btn view" onclick="dashboardManager.viewExam('${exam.id}')">View</button>
                    <button class="action-btn edit" onclick="dashboardManager.editExam('${exam.id}')">Edit</button>
                    <button class="action-btn delete" onclick="dashboardManager.deleteExam('${exam.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    loadInstructorExamsTable() {
        const exams = utils.storage.get('exams') || [];
        const currentUser = authManager.getCurrentUser();
        const myExams = exams.filter(exam => exam.createdBy === currentUser.id);
        const tbody = $('#instructorExamsTableBody');
        
        tbody.innerHTML = myExams.map(exam => `
            <tr>
                <td>${exam.title}</td>
                <td>${exam.duration} minutes</td>
                <td>${exam.questions.length}</td>
                <td><span class="status-badge ${exam.status}">${exam.status}</span></td>
                <td>
                    <button class="action-btn view" onclick="dashboardManager.viewExam('${exam.id}')">View</button>
                    <button class="action-btn edit" onclick="dashboardManager.editExam('${exam.id}')">Edit</button>
                    <button class="action-btn delete" onclick="dashboardManager.deleteExam('${exam.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    loadAvailableExams() {
        const exams = utils.storage.get('exams') || [];
        const results = utils.storage.get('examResults') || [];
        const currentUser = authManager.getCurrentUser();
        const availableExams = exams.filter(exam => 
            exam.status === 'active' && 
            !results.some(result => result.examId === exam.id && result.studentId === currentUser.id)
        );
        
        const container = $('#availableExamsList');
        container.innerHTML = availableExams.map(exam => `
            <div class="exam-card">
                <h4>${exam.title}</h4>
                <p>${exam.description}</p>
                <div class="exam-meta">
                    <span>Duration: ${exam.duration} minutes</span>
                    <span>Questions: ${exam.questions.length}</span>
                </div>
                <button class="btn-primary" onclick="examManager.startExam('${exam.id}')">Start Exam</button>
            </div>
        `).join('');
        
        if (availableExams.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>No Available Exams</h3>
                    <p>There are no exams available for you at the moment.</p>
                </div>
            `;
        }
    }

    loadCompletedExams() {
        const exams = utils.storage.get('exams') || [];
        const results = utils.storage.get('examResults') || [];
        const currentUser = authManager.getCurrentUser();
        const myResults = results.filter(result => result.studentId === currentUser.id);
        
        const container = $('#completedExamsList');
        container.innerHTML = myResults.map(result => {
            const exam = exams.find(e => e.id === result.examId);
            return `
                <div class="exam-card">
                    <h4>${exam ? exam.title : 'Unknown Exam'}</h4>
                    <p>Score: ${result.score}%</p>
                    <div class="exam-meta">
                        <span>Completed: ${utils.formatDate(result.completedAt)}</span>
                        <span>Time taken: ${result.timeTaken} minutes</span>
                    </div>
                    <button class="btn-secondary" onclick="dashboardManager.viewResult('${result.id}')">View Details</button>
                </div>
            `;
        }).join('');
        
        if (myResults.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <h3>No Completed Exams</h3>
                    <p>You haven't completed any exams yet.</p>
                </div>
            `;
        }
    }

    updateStudentProfile() {
        const currentUser = authManager.getCurrentUser();
        const results = utils.storage.get('examResults') || [];
        const myResults = results.filter(result => result.studentId === currentUser.id);
        
        $('#studentName').textContent = currentUser.name;
        $('#studentEmail').textContent = currentUser.email;
        $('#totalExamsTaken').textContent = myResults.length;
    }

    addQuestion() {
        const container = $('#questionsContainer');
        const questionId = utils.generateId();
        
        const questionHtml = `
            <div class="question-item" data-question-id="${questionId}">
                <button class="remove-question" onclick="dashboardManager.removeQuestion('${questionId}')">&times;</button>
                <h5>Question ${container.children.length + 1}</h5>
                <div class="form-group">
                    <label>Question Text</label>
                    <textarea class="question-text" placeholder="Enter your question here..." required></textarea>
                </div>
                <div class="question-options-list">
                    <div class="option-input">
                        <input type="radio" name="correct_${questionId}" value="0" required>
                        <input type="text" placeholder="Option 1" required>
                        <button type="button" class="remove-option" onclick="dashboardManager.removeOption(this)">&times;</button>
                    </div>
                    <div class="option-input">
                        <input type="radio" name="correct_${questionId}" value="1" required>
                        <input type="text" placeholder="Option 2" required>
                        <button type="button" class="remove-option" onclick="dashboardManager.removeOption(this)">&times;</button>
                    </div>
                    <div class="option-input">
                        <input type="radio" name="correct_${questionId}" value="2" required>
                        <input type="text" placeholder="Option 3" required>
                        <button type="button" class="remove-option" onclick="dashboardManager.removeOption(this)">&times;</button>
                    </div>
                    <div class="option-input">
                        <input type="radio" name="correct_${questionId}" value="3" required>
                        <input type="text" placeholder="Option 4" required>
                        <button type="button" class="remove-option" onclick="dashboardManager.removeOption(this)">&times;</button>
                    </div>
                </div>
                <button type="button" class="btn-secondary" onclick="dashboardManager.addOption('${questionId}')">Add Option</button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', questionHtml);
    }

    removeQuestion(questionId) {
        const questionElement = $(`[data-question-id="${questionId}"]`);
        if (questionElement) {
            questionElement.remove();
            this.renumberQuestions();
        }
    }

    addOption(questionId) {
        const questionElement = $(`[data-question-id="${questionId}"]`);
        const optionsList = questionElement.querySelector('.question-options-list');
        const optionCount = optionsList.children.length;
        
        const optionHtml = `
            <div class="option-input">
                <input type="radio" name="correct_${questionId}" value="${optionCount}" required>
                <input type="text" placeholder="Option ${optionCount + 1}" required>
                <button type="button" class="remove-option" onclick="dashboardManager.removeOption(this)">&times;</button>
            </div>
        `;
        
        optionsList.insertAdjacentHTML('beforeend', optionHtml);
    }

    removeOption(button) {
        const optionInput = button.closest('.option-input');
        const optionsList = optionInput.parentElement;
        
        if (optionsList.children.length > 2) {
            optionInput.remove();
            this.renumberOptions(optionsList);
        } else {
            authManager.showToast('Warning', 'At least 2 options are required', 'warning');
        }
    }

    renumberQuestions() {
        const questions = $$('.question-item');
        questions.forEach((question, index) => {
            const title = question.querySelector('h5');
            title.textContent = `Question ${index + 1}`;
        });
    }

    renumberOptions(optionsList) {
        const options = optionsList.querySelectorAll('.option-input');
        const questionId = optionsList.closest('.question-item').dataset.questionId;
        
        options.forEach((option, index) => {
            const radio = option.querySelector('input[type="radio"]');
            const textInput = option.querySelector('input[type="text"]');
            
            radio.value = index;
            textInput.placeholder = `Option ${index + 1}`;
        });
    }

    async handleExamSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const title = formData.get('examTitle') || $('#examTitle').value;
        const duration = parseInt(formData.get('examDuration') || $('#examDuration').value);
        const description = formData.get('examDescription') || $('#examDescription').value;
        
        // Validate form
        if (!title || !duration || duration <= 0) {
            authManager.showToast('Error', 'Please fill all required fields', 'error');
            return;
        }
        
        // Collect questions
        const questions = [];
        const questionElements = $$('.question-item');
        
        for (const questionElement of questionElements) {
            const questionText = questionElement.querySelector('.question-text').value;
            const options = Array.from(questionElement.querySelectorAll('.option-input input[type="text"]'))
                .map(input => input.value)
                .filter(value => value.trim() !== '');
            const correctAnswer = parseInt(questionElement.querySelector('input[type="radio"]:checked')?.value || 0);
            
            if (questionText.trim() && options.length >= 2) {
                questions.push({
                    id: utils.generateId(),
                    text: questionText,
                    options: options,
                    correctAnswer: correctAnswer
                });
            }
        }
        
        if (questions.length === 0) {
            authManager.showToast('Error', 'At least one question is required', 'error');
            return;
        }
        
        // Create exam
        const currentUser = authManager.getCurrentUser();
        const newExam = {
            id: utils.generateId(),
            title,
            description,
            duration,
            questions,
            createdBy: currentUser.id,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // Save exam
        const exams = utils.storage.get('exams') || [];
        exams.push(newExam);
        utils.storage.set('exams', exams);
        
        // Reset form
        e.target.reset();
        $('#questionsContainer').innerHTML = '';
        
        // Show success message
        authManager.showToast('Success', 'Exam created successfully!', 'success');
        
        // Switch to manage exams tab
        const manageTab = $('[data-tab="manageExams"]');
        if (manageTab) {
            manageTab.click();
        }
    }

    showAddUserModal() {
        this.showModal('Add User', `
            <form id="addUserForm">
                <div class="form-group">
                    <label for="userName">Full Name</label>
                    <input type="text" id="userName" required>
                </div>
                <div class="form-group">
                    <label for="userEmail">Email</label>
                    <input type="email" id="userEmail" required>
                </div>
                <div class="form-group">
                    <label for="userRole">Role</label>
                    <select id="userRole" required>
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="userPassword">Password</label>
                    <input type="password" id="userPassword" required>
                </div>
            </form>
        `, [
            { text: 'Cancel', class: 'btn-secondary', action: () => this.closeModal() },
            { text: 'Add User', class: 'btn-primary', action: () => this.addUser() }
        ]);
    }

    showAddExamModal() {
        this.showModal('Add Exam', `
            <form id="addExamForm">
                <div class="form-group">
                    <label for="modalExamTitle">Exam Title</label>
                    <input type="text" id="modalExamTitle" required>
                </div>
                <div class="form-group">
                    <label for="modalExamDuration">Duration (minutes)</label>
                    <input type="number" id="modalExamDuration" min="1" required>
                </div>
                <div class="form-group">
                    <label for="modalExamDescription">Description</label>
                    <textarea id="modalExamDescription" rows="3"></textarea>
                </div>
            </form>
        `, [
            { text: 'Cancel', class: 'btn-secondary', action: () => this.closeModal() },
            { text: 'Add Exam', class: 'btn-primary', action: () => this.addExam() }
        ]);
    }

    showModal(title, content, buttons = []) {
        $('#modalTitle').textContent = title;
        $('#modalBody').innerHTML = content;
        
        // Clear previous footer
        const modalFooter = $('.modal-footer');
        if (modalFooter) {
            modalFooter.innerHTML = '';
        }
        
        // Add buttons
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.className = button.class;
            btn.addEventListener('click', button.action);
            modalFooter.appendChild(btn);
        });
        
        utils.show($('#modalOverlay'));
    }

    closeModal() {
        utils.hide($('#modalOverlay'));
    }

    // Placeholder methods for CRUD operations
    editUser(userId) {
        authManager.showToast('Info', 'Edit user functionality would be implemented here', 'info');
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            const users = utils.storage.get('users') || [];
            const updatedUsers = users.filter(user => user.id !== userId);
            utils.storage.set('users', updatedUsers);
            this.loadUsersTable();
            this.updateAdminStats();
            authManager.showToast('Success', 'User deleted successfully', 'success');
        }
    }

    viewExam(examId) {
        authManager.showToast('Info', 'View exam functionality would be implemented here', 'info');
    }

    editExam(examId) {
        authManager.showToast('Info', 'Edit exam functionality would be implemented here', 'info');
    }

    deleteExam(examId) {
        if (confirm('Are you sure you want to delete this exam?')) {
            const exams = utils.storage.get('exams') || [];
            const updatedExams = exams.filter(exam => exam.id !== examId);
            utils.storage.set('exams', updatedExams);
            this.loadExamsTable();
            this.loadInstructorExamsTable();
            this.updateAdminStats();
            this.updateInstructorStats();
            authManager.showToast('Success', 'Exam deleted successfully', 'success');
        }
    }

    viewResult(resultId) {
        authManager.showToast('Info', 'View result functionality would be implemented here', 'info');
    }

    addUser() {
        const name = $('#userName').value;
        const email = $('#userEmail').value;
        const role = $('#userRole').value;
        const password = $('#userPassword').value;
        
        if (!name || !email || !role || !password) {
            authManager.showToast('Error', 'Please fill all fields', 'error');
            return;
        }
        
        const users = utils.storage.get('users') || [];
        if (users.some(user => user.email === email)) {
            authManager.showToast('Error', 'Email already exists', 'error');
            return;
        }
        
        const newUser = {
            id: utils.generateId(),
            name,
            email,
            password,
            role,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        utils.storage.set('users', users);
        
        this.closeModal();
        this.loadUsersTable();
        this.updateAdminStats();
        authManager.showToast('Success', 'User added successfully', 'success');
    }

    addExam() {
        const title = $('#modalExamTitle').value;
        const duration = parseInt($('#modalExamDuration').value);
        const description = $('#modalExamDescription').value;
        
        if (!title || !duration || duration <= 0) {
            authManager.showToast('Error', 'Please fill all required fields', 'error');
            return;
        }
        
        const currentUser = authManager.getCurrentUser();
        const newExam = {
            id: utils.generateId(),
            title,
            description,
            duration,
            questions: [],
            createdBy: currentUser.id,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        const exams = utils.storage.get('exams') || [];
        exams.push(newExam);
        utils.storage.set('exams', exams);
        
        this.closeModal();
        this.loadExamsTable();
        this.updateAdminStats();
        authManager.showToast('Success', 'Exam added successfully', 'success');
    }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();
window.dashboardManager = dashboardManager; 