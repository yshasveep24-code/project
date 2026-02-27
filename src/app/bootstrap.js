/**
 * bootstrap.js
 * Initializes the application modules.
 */

import { RegexInput } from '../ui/components/RegexInput.js';
import { StageSelector } from '../ui/components/StageSelector.js';
import { SimulationPanel } from '../ui/components/SimulationPanel.js';
import { StringTester } from '../ui/components/StringTester.js';
import { DiagramInteraction } from '../ui/components/DiagramInteraction.js';
import { ThemeController } from '../ui/components/ThemeController.js';
import { HelpModal } from '../ui/components/HelpModal.js';
import { HowItWorksModal } from '../ui/components/HowItWorksModal.js';
import { FeedbackModal } from '../ui/components/FeedbackModal.js';
import { ExamplesModal } from '../ui/components/ExamplesModal.js';
import { ClearButtons } from '../ui/components/ClearButtons.js';
import { ViewControls } from '../ui/components/ViewControls.js';
import { BatchTester } from '../ui/components/BatchTester.js';
import { InfoPanelController } from '../ui/components/InfoPanelController.js';
import { ToastController } from '../ui/components/ToastController.js';
import { ExportPanel } from '../export/exportController.js';
import { GraphRenderer } from '../visualization/renderer/graphRenderer.js';
import { appState } from './state.js';

export function bootstrap() {
    console.log('Bootstrap: Initializing application...');

    const themeController = new ThemeController();
    const regexInput = new RegexInput();
    const stageSelector = new StageSelector();
    const stringTester = new StringTester();
    const diagramInteraction = new DiagramInteraction();
    // const simulationPanel = new SimulationPanel(); // Disabled for clean UI redesign
    const exportPanel = new ExportPanel();

    // New advanced UI components
    const helpModal = new HelpModal();
    const howItWorksModal = new HowItWorksModal();
    const feedbackModal = new FeedbackModal();
    const examplesModal = new ExamplesModal();
    const clearButtons = new ClearButtons();
    const viewControls = new ViewControls();
    const batchTester = new BatchTester();
    const infoPanelController = new InfoPanelController();
    const toastController = new ToastController(); // Init last to catch everything


    // Subscribe renderer to state changes
    appState.subscribe((state) => {
        const stage = state.currentStage;
        const automata = state.automata;
        const container = document.getElementById('graph-container');

        // Only clear if we are in a "visualize" flow or if regex changed. Experimental.
        // Actually, if we want to show all 3, we should just render them if they exist.
        // But stageSelector might still be used for "Simulation Focus"?
        // The user said "give all result one after another".
        // Let's ignore currentStage for the main view and just render all available automata.

        if (!automata.enfa && !automata.nfa && !automata.dfa) {
            container.innerHTML = '<div style="padding:20px; text-align:center;"><p>Enter a regular expression and click Visualize to generate automata.</p></div>';
            return;
        }

        container.innerHTML = ''; // Clear previous

        const stages = [
            { id: 'enfa', label: 'ε-NFA (Thompson\'s Construction)', data: automata.enfa },
            { id: 'nfa', label: 'NFA (ε-Removal)', data: automata.nfa, hidden: !state.showNFA },
            { id: 'dfa', label: 'DFA (Subset Construction)', data: automata.dfa },
            { id: 'minDfa', label: 'Minimized DFA (Hopcroft\'s Alg.)', data: automata.minDfa }
        ];

        stages.forEach(s => {
            if (s.data && !s.hidden) {
                const wrapper = document.createElement('div');
                wrapper.className = 'graph-wrapper';

                const title = document.createElement('h3');
                // Protect epsilon from text-transform: uppercase AND usage of display font
                title.innerHTML = s.label.replace(/ε/g, '<span style="text-transform: none; display: inline-block; font-family: \'Times New Roman\', serif; font-style: italic; font-weight: normal;">ε</span>');
                wrapper.appendChild(title);

                // Add an alert for NFA and ε-NFA
                if (s.id === 'enfa' || s.id === 'nfa') {
                    const alertDiv = document.createElement('div');
                    alertDiv.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                    alertDiv.style.border = '1px dashed var(--warning, #ff9800)';
                    alertDiv.style.color = 'var(--warning, #ff9800)'; // Will fallback to #ff9800
                    alertDiv.style.padding = '8px 12px';
                    alertDiv.style.margin = '10px 0';
                    alertDiv.style.fontSize = '0.8rem';
                    alertDiv.style.fontFamily = "'Share Tech Mono', monospace";
                    alertDiv.style.textAlign = 'left';
                    alertDiv.innerHTML = '⚠️ <strong>NOTE:</strong> The ε-NFA and NFA cannot be minimized because NFA minimization is an NP-hard problem. Focus on minimizing the DFA instead.';
                    wrapper.appendChild(alertDiv);
                }

                const canvas = document.createElement('div');
                canvas.className = 'graph-canvas';
                canvas.id = `canvas-${s.id}`;
                wrapper.appendChild(canvas);

                container.appendChild(wrapper);

                const renderer = new GraphRenderer(canvas);
                renderer.render(s.data);
            }
        });

        // Update NFA Toggle Button State
        const toggleBtn = document.getElementById('toggle-nfa-btn');
        if (toggleBtn) {
            const checkMark = toggleBtn.querySelector('.check-mark');
            if (state.showNFA) {
                toggleBtn.style.borderColor = 'var(--primary)';
                toggleBtn.style.color = 'var(--primary)';
                if (checkMark) checkMark.style.opacity = '1';
            } else {
                toggleBtn.style.borderColor = '';
                toggleBtn.style.color = '';
                if (checkMark) checkMark.style.opacity = '0';
            }
        }
    });

    // Toggle NFA Button Handler
    const toggleNfaBtn = document.getElementById('toggle-nfa-btn');
    if (toggleNfaBtn) {
        toggleNfaBtn.addEventListener('click', () => {
            // Start invalidating the cache if we are toggling? No, just re-render.
            appState.setState({ showNFA: !appState.showNFA });
        });
    }

    console.log('Bootstrap: Application initialized.');
}
