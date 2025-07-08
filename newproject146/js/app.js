// Main Application File

class ExamSystem {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.showLoading();
            
            // Initialize modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize sample data if needed
            this.initializeSampleData();
            
            // Check authentication status
            this.checkInitialAuth();
            
            // Hide loading screen
            this.hideLoading();
            
            this.isInitialized = true;
            
            console.log('Exam System initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Exam System:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    async initializeModules() {
        // Wait for all modules to be available
        await this.waitForModules();
        
        // Initialize module references
        this.modules = {
            utils: window.utils,
            auth: window.authManager,
            dashboard: window.dashboardManager,
            exam: window.examManager,
            security: window.securityManager
        };
        
        // Verify all modules are loaded
        const missingModules = Object.entries(this.modules)
            .filter(([name, module]) => !module)
            .map(([name]) => name);
            
        if (missingModules.length > 0) {
            throw new Error(`Missing modules: ${missingModules.join(', ')}`);
        }
    }

    async waitForModules() {
        const requiredModules = ['utils', 'authManager', 'dashboardManager', 'examManager', 'securityManager'];
        const maxWaitTime = 10000; // 10 seconds
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            const loadedModules = requiredModules.filter(module => window[module]);
            
            if (loadedModules.length === requiredModules.length) {
                return true;
            }
            
            // Wait 100ms before checking again
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('Timeout waiting for modules to load');
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
        
        // Window resize handling
        window.addEventListener('resize', utils.debounce(() => {
            this.handleWindowResize();
        }, 250));
        
        // Online/offline status
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
        
        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Before unload warning
        window.addEventListener('beforeunload', (e) => {
            if (this.modules.exam.isExamInProgress()) {
                e.preventDefault();
                e.returnValue = 'You have an active exam. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }

    initializeSampleData() {
        // Create sample data only if it doesn't exist
        const users = utils.storage.get('users');
        const exams = utils.storage.get('exams');
        
        if (!users || users.length === 0) {
            this.createSampleUsers();
        }
        
        if (!exams || exams.length === 0) {
            this.createSampleExams();
        }
        
        // Initialize other data structures
        if (!utils.storage.get('examResults')) {
            utils.storage.set('examResults', []);
        }
        
        if (!utils.storage.get('securityLog')) {
            utils.storage.set('securityLog', []);
        }
    }

    createSampleUsers() {
        const sampleUsers = [
            {
                id: 'admin1',
                name: 'System Administrator',
                email: 'admin@exam.com',
                password: 'admin123',
                role: 'admin',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'instructor1',
                name: 'Dr. Sarah Johnson',
                email: 'instructor@exam.com',
                password: 'instructor123',
                role: 'instructor',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'student1',
                name: 'Alex Thompson',
                email: 'student@exam.com',
                password: 'student123',
                role: 'student',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        
        utils.storage.set('users', sampleUsers);
        console.log('Sample users created');
    }

    createSampleExams() {
        const sampleExams = [
            {
                id: 'exam1',
                title: 'JavaScript Fundamentals',
                description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
                duration: 30,
                questions: [
                    {
                        id: 'q1',
                        text: 'What is JavaScript?',
                        options: [
                            'A programming language',
                            'A markup language',
                            'A styling language',
                            'A database system'
                        ],
                        correctAnswer: 0
                    },
                    {
                        id: 'q2',
                        text: 'Which keyword is used to declare a variable in JavaScript?',
                        options: [
                            'var',
                            'let',
                            'const',
                            'All of the above'
                        ],
                        correctAnswer: 3
                    },
                    {
                        id: 'q3',
                        text: 'What is the result of 2 + "2" in JavaScript?',
                        options: [
                            '4',
                            '22',
                            'NaN',
                            'Error'
                        ],
                        correctAnswer: 1
                    },
                    {
                        id: 'q4',
                        text: 'Which method is used to add an element to the end of an array?',
                        options: [
                            'push()',
                            'pop()',
                            'shift()',
                            'unshift()'
                        ],
                        correctAnswer: 0
                    },
                    {
                        id: 'q5',
                        text: 'What is the purpose of the typeof operator?',
                        options: [
                            'To check if a variable is defined',
                            'To get the data type of a value',
                            'To convert a value to a string',
                            'To check if a value is null'
                        ],
                        correctAnswer: 1
                    }
                ],
                createdBy: 'instructor1',
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'exam2',
                title: 'HTML and CSS Basics',
                description: 'Test your understanding of HTML structure and CSS styling fundamentals.',
                duration: 45,
                questions: [
                    {
                        id: 'q1',
                        text: 'What does HTML stand for?',
                        options: [
                            'Hyper Text Markup Language',
                            'High Tech Modern Language',
                            'Home Tool Markup Language',
                            'Hyperlink and Text Markup Language'
                        ],
                        correctAnswer: 0
                    },
                    {
                        id: 'q2',
                        text: 'Which HTML tag is used to create a hyperlink?',
                        options: [
                            '<link>',
                            '<a>',
                            '<href>',
                            '<url>'
                        ],
                        correctAnswer: 1
                    },
                    {
                        id: 'q3',
                        text: 'What does CSS stand for?',
                        options: [
                            'Computer Style Sheets',
                            'Creative Style Sheets',
                            'Cascading Style Sheets',
                            'Colorful Style Sheets'
                        ],
                        correctAnswer: 2
                    },
                    {
                        id: 'q4',
                        text: 'Which CSS property controls the text size?',
                        options: [
                            'font-style',
                            'font-size',
                            'text-size',
                            'size'
                        ],
                        correctAnswer: 1
                    },
                    {
                        id: 'q5',
                        text: 'How do you add a comment in HTML?',
                        options: [
                            '<!-- Comment -->',
                            '// Comment',
                            '/* Comment */',
                            '<!-- Comment --!>'
                        ],
                        correctAnswer: 0
                    }
                ],
                createdBy: 'instructor1',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
        
        utils.storage.set('exams', sampleExams);
        console.log('Sample exams created');
    }

    checkInitialAuth() {
        // Check if user is already authenticated
        const isAuthenticated = this.modules.auth.isUserAuthenticated();
        
        if (isAuthenticated) {
            // User is already logged in, show appropriate dashboard
            this.modules.auth.updateUI();
        } else {
            // Show login form
            this.modules.auth.showLogin();
        }
    }

    handleGlobalKeydown(e) {
        // Global keyboard shortcuts (only when not in exam mode)
        if (this.modules.exam.isExamInProgress()) {
            return; // Let exam manager handle keyboard events
        }
        
        // Ctrl/Cmd + K: Quick search (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showQuickSearch();
        }
        
        // Ctrl/Cmd + L: Logout
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            this.modules.auth.logout();
        }
        
        // Escape: Close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    handleWindowResize() {
        // Handle responsive design adjustments
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Add responsive classes to body
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('desktop', !isMobile && !isTablet);
    }

    handleOnlineStatus(isOnline) {
        if (isOnline) {
            this.modules.auth.showToast('Connection Restored', 'You are back online', 'success');
        } else {
            this.modules.auth.showToast('Connection Lost', 'You are offline. Some features may not work.', 'warning');
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden
            if (this.modules.exam.isExamInProgress()) {
                this.modules.exam.handleTabSwitch();
            }
        } else {
            // Page is visible again
            console.log('Page became visible');
        }
    }

    showLoading() {
        const loadingScreen = $('#loadingScreen');
        if (loadingScreen) {
            utils.show(loadingScreen);
        }
    }

    hideLoading() {
        const loadingScreen = $('#loadingScreen');
        if (loadingScreen) {
            // Add a small delay for smooth transition
            setTimeout(() => {
                utils.hide(loadingScreen);
            }, 500);
        }
    }

    showError(message) {
        // Hide loading screen
        this.hideLoading();
        
        // Show error message
        const errorHtml = `
            <div class="error-container">
                <div class="error-icon">❌</div>
                <h2>Application Error</h2>
                <p>${message}</p>
                <button class="btn-primary" onclick="location.reload()">Reload Page</button>
            </div>
        `;
        
        document.body.innerHTML = errorHtml;
    }

    showQuickSearch() {
        // Placeholder for quick search functionality
        this.modules.auth.showToast('Info', 'Quick search feature coming soon!', 'info');
    }

    closeAllModals() {
        // Close any open modals
        utils.hide($('#modalOverlay'));
        utils.hide($('#securityModal'));
    }

    // Public API methods
    getModule(name) {
        return this.modules[name];
    }

    isReady() {
        return this.isInitialized;
    }

    // Utility methods for external access
    startExam(examId) {
        if (this.modules.exam) {
            this.modules.exam.startExam(examId);
        }
    }

    logout() {
        if (this.modules.auth) {
            this.modules.auth.logout();
        }
    }

    showDashboard() {
        if (this.modules.auth) {
            this.modules.auth.showDashboard();
        }
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                console.log(`Memory usage: ${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(memory.totalJSHeapSize / 1048576)}MB`);
            }, 30000); // Every 30 seconds
        }
    }

    // Error handling
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError('Global error', e.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError('Unhandled promise rejection', e.reason);
        });
    }

    logError(type, error) {
        const errorLog = utils.storage.get('errorLog') || [];
        errorLog.push({
            type,
            message: error.message || error,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // Keep only last 100 errors
        if (errorLog.length > 100) {
            errorLog.splice(0, errorLog.length - 100);
        }
        
        utils.storage.set('errorLog', errorLog);
    }

    // Cleanup method
    cleanup() {
        // Stop any running timers
        if (this.modules.exam) {
            this.modules.exam.timer && clearInterval(this.modules.exam.timer);
        }
        
        if (this.modules.security) {
            this.modules.security.stopMonitoring();
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleGlobalKeydown);
        window.removeEventListener('resize', this.handleWindowResize);
        window.removeEventListener('online', this.handleOnlineStatus);
        window.removeEventListener('offline', this.handleOnlineStatus);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global application instance
    window.examSystem = new ExamSystem();
    
    // Start performance monitoring
    window.examSystem.startPerformanceMonitoring();
    
    // Setup error handling
    window.examSystem.setupErrorHandling();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.examSystem) {
            window.examSystem.cleanup();
        }
    });
});

// Export for global access
window.ExamSystem = ExamSystem; 