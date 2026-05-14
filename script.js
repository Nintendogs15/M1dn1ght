// Section Navigation
function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Mark nav button as active
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// List Extensions
function listExtensions() {
    const extensionsList = document.getElementById('extensionsList');
    const extensionsContent = document.getElementById('extensionsContent');
    
    // Check if running on ChromeOS
    if (!('chrome' in window) || !('management' in chrome)) {
        extensionsContent.innerHTML = '<div class="extension-item"><strong>⚠️ Note:</strong> This feature requires running on ChromeOS with the extension API enabled, or the app needs elevated permissions. You can still use extension IDs from chrome://extensions/ to uninstall them.</div>';
        extensionsList.classList.remove('hidden');
        return;
    }

    try {
        // This requires proper permissions in manifest.json
        chrome.management.getAll((extensions) => {
            if (!extensions || extensions.length === 0) {
                extensionsContent.innerHTML = '<div class="extension-item">⚠️ No extensions found or unable to access extension directory.</div>';
            } else {
                let html = '';
                extensions.forEach((ext, index) => {
                    html += `<div class="extension-item">
                        <strong>${index + 1}. ${ext.name}</strong><br>
                        ID: ${ext.id}<br>
                        Type: ${ext.type}<br>
                        Enabled: ${ext.enabled ? '✅' : '❌'}
                    </div>`;
                });
                extensionsContent.innerHTML = html;
            }
            extensionsList.classList.remove('hidden');
        });
    } catch (error) {
        // Fallback for web-only environment
        extensionsContent.innerHTML = `<div class="extension-item">
            <strong>💡 Web Version Note:</strong><br>
            To list extensions on ChromeOS:<br>
            1. Open your Chromebook's Chrome browser<br>
            2. Go to <code>chrome://extensions/</code><br>
            3. Enable "Developer mode" (top right)<br>
            4. Copy extension IDs from the list<br>
            5. Use them in the uninstall sections below
        </div>`;
        extensionsList.classList.remove('hidden');
    }
}

// Uninstall Single Extension
function uninstallSingle() {
    const extensionId = document.getElementById('singleExtId').value.trim();
    
    if (!extensionId) {
        showToast('❌ Please enter an extension ID', 'error');
        return;
    }

    const confirmed = confirm(`⚠️  Are you sure you want to uninstall extension: ${extensionId}?`);
    
    if (!confirmed) {
        showToast('❌ Uninstall cancelled', 'warning');
        return;
    }

    // Attempt to uninstall via Chrome API
    if ('chrome' in window && 'management' in chrome) {
        try {
            chrome.management.uninstall(extensionId, () => {
                if (chrome.runtime.lastError) {
                    showToast(`❌ Failed to uninstall: ${chrome.runtime.lastError.message}`, 'error');
                } else {
                    showToast(`✅ Successfully uninstalled extension: ${extensionId}`, 'success');
                    document.getElementById('singleExtId').value = '';
                }
            });
        } catch (error) {
            showToast(`❌ Error: ${error.message}. Try running on ChromeOS with proper permissions.`, 'error');
        }
    } else {
        showToast('ℹ️  Web version: Copy this command to use on your ChromeOS device via Terminal:\n\nrm -rf /home/chronos/user/Default/Extensions/' + extensionId, 'warning');
        
        // Show a helpful dialog
        alert(`To uninstall on your Chromebook:\n\n1. Open Terminal (Ctrl+Alt+T)\n2. Run: rm -rf /home/chronos/user/Default/Extensions/${extensionId}\n3. Restart Chrome\n\nNote: You may need elevated privileges.`);
    }
}

// Uninstall Multiple Extensions
function uninstallMultiple() {
    const input = document.getElementById('multipleExtIds').value.trim();
    
    if (!input) {
        showToast('❌ Please enter extension IDs', 'error');
        return;
    }

    const extensionIds = input.split(',').map(id => id.trim()).filter(id => id);
    
    if (extensionIds.length === 0) {
        showToast('❌ No valid extension IDs provided', 'error');
        return;
    }

    const confirmed = confirm(`⚠️  You are about to uninstall ${extensionIds.length} extensions. Continue?`);
    
    if (!confirmed) {
        showToast('❌ Uninstall cancelled', 'warning');
        return;
    }

    let successCount = 0;
    let failureCount = 0;

    if ('chrome' in window && 'management' in chrome) {
        extensionIds.forEach((extensionId, index) => {
            setTimeout(() => {
                try {
                    chrome.management.uninstall(extensionId, () => {
                        if (chrome.runtime.lastError) {
                            failureCount++;
                        } else {
                            successCount++;
                        }

                        if (index === extensionIds.length - 1) {
                            showToast(`✅ Uninstalled: ${successCount} | ❌ Failed: ${failureCount}`, 'success');
                            if (failureCount === 0) {
                                document.getElementById('multipleExtIds').value = '';
                            }
                        }
                    });
                } catch (error) {
                    failureCount++;
                }
            }, index * 500);
        });
    } else {
        let commands = 'To uninstall these extensions, run these commands on your ChromeOS device:\n\n';
        extensionIds.forEach(id => {
            commands += `rm -rf /home/chronos/user/Default/Extensions/${id}\n`;
        });
        
        showToast('ℹ️  Web version: See below for commands to run on ChromeOS', 'warning');
        alert(commands + '\nThen restart Chrome or reboot.');
    }
}

// Force Unenroll
function forceUnenroll() {
    const confirmationInput = document.getElementById('unenrollConfirm').value;
    
    if (confirmationInput !== 'FORCE UNENROLL') {
        showToast('❌ Incorrect confirmation text. Type "FORCE UNENROLL" exactly.', 'error');
        return;
    }

    const finalConfirm = confirm(
        '⚠️  CRITICAL WARNING ⚠️\n\n' +
        'This will:\n' +
        '• Remove enterprise management\n' +
        '• Delete all enrolled certificates\n' +
        '• Remove all enterprise policies\n' +
        '• Reboot your device\n\n' +
        'This CANNOT be undone without re-enrollment.\n\n' +
        'Continue?'
    );

    if (!finalConfirm) {
        showToast('❌ Unenrollment cancelled', 'warning');
        return;
    }

    showUnenrollmentSteps();
}

// Show Unenrollment Steps
function showUnenrollmentSteps() {
    const steps = [
        { num: 1, text: 'Stopping device management services...', cmd: 'sudo systemctl stop devicemanagerd' },
        { num: 2, text: 'Removing enterprise policies...', cmd: 'sudo rm -rf /etc/opt/google/chrome/policies/ /var/lib/whitelist/' },
        { num: 3, text: 'Deleting enrollment certificates...', cmd: 'sudo rm -rf /var/lib/devicesettings/' },
        { num: 4, text: 'Clearing device state...', cmd: 'sudo rm -rf /var/lib/dbus/ /home/chronos/user/GCache/' },
        { num: 5, text: 'Resetting Chrome state...', cmd: 'sudo rm -rf /home/chronos/user/.cache/ /home/chronos/user/Default/Local\\ Storage/' },
        { num: 6, text: 'Removing TPM data...', cmd: 'sudo rm -rf /var/lib/tpm/' },
    ];

    let stepsText = '🔄 UNENROLLMENT PROCESS\n\nRun these commands in Terminal (Ctrl+Alt+T) on your Chromebook:\n\n';
    
    steps.forEach(step => {
        stepsText += `[Step ${step.num}/6] ${step.text}\n${step.cmd}\n\n`;
    });

    stepsText += 'After running all commands:\n' +
        '1. Reboot: sudo reboot\n' +
        '2. Or just: sudo reboot now\n\n' +
        '✅ After reboot, your device will be unenrolled from enterprise management.';

    alert(stepsText);
    
    showToast('📋 Unenrollment commands displayed. Copy and run them in ChromeOS Terminal.', 'warning');

    // Clear confirmation input
    document.getElementById('unenrollConfirm').value = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set extensions as default section
    switchSection('extensions');
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === '1') {
                e.preventDefault();
                switchSection('extensions');
            } else if (e.key === '2') {
                e.preventDefault();
                switchSection('unenroll');
            } else if (e.key === '3') {
                e.preventDefault();
                switchSection('help');
            }
        }
    });
});

// Export functionality (optional - for documentation)
function exportGuide() {
    const guide = `
M1dn1ght Web App - Quick Start Guide

EXTENSION MANAGEMENT:
1. Click "Extension Management" in the sidebar
2. Use "List All Extensions" to see what's installed
3. Get extension IDs from chrome://extensions/
4. Enter ID to uninstall single or multiple extensions

FORCE UNENROLL:
1. Click "Force Unenroll" in the sidebar
2. Read all warnings carefully
3. Type "FORCE UNENROLL" to confirm
4. Copy the provided commands
5. Run in ChromeOS Terminal (Ctrl+Alt+T)
6. Reboot when complete

Note: This is a web version. Some features require running on ChromeOS.
    `;
    
    const blob = new Blob([guide], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'M1dn1ght-Guide.txt';
    a.click();
    URL.revokeObjectURL(url);
}
