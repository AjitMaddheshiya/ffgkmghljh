// Authentication Module

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check for existing session
        this.checkSession();
        this.bindEvents();
    }

    bindEvents() {
        // Login form
        const loginForm = $('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = $('#signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Navigation between login/signup
        const showSignupLink = $('#showSignup');
        const showLoginLink = $('#showLogin');
        
        if (showSignupLink) {
            showSignupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignup();
            });
        }

        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLogin();
            });
        }

        // Logout button
        const logoutBtn = $('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    checkSession() {
        const session = utils.storage.get('examSession');
        if (session && session.user && session.expires > Date.now()) {
            this.currentUser = session.user;
            this.isAuthenticated = true;
            this.updateUI();
            return true;
        } else {
            // Clear expired session
            utils.storage.remove('examSession');
            return false;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validate form
        const errors = utils.validateForm(
            { email, password },
            {
                email: [
                    { type: 'required', message: 'Email is required' },
                    { type: 'email', message: 'Invalid email format' }
                ],
                password: [
                    { type: 'required', message: 'Password is required' },
                    { type: 'password', message: 'Password must be at least 6 characters' }
                ]
            }
        );

        if (Object.keys(errors).length > 0) {
            utils.displayFormErrors(errors);
            return;
        }

        // Clear previous errors
        utils.clearFormErrors();

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;

        try {
            const success = await this.login(email, password);
            if (success) {
                this.showToast('Success', 'Login successful!', 'success');
                this.redirectToDashboard();
            } else {
                this.showToast('Error', 'Invalid email or password', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showToast('Error', 'Login failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const role = formData.get('role');

        // Validate form
        const errors = utils.validateForm(
            { name, email, password, role },
            {
                name: [
                    { type: 'required', message: 'Name is required' },
                    { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
                ],
                email: [
                    { type: 'required', message: 'Email is required' },
                    { type: 'email', message: 'Invalid email format' }
                ],
                password: [
                    { type: 'required', message: 'Password is required' },
                    { type: 'password', message: 'Password must be at least 6 characters' }
                ],
                role: [
                    { type: 'required', message: 'Please select a role' }
                ]
            }
        );

        if (Object.keys(errors).length > 0) {
            utils.displayFormErrors(errors);
            return;
        }

        // Clear previous errors
        utils.clearFormErrors();

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;

        try {
            const success = await this.signup(name, email, password, role);
            if (success) {
                this.showToast('Success', 'Account created successfully!', 'success');
                this.showLogin();
            } else {
                this.showToast('Error', 'Email already exists', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showToast('Error', 'Signup failed. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async login(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get users from storage
        const users = utils.storage.get('users') || [];
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Create session
            const session = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            };

            utils.storage.set('examSession', session);
            this.currentUser = session.user;
            this.isAuthenticated = true;
            return true;
        }

        return false;
    }

    async signup(name, email, password, role) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get existing users
        const users = utils.storage.get('users') || [];
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            return false;
        }

        // Create new user
        const newUser = {
            id: utils.generateId(),
            name,
            email,
            password,
            role,
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        // Add to users array
        users.push(newUser);
        utils.storage.set('users', users);

        return true;
    }

    logout() {
        // Clear session
        utils.storage.remove('examSession');
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Update UI
        this.updateUI();
        
        // Show login
        this.showLogin();
        
        this.showToast('Success', 'Logged out successfully', 'success');
    }

    showLogin() {
        utils.hide($('#signupSection'));
        utils.show($('#loginSection'));
        utils.hide($('#header'));
        
        // Clear forms
        $('#loginForm').reset();
        $('#signupForm').reset();
        utils.clearFormErrors();
    }

    showSignup() {
        utils.hide($('#loginSection'));
        utils.show($('#signupSection'));
        utils.hide($('#header'));
        
        // Clear forms
        $('#loginForm').reset();
        $('#signupForm').reset();
        utils.clearFormErrors();
    }

    updateUI() {
        if (this.isAuthenticated && this.currentUser) {
            // Show header
            utils.show($('#header'));
            
            // Update user info
            $('#userName').textContent = this.currentUser.name;
            $('#userRole').textContent = this.currentUser.role;
            
            // Hide auth sections
            utils.hide($('#loginSection'));
            utils.hide($('#signupSection'));
            
            // Show appropriate dashboard
            this.showDashboard();
        } else {
            // Hide header and dashboards
            utils.hide($('#header'));
            utils.hide($('#adminDashboard'));
            utils.hide($('#instructorDashboard'));
            utils.hide($('#studentDashboard'));
            utils.hide($('#examInterface'));
            
            // Show login
            this.showLogin();
        }
    }

    showDashboard() {
        // Hide all dashboards first
        utils.hide($('#adminDashboard'));
        utils.hide($('#instructorDashboard'));
        utils.hide($('#studentDashboard'));
        utils.hide($('#examInterface'));

        // Show appropriate dashboard based on role
        switch (this.currentUser.role) {
            case 'admin':
                utils.show($('#adminDashboard'));
                if (window.dashboardManager) {
                    window.dashboardManager.loadAdminDashboard();
                }
                break;
            case 'instructor':
                utils.show($('#instructorDashboard'));
                if (window.dashboardManager) {
                    window.dashboardManager.loadInstructorDashboard();
                }
                break;
            case 'student':
                utils.show($('#studentDashboard'));
                if (window.dashboardManager) {
                    window.dashboardManager.loadStudentDashboard();
                }
                break;
        }
    }

    redirectToDashboard() {
        this.updateUI();
    }

    showToast(title, message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = $('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Add to container
        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    // Check user role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Require authentication
    requireAuth() {
        if (!this.isAuthenticated) {
            this.showLogin();
            return false;
        }
        return true;
    }

    // Require specific role
    requireRole(role) {
        if (!this.requireAuth()) {
            return false;
        }
        
        if (!this.hasRole(role)) {
            this.showToast('Access Denied', 'You do not have permission to access this page', 'error');
            return false;
        }
        
        return true;
    }
}

// Initialize authentication manager
const authManager = new AuthManager();
window.authManager = authManager; 