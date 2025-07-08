// Security Module for Anti-Cheating Measures

class SecurityManager {
    constructor() {
        this.isActive = false;
        this.securityEvents = [];
        this.screenshotAttempts = 0;
        this.tabSwitchCount = 0;
        this.focusLossCount = 0;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Global security events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Window events
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        window.addEventListener('unload', () => this.handleUnload());
        
        // Visibility and focus events
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        window.addEventListener('focus', () => this.handleWindowFocus());
        window.addEventListener('blur', () => this.handleWindowBlur());
        
        // Fullscreen events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
    }

    enableExamMode() {
        this.isActive = true;
        this.securityEvents = [];
        this.screenshotAttempts = 0;
        this.tabSwitchCount = 0;
        this.focusLossCount = 0;
        
        // Enable strict security measures
        this.enableStrictMode();
        
        // Start monitoring
        this.startMonitoring();
        
        console.log('Security mode enabled');
    }

    disableExamMode() {
        this.isActive = false;
        
        // Disable strict security measures
        this.disableStrictMode();
        
        // Stop monitoring
        this.stopMonitoring();
        
        // Log final security report
        this.generateSecurityReport();
        
        console.log('Security mode disabled');
    }

    enableStrictMode() {
        // Disable right-click context menu
        document.addEventListener('contextmenu', this.preventContextMenu);
        
        // Disable text selection
        document.addEventListener('selectstart', this.preventSelection);
        document.addEventListener('dragstart', this.preventDrag);
        
        // Disable copy/paste
        document.addEventListener('copy', this.preventCopy);
        document.addEventListener('paste', this.preventPaste);
        document.addEventListener('cut', this.preventCut);
        
        // Disable developer tools shortcuts
        document.addEventListener('keydown', this.preventDevTools);
        
        // Disable print screen
        document.addEventListener('keydown', this.preventPrintScreen);
        
        // Disable F12 and other debug keys
        document.addEventListener('keydown', this.preventDebugKeys);
    }

    disableStrictMode() {
        // Remove all event listeners
        document.removeEventListener('contextmenu', this.preventContextMenu);
        document.removeEventListener('selectstart', this.preventSelection);
        document.removeEventListener('dragstart', this.preventDrag);
        document.removeEventListener('copy', this.preventCopy);
        document.removeEventListener('paste', this.preventPaste);
        document.removeEventListener('cut', this.preventCut);
        document.removeEventListener('keydown', this.preventDevTools);
        document.removeEventListener('keydown', this.preventPrintScreen);
        document.removeEventListener('keydown', this.preventDebugKeys);
    }

    preventContextMenu = (e) => {
        e.preventDefault();
        this.logSecurityEvent('right_click_attempt', {
            x: e.clientX,
            y: e.clientY
        });
        this.showSecurityWarning('Right-click is disabled during the exam');
        return false;
    };

    preventSelection = (e) => {
        e.preventDefault();
        this.logSecurityEvent('text_selection_attempt');
        return false;
    };

    preventDrag = (e) => {
        e.preventDefault();
        this.logSecurityEvent('drag_attempt');
        return false;
    };

    preventCopy = (e) => {
        e.preventDefault();
        this.logSecurityEvent('copy_attempt');
        this.showSecurityWarning('Copy is disabled during the exam');
        return false;
    };

    preventPaste = (e) => {
        e.preventDefault();
        this.logSecurityEvent('paste_attempt');
        this.showSecurityWarning('Paste is disabled during the exam');
        return false;
    };

    preventCut = (e) => {
        e.preventDefault();
        this.logSecurityEvent('cut_attempt');
        this.showSecurityWarning('Cut is disabled during the exam');
        return false;
    };

    preventDevTools = (e) => {
        // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            this.logSecurityEvent('dev_tools_attempt', { key: e.key });
            this.showSecurityWarning('Developer tools are disabled during the exam');
            return false;
        }
    };

    preventPrintScreen = (e) => {
        // Prevent Print Screen key
        if (e.key === 'PrintScreen' || e.key === 'PrtScn') {
            e.preventDefault();
            this.screenshotAttempts++;
            this.logSecurityEvent('screenshot_attempt', { 
                attempts: this.screenshotAttempts 
            });
            this.showSecurityWarning('Screenshots are disabled during the exam');
            return false;
        }
    };

    preventDebugKeys = (e) => {
        // Prevent other debug keys
        const debugKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11'];
        if (debugKeys.includes(e.key)) {
            e.preventDefault();
            this.logSecurityEvent('debug_key_attempt', { key: e.key });
            this.showSecurityWarning('Debug keys are disabled during the exam');
            return false;
        }
    };

    handleKeyDown(e) {
        if (!this.isActive) return;
        
        // Log suspicious key combinations
        if (e.ctrlKey || e.metaKey) {
            this.logSecurityEvent('modifier_key_press', {
                key: e.key,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey
            });
        }
    }

    handleKeyUp(e) {
        if (!this.isActive) return;
        
        // Monitor for rapid key presses (potential automation)
        this.detectRapidKeyPresses(e);
    }

    handleMouseDown(e) {
        if (!this.isActive) return;
        
        // Log mouse activity for pattern analysis
        this.logSecurityEvent('mouse_down', {
            x: e.clientX,
            y: e.clientY,
            button: e.button
        });
    }

    handleMouseUp(e) {
        if (!this.isActive) return;
        
        this.logSecurityEvent('mouse_up', {
            x: e.clientX,
            y: e.clientY,
            button: e.button
        });
    }

    handleBeforeUnload(e) {
        if (this.isActive) {
            this.logSecurityEvent('page_unload_attempt');
            
            // Show warning message
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
            return e.returnValue;
        }
    }

    handleUnload() {
        if (this.isActive) {
            this.logSecurityEvent('page_unloaded');
            // Could send final data to server here
        }
    }

    handleVisibilityChange() {
        if (!this.isActive) return;
        
        if (document.hidden) {
            this.tabSwitchCount++;
            this.logSecurityEvent('tab_switch', { 
                count: this.tabSwitchCount 
            });
            this.showSecurityWarning('Tab switching detected. This action is logged.');
        } else {
            this.logSecurityEvent('tab_return');
        }
    }

    handleWindowFocus() {
        if (this.isActive) {
            this.logSecurityEvent('window_focus');
        }
    }

    handleWindowBlur() {
        if (this.isActive) {
            this.focusLossCount++;
            this.logSecurityEvent('window_blur', { 
                count: this.focusLossCount 
            });
            this.showSecurityWarning('Window focus lost. This action is logged.');
        }
    }

    handleFullscreenChange() {
        if (this.isActive) {
            const isFullscreen = !!(document.fullscreenElement || 
                                   document.webkitFullscreenElement || 
                                   document.mozFullScreenElement || 
                                   document.msFullscreenElement);
            
            this.logSecurityEvent('fullscreen_change', { isFullscreen });
            
            if (!isFullscreen) {
                this.showSecurityWarning('Fullscreen mode exited. Please return to fullscreen.');
            }
        }
    }

    detectRapidKeyPresses(e) {
        // Simple rapid key press detection
        const now = Date.now();
        const recentPresses = this.securityEvents.filter(event => 
            event.type === 'key_press' && 
            now - event.timestamp < 1000
        );
        
        if (recentPresses.length > 10) {
            this.logSecurityEvent('rapid_key_press_detected', {
                presses: recentPresses.length,
                timeWindow: '1 second'
            });
            this.showSecurityWarning('Unusual typing pattern detected.');
        }
    }

    startMonitoring() {
        // Start periodic monitoring
        this.monitoringInterval = setInterval(() => {
            this.performSecurityChecks();
        }, 5000); // Check every 5 seconds
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    performSecurityChecks() {
        if (!this.isActive) return;

        // Check for multiple windows/tabs
        this.checkMultipleWindows();
        
        // Check for suspicious activity patterns
        this.analyzeActivityPatterns();
        
        // Check for developer tools
        this.checkDeveloperTools();
    }

    checkMultipleWindows() {
        // Simple check for multiple windows (not 100% reliable)
        if (window.opener && !window.opener.closed) {
            this.logSecurityEvent('multiple_windows_detected');
            this.showSecurityWarning('Multiple windows detected. Please close other windows.');
        }
    }

    analyzeActivityPatterns() {
        const recentEvents = this.securityEvents.filter(event => 
            Date.now() - event.timestamp < 30000 // Last 30 seconds
        );

        // Check for suspicious patterns
        const tabSwitches = recentEvents.filter(e => e.type === 'tab_switch').length;
        const focusLosses = recentEvents.filter(e => e.type === 'window_blur').length;
        const rightClicks = recentEvents.filter(e => e.type === 'right_click_attempt').length;

        if (tabSwitches > 3 || focusLosses > 5 || rightClicks > 2) {
            this.logSecurityEvent('suspicious_activity_pattern', {
                tabSwitches,
                focusLosses,
                rightClicks
            });
            this.showSecurityWarning('Suspicious activity pattern detected.');
        }
    }

    checkDeveloperTools() {
        // Check if developer tools are open (not 100% reliable)
        const devtools = {
            open: false,
            orientation: null
        };

        const threshold = 160;

        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            devtools.open = true;
            devtools.orientation = window.outerHeight - window.innerHeight > threshold ? 'vertical' : 'horizontal';
        }

        if (devtools.open) {
            this.logSecurityEvent('developer_tools_detected', devtools);
            this.showSecurityWarning('Developer tools detected. Please close them.');
        }
    }

    logSecurityEvent(type, data = {}) {
        const event = {
            type,
            timestamp: Date.now(),
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.securityEvents.push(event);

        // Also save to localStorage for persistence
        const securityLog = utils.storage.get('securityLog') || [];
        securityLog.push(event);
        utils.storage.set('securityLog', securityLog);

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Security Event:', event);
        }
    }

    showSecurityWarning(message) {
        // Show toast notification
        if (window.authManager && window.authManager.showToast) {
            window.authManager.showToast('Security Warning', message, 'warning');
        }

        // Show modal for serious violations
        if (this.shouldShowModal(message)) {
            this.showSecurityModal(message);
        }
    }

    shouldShowModal(message) {
        const seriousViolations = [
            'developer tools detected',
            'multiple windows detected',
            'suspicious activity pattern'
        ];
        
        return seriousViolations.some(violation => 
            message.toLowerCase().includes(violation)
        );
    }

    showSecurityModal(message) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal security-modal">
                <div class="modal-header">
                    <h3>🚨 Security Violation</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                    <p><strong>This violation has been logged and may result in exam termination.</strong></p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">
                        Acknowledge
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 10000);
    }

    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            duration: this.getSessionDuration(),
            events: this.securityEvents,
            summary: {
                totalEvents: this.securityEvents.length,
                tabSwitches: this.tabSwitchCount,
                focusLosses: this.focusLossCount,
                screenshotAttempts: this.screenshotAttempts,
                suspiciousPatterns: this.securityEvents.filter(e => 
                    e.type.includes('suspicious') || e.type.includes('detected')
                ).length
            }
        };

        // Save report
        const reports = utils.storage.get('securityReports') || [];
        reports.push(report);
        utils.storage.set('securityReports', reports);

        return report;
    }

    getSessionDuration() {
        if (this.securityEvents.length === 0) return 0;
        
        const firstEvent = this.securityEvents[0];
        const lastEvent = this.securityEvents[this.securityEvents.length - 1];
        
        return lastEvent.timestamp - firstEvent.timestamp;
    }

    // Get security statistics
    getSecurityStats() {
        return {
            totalEvents: this.securityEvents.length,
            tabSwitches: this.tabSwitchCount,
            focusLosses: this.focusLossCount,
            screenshotAttempts: this.screenshotAttempts,
            isActive: this.isActive
        };
    }

    // Clear security log
    clearSecurityLog() {
        this.securityEvents = [];
        utils.storage.remove('securityLog');
        utils.storage.remove('securityReports');
    }
}

// Initialize security manager
const securityManager = new SecurityManager();
window.securityManager = securityManager;

// Export security functions for use in exam manager
window.enableExamSecurity = () => securityManager.enableExamMode();
window.disableExamSecurity = () => securityManager.disableExamMode(); 