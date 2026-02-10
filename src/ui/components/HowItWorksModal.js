import { ModalController } from './ModalController.js';

export class HowItWorksModal extends ModalController {
    constructor() {
        super('how-it-works-modal');
        this.setupTriggers();
    }

    setupTriggers() {
        // How It Works button in header
        const howItWorksBtn = document.getElementById('how-it-works-btn');
        if (howItWorksBtn) {
            howItWorksBtn.addEventListener('click', () => {
                this.open();
            });
        } else {
            console.warn('HowItWorksModal: how-it-works-btn element not found in DOM');
        }
    }
}
