// M1dn1ght - Chromebook Unenrollment Tool
// Web Interface Controller

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkInitialStatus();
});

function initializeEventListeners() {
    const checkStatusBtn = document.getElementById('checkStatusBtn');
    const unenrollBtn = document.getElementById('unenrollBtn');
    const factoryResetBtn = document.getElementById('factoryResetBtn');

    if (checkStatusBtn) {
        checkStatusBtn.addEventListener('click', checkEnrollmentStatus);
    }
    if (unenrollBtn) {
        unenrollBtn.addEventListener('click', initiateUnenrollment);
    }
    if (factoryResetBtn) {
        factoryResetBtn.addEventListener('click', initiateFactoryReset);
    }
}

function checkInitialStatus() {
    console.log('Initializing M1dn1ght...');
    checkEnrollmentStatus();
}

function checkEnrollmentStatus() {
    const statusBox = document.getElementById('enrollmentStatus');
    updateStatus('Checking enrollment status...', 'checking');
    
    // Simulate checking enrollment status
    setTimeout(function() {
        const isEnrolled = Math.random() > 0.5; // Simulated check
        if (isEnrolled) {
            updateStatus('Device is currently enrolled in enterprise management', 'enrolled');
        } else {
            updateStatus('Device is not enrolled in enterprise management', 'unenrolled');
        }
    }, 1500);
}

function initiateUnenrollment() {
    if (confirm('Are you sure you want to unenroll this Chromebook from enterprise management?')) {
        updateStatus('Unenrollment in progress...', 'processing');
        updateInfo('Initiating unenrollment process...');
        
        // Simulate unenrollment
        setTimeout(function() {
            updateStatus('Unenrollment completed successfully!', 'success');
            updateInfo('Your Chromebook has been unenrolled from enterprise management. Please restart your device to complete the process.');
        }, 2500);
    }
}

function initiateFactoryReset() {
    if (confirm('WARNING: Factory reset will erase all data on this Chromebook. Are you absolutely sure?')) {
        if (confirm('This action cannot be undone. Type "RESET" to confirm.')) {
            const userInput = prompt('Type RESET to confirm:');
            if (userInput === 'RESET') {
                updateStatus('Factory reset in progress...', 'processing');
                updateInfo('WARNING: Do not turn off your device. Factory reset is in progress...');
                
                // Simulate reset
                setTimeout(function() {
                    updateStatus('Factory reset completed!', 'success');
                    updateInfo('Your Chromebook will restart shortly. All data has been erased.');
                }, 3000);
            } else {
                updateInfo('Factory reset cancelled.');
            }
        }
    }
}

function updateStatus(message, status) {
    const statusBox = document.getElementById('enrollmentStatus');
    const statusClass = 'status-' + status;
    statusBox.innerHTML = `<p class="${statusClass}">${message}</p>`;
}

function updateInfo(message) {
    const infoBox = document.getElementById('infoBox');
    infoBox.innerHTML = `<p>${message}</p>`;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkEnrollmentStatus,
        initiateUnenrollment,
        initiateFactoryReset
    };
}
