import { ModalController } from './ModalController.js';

export class FeedbackModal extends ModalController {
    constructor() {
        super('feedback-modal');
        this.setupTriggers();
        this.setupForm();
    }

    setupTriggers() {
        // Report Issue button in footer
        const reportBtn = document.getElementById('report-issue-btn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                this.open();
            });
        } else {
            console.warn('FeedbackModal: report-issue-btn element not found in DOM');
        }
    }

    setupForm() {
        const form = document.getElementById('feedback-form');
        const submitBtn = document.getElementById('feedback-submit-btn');
        const statusDiv = document.getElementById('feedback-status');

        if (!form) {
            console.warn('FeedbackModal: feedback-form not found');
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS is not loaded!');
                this.showStatus('✗ Email service not available. Please refresh the page.', 'error');
                return;
            }

            const formData = new FormData(form);
            const name = formData.get('from_name') || 'Anonymous';
            const email = formData.get('user_email') || 'No email provided';
            const message = formData.get('message');

            if (!message || message.trim() === '') {
                this.showStatus('Please enter a message', 'error');
                return;
            }

            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-marker">⏳</span> SENDING...';

            try {
                // Prepare template parameters
                const templateParams = {
                    from_name: name,
                    user_email: email,
                    message: message,
                    page_url: window.location.href,
                    timestamp: new Date().toLocaleString()
                };

                console.log('Sending email with params:', templateParams);

                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_2er54vj',      // Service ID
                    'template_40esecv',     // Template ID (CORRECTED)
                    templateParams
                );

                console.log('Email sent successfully:', response);
                this.showStatus('✓ Feedback sent successfully! Thank you!', 'success');

                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    this.close();
                    statusDiv.style.display = 'none';
                }, 2000);

            } catch (error) {
                console.error('Email send failed:', error);
                console.error('Error details:', {
                    message: error.message,
                    text: error.text,
                    status: error.status
                });

                let errorMessage = '✗ Failed to send feedback. ';
                if (error.text) {
                    errorMessage += error.text;
                } else {
                    errorMessage += 'Please check your internet connection and try again.';
                }

                this.showStatus(errorMessage, 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-marker">▶</span> SEND FEEDBACK';
            }
        });
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('feedback-status');
        if (!statusDiv) return;

        statusDiv.style.display = 'block';
        statusDiv.textContent = message;

        if (type === 'success') {
            statusDiv.style.color = 'var(--success)';
            statusDiv.style.backgroundColor = 'rgba(0, 255, 136, 0.15)';
            statusDiv.style.border = '2px solid var(--success)';
        } else if (type === 'error') {
            statusDiv.style.color = 'var(--error)';
            statusDiv.style.backgroundColor = 'rgba(255, 51, 102, 0.15)';
            statusDiv.style.border = '2px solid var(--error)';
        }

        statusDiv.style.padding = '0.75rem';
        statusDiv.style.borderRadius = '4px';
        statusDiv.style.fontFamily = 'var(--font-mono)';
        statusDiv.style.fontSize = '0.875rem';
        statusDiv.style.fontWeight = '700';
        statusDiv.style.textAlign = 'center';
    }
}
