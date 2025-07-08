// Exam Management Module

class ExamManager {
    constructor() {
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.timer = null;
        this.timeRemaining = 0;
        this.isExamActive = false;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Exam navigation
        $('#prevQuestion')?.addEventListener('click', () => this.previousQuestion());
        $('#nextQuestion')?.addEventListener('click', () => this.nextQuestion());
        $('#submitExam')?.addEventListener('click', () => this.submitExam());

        // Question indicators
        $('#questionIndicators')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('question-indicator')) {
                const questionIndex = parseInt(e.target.dataset.index);
                this.goToQuestion(questionIndex);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    async startExam(examId) {
        const exams = utils.storage.get('exams') || [];
        const exam = exams.find(e => e.id === examId);
        
        if (!exam) {
            authManager.showToast('Error', 'Exam not found', 'error');
            return;
        }

        // Check if user has already taken this exam
        const results = utils.storage.get('examResults') || [];
        const currentUser = authManager.getCurrentUser();
        const existingResult = results.find(r => 
            r.examId === examId && r.studentId === currentUser.id
        );

        if (existingResult) {
            authManager.showToast('Error', 'You have already taken this exam', 'error');
            return;
        }

        // Show confirmation dialog
        this.showExamConfirmation(exam, () => {
            this.initializeExam(exam);
        });
    }

    showExamConfirmation(exam, onConfirm) {
        this.showModal('Start Exam', `
            <div class="exam-instructions">
                <h4>Exam Instructions</h4>
                <ul>
                    <li>You have ${exam.duration} minutes to complete this exam</li>
                    <li>You cannot go back once you submit</li>
                    <li>Do not refresh the page during the exam</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>You can navigate between questions using the buttons</li>
                </ul>
            </div>
            <div class="confirmation-dialog">
                <div class="icon">📝</div>
                <h3>${exam.title}</h3>
                <p><strong>Duration:</strong> ${exam.duration} minutes</p>
                <p><strong>Questions:</strong> ${exam.questions.length}</p>
                <p><strong>Description:</strong> ${exam.description}</p>
            </div>
        `, [
            { text: 'Cancel', class: 'btn-secondary', action: () => this.closeModal() },
            { text: 'Start Exam', class: 'btn-primary', action: onConfirm }
        ]);
    }

    initializeExam(exam) {
        this.currentExam = exam;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.timeRemaining = exam.duration * 60; // Convert to seconds
        this.isExamActive = true;

        // Hide dashboard and show exam interface
        utils.hide($('#adminDashboard'));
        utils.hide($('#instructorDashboard'));
        utils.hide($('#studentDashboard'));
        utils.show($('#examInterface'));

        // Update exam info
        $('#examTitle').textContent = exam.title;
        $('#examDescription').textContent = exam.description;
        $('#totalQuestions').textContent = exam.questions.length;

        // Load first question
        this.loadQuestion(0);

        // Start timer
        this.startTimer();

        // Initialize security measures
        this.initializeSecurity();

        // Close modal
        this.closeModal();

        authManager.showToast('Success', 'Exam started! Good luck!', 'success');
    }

    loadQuestion(index) {
        if (!this.currentExam || index < 0 || index >= this.currentExam.questions.length) {
            return;
        }

        this.currentQuestionIndex = index;
        const question = this.currentExam.questions[index];

        // Update question number
        $('#questionNumber').textContent = `Question ${index + 1}`;

        // Update question text
        $('#questionText').textContent = question.text;

        // Update options
        const optionsContainer = $('#questionOptions');
        optionsContainer.innerHTML = question.options.map((option, optionIndex) => `
            <div class="option-item ${this.answers[index] === optionIndex ? 'selected' : ''}" 
                 onclick="examManager.selectOption(${optionIndex})">
                <input type="radio" name="question_${index}" value="${optionIndex}" 
                       ${this.answers[index] === optionIndex ? 'checked' : ''}>
                <label>${option}</label>
            </div>
        `).join('');

        // Update navigation buttons
        $('#prevQuestion').disabled = index === 0;
        $('#nextQuestion').disabled = index === this.currentExam.questions.length - 1;

        // Update question indicators
        this.updateQuestionIndicators();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    selectOption(optionIndex) {
        this.answers[this.currentQuestionIndex] = optionIndex;
        
        // Update UI
        const optionItems = $$('.option-item');
        optionItems.forEach((item, index) => {
            item.classList.toggle('selected', index === optionIndex);
        });

        const radioButtons = $$('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
            radio.checked = index === optionIndex;
        });

        // Update question indicators
        this.updateQuestionIndicators();
    }

    updateQuestionIndicators() {
        const container = $('#questionIndicators');
        container.innerHTML = this.currentExam.questions.map((_, index) => {
            let className = 'question-indicator';
            if (index === this.currentQuestionIndex) {
                className += ' current';
            } else if (this.answers[index] !== undefined) {
                className += ' answered';
            } else {
                className += ' unanswered';
            }

            return `<div class="${className}" data-index="${index}">${index + 1}</div>`;
        }).join('');
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.loadQuestion(this.currentQuestionIndex - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }
    }

    goToQuestion(index) {
        if (index >= 0 && index < this.currentExam.questions.length) {
            this.loadQuestion(index);
        }
    }

    startTimer() {
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.autoSubmitExam();
            } else if (this.timeRemaining <= 300) { // 5 minutes warning
                this.showTimeWarning();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const time = utils.formatTime(this.timeRemaining);
        $('#timerMinutes').textContent = time.minutes;
        $('#timerSeconds').textContent = time.seconds;

        // Add warning class when time is low
        const timerDisplay = $('.timer-display');
        if (this.timeRemaining <= 300) { // 5 minutes
            timerDisplay.classList.add('warning');
        } else {
            timerDisplay.classList.remove('warning');
        }
    }

    showTimeWarning() {
        if (this.timeRemaining === 300) { // Show warning only once at 5 minutes
            authManager.showToast('Warning', 'Only 5 minutes remaining!', 'warning');
        }
    }

    autoSubmitExam() {
        clearInterval(this.timer);
        authManager.showToast('Time Up', 'Time has expired. Submitting exam automatically.', 'warning');
        this.submitExam(true);
    }

    async submitExam(autoSubmit = false) {
        if (!autoSubmit) {
            const confirmed = await this.showSubmitConfirmation();
            if (!confirmed) return;
        }

        // Stop timer
        clearInterval(this.timer);
        this.isExamActive = false;

        // Calculate score
        const score = this.calculateScore();
        const timeTaken = this.currentExam.duration - Math.ceil(this.timeRemaining / 60);

        // Save result
        const results = utils.storage.get('examResults') || [];
        const currentUser = authManager.getCurrentUser();
        const result = {
            id: utils.generateId(),
            examId: this.currentExam.id,
            studentId: currentUser.id,
            score: score,
            timeTaken: timeTaken,
            answers: this.answers,
            completedAt: new Date().toISOString()
        };

        results.push(result);
        utils.storage.set('examResults', results);

        // Show results
        this.showExamResults(result);

        // Disable security measures
        this.disableSecurity();
    }

    async showSubmitConfirmation() {
        return new Promise((resolve) => {
            this.showModal('Submit Exam', `
                <div class="confirmation-dialog">
                    <div class="icon warning">⚠️</div>
                    <h3>Are you sure you want to submit?</h3>
                    <p>You cannot change your answers after submission.</p>
                    <p><strong>Questions answered:</strong> ${Object.keys(this.answers).length}/${this.currentExam.questions.length}</p>
                    <p><strong>Time remaining:</strong> ${Math.ceil(this.timeRemaining / 60)} minutes</p>
                </div>
            `, [
                { text: 'Cancel', class: 'btn-secondary', action: () => {
                    this.closeModal();
                    resolve(false);
                }},
                { text: 'Submit Exam', class: 'btn-danger', action: () => {
                    this.closeModal();
                    resolve(true);
                }}
            ]);
        });
    }

    calculateScore() {
        let correctAnswers = 0;
        
        this.currentExam.questions.forEach((question, index) => {
            if (this.answers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        return Math.round((correctAnswers / this.currentExam.questions.length) * 100);
    }

    showExamResults(result) {
        const answeredCount = Object.keys(this.answers).length;
        const totalQuestions = this.currentExam.questions.length;
        const unansweredCount = totalQuestions - answeredCount;

        this.showModal('Exam Results', `
            <div class="confirmation-dialog">
                <div class="icon success">🎉</div>
                <h3>Exam Completed!</h3>
                <div class="results-summary">
                    <p><strong>Score:</strong> ${result.score}%</p>
                    <p><strong>Time Taken:</strong> ${result.timeTaken} minutes</p>
                    <p><strong>Questions Answered:</strong> ${answeredCount}/${totalQuestions}</p>
                    <p><strong>Unanswered:</strong> ${unansweredCount}</p>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${result.score}%"></div>
                </div>
            </div>
        `, [
            { text: 'Back to Dashboard', class: 'btn-primary', action: () => {
                this.closeModal();
                this.returnToDashboard();
            }}
        ]);
    }

    returnToDashboard() {
        // Reset exam state
        this.currentExam = null;
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.timeRemaining = 0;
        this.isExamActive = false;

        // Hide exam interface
        utils.hide($('#examInterface'));

        // Show appropriate dashboard
        authManager.showDashboard();
    }

    initializeSecurity() {
        // Disable right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            authManager.showToast('Warning', 'Right-click is disabled during exam', 'warning');
        });

        // Disable keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                authManager.showToast('Warning', 'Keyboard shortcuts are disabled during exam', 'warning');
            }
        });

        // Disable text selection
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });

        // Disable copy/paste
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            authManager.showToast('Warning', 'Copy is disabled during exam', 'warning');
        });

        document.addEventListener('paste', (e) => {
            e.preventDefault();
            authManager.showToast('Warning', 'Paste is disabled during exam', 'warning');
        });

        // Detect tab switching
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isExamActive) {
                this.handleTabSwitch();
            }
        });

        // Detect window focus loss
        window.addEventListener('blur', () => {
            if (this.isExamActive) {
                this.handleTabSwitch();
            }
        });
    }

    disableSecurity() {
        // Re-enable all disabled features
        document.removeEventListener('contextmenu', this.handleContextMenu);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('selectstart', this.handleSelectStart);
        document.removeEventListener('copy', this.handleCopy);
        document.removeEventListener('paste', this.handlePaste);
    }

    handleTabSwitch() {
        // Show security warning modal
        utils.show($('#securityModal'));
        
        // Log the attempt
        console.warn('Tab switch detected during exam');
        
        // You could send this to a server for monitoring
        this.logSecurityEvent('tab_switch');
    }

    handleKeyboardShortcuts(e) {
        if (!this.isExamActive) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousQuestion();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextQuestion();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                e.preventDefault();
                const optionIndex = parseInt(e.key) - 1;
                if (optionIndex < this.currentExam.questions[this.currentQuestionIndex].options.length) {
                    this.selectOption(optionIndex);
                }
                break;
            case 'Enter':
                e.preventDefault();
                if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
                    this.nextQuestion();
                } else {
                    this.submitExam();
                }
                break;
        }
    }

    logSecurityEvent(eventType) {
        const securityLog = utils.storage.get('securityLog') || [];
        securityLog.push({
            eventType,
            timestamp: new Date().toISOString(),
            userId: authManager.getCurrentUser()?.id,
            examId: this.currentExam?.id
        });
        utils.storage.set('securityLog', securityLog);
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

    // Return to exam from security modal
    returnToExam() {
        utils.hide($('#securityModal'));
        authManager.showToast('Warning', 'Please stay on the exam page', 'warning');
    }

    // Get current exam
    getCurrentExam() {
        return this.currentExam;
    }

    // Get current answers
    getAnswers() {
        return this.answers;
    }

    // Get time remaining
    getTimeRemaining() {
        return this.timeRemaining;
    }

    // Check if exam is active
    isExamInProgress() {
        return this.isExamActive;
    }
}

// Initialize exam manager
const examManager = new ExamManager();
window.examManager = examManager;

// Handle return to exam button
$('#returnToExam')?.addEventListener('click', () => {
    examManager.returnToExam();
}); 