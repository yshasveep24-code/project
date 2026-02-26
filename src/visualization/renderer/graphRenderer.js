/**
 * graphRenderer.js
 * Main entry point for rendering the automaton.
 */

import { LayoutManager } from './layoutManager.js';
import { NodeRenderer } from './nodeRenderer.js';
import { EdgeRenderer } from './edgeRenderer.js';
import { defaultTheme } from '../themes/defaultTheme.js';

export class GraphRenderer {
    constructor(containerOrId) {
        if (typeof containerOrId === 'string') {
            this.container = document.getElementById(containerOrId);
        } else {
            this.container = containerOrId;
        }
        this.theme = defaultTheme;
        this.layoutManager = new LayoutManager(800, 600); // Default size

        this.initSVG();
        this.nodeRenderer = new NodeRenderer(this.nodesGroup);
        this.edgeRenderer = new EdgeRenderer(this.edgesGroup);
    }

    initSVG() {
        this.container.innerHTML = '';
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", "100%");
        this.svg.setAttribute("height", "100%");
        this.svg.style.backgroundColor = "#fff"; // For export

        // Defs for markers
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "28"); // Offset to not overlap node (20 radius + 8)
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0 0 L 10 3.5 L 0 7 z"); // Filled triangle
        path.setAttribute("fill", this.theme.edgeColor);
        path.setAttribute("stroke", "none");

        marker.appendChild(path); // CRITICAL: Add path to marker
        defs.appendChild(marker);
        this.svg.appendChild(defs);

        // Layers
        this.edgesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

        this.svg.appendChild(this.edgesGroup);
        this.svg.appendChild(this.nodesGroup);

        this.container.appendChild(this.svg);

        // Update dimensions
        const rect = this.container.getBoundingClientRect();
        this.layoutManager.width = rect.width || 800;
        this.layoutManager.height = rect.height || 600;
    }

    render(automaton) {
        // Clear inputs
        this.nodesGroup.innerHTML = '';
        this.edgesGroup.innerHTML = '';

        // Calculate layout
        const layoutResult = this.layoutManager.calculateLayout(automaton);
        const positions = layoutResult.positions;

        // Resize container and SVG
        this.layoutManager.width = layoutResult.width;
        this.layoutManager.height = layoutResult.height;

        this.container.style.height = `${layoutResult.height}px`;
        this.svg.setAttribute("width", "100%"); // or layoutResult.width
        this.svg.setAttribute("height", `${layoutResult.height}px`);
        this.svg.setAttribute("viewBox", `0 0 ${layoutResult.width} ${layoutResult.height}`);

        // Calculate bounds for smart self-loop positioning
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        positions.forEach(pos => {
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
            minY = Math.min(minY, pos.y);
            maxY = Math.max(maxY, pos.y);
        });

        // Render Edges
        // Group edges by from-to pair to handle multiples
        const edgeMap = new Map();
        const bidirectionalPairs = new Set();

        // Calculate occupied directions for self loops to avoid overlaps
        const occupiedDirections = new Map();
        for (const state of automaton.states) {
            occupiedDirections.set(state.id, new Set());
        }

        if (automaton.startState && occupiedDirections.has(automaton.startState.id)) {
            occupiedDirections.get(automaton.startState.id).add('left'); // Start arrow comes from left
        }

        for (const state of automaton.states) {
            const fromPos = positions.get(state.id);
            if (!fromPos) continue;

            for (const t of state.transitions) {
                if (t.to.id !== state.id) { // Not a self loop
                    const toPos = positions.get(t.to.id);
                    if (toPos) {
                        const dx = toPos.x - fromPos.x;
                        const dy = toPos.y - fromPos.y;

                        if (Math.abs(dx) > Math.abs(dy)) {
                            if (dx > 0) {
                                occupiedDirections.get(state.id).add('right');
                                occupiedDirections.get(t.to.id).add('left');
                            } else {
                                occupiedDirections.get(state.id).add('left');
                                occupiedDirections.get(t.to.id).add('right');
                            }
                        } else {
                            if (dy > 0) {
                                occupiedDirections.get(state.id).add('bottom');
                                occupiedDirections.get(t.to.id).add('top');
                            } else {
                                occupiedDirections.get(state.id).add('top');
                                occupiedDirections.get(t.to.id).add('bottom');
                            }
                        }
                    }
                }

                const key = `${t.from.id}-${t.to.id}`;
                const reverseKey = `${t.to.id}-${t.from.id}`;

                if (!edgeMap.has(key)) edgeMap.set(key, []);
                edgeMap.get(key).push(t);

                // Check if reverse edge exists (bidirectional)
                if (edgeMap.has(reverseKey)) {
                    bidirectionalPairs.add(key);
                    bidirectionalPairs.add(reverseKey);
                }
            }
        }

        edgeMap.forEach((transitions, key) => {
            const isBidirectional = bidirectionalPairs.has(key);

            const fromPos = positions.get(transitions[0].from.id);
            const toPos = positions.get(transitions[0].to.id);

            if (fromPos && toPos) {
                // Combine all symbols with comma, removing duplicates
                const uniqueSymbols = [...new Set(transitions.map(t => t.symbol))];
                const combinedSymbol = uniqueSymbols.join(',');

                // Create a single transition with combined label
                const combinedTransition = {
                    from: transitions[0].from,
                    to: transitions[0].to,
                    symbol: combinedSymbol
                };

                // Determine self-loop direction based on occupied sides (restrict to top/bottom)
                let selfLoopDir = 'top'; // default preference
                if (transitions[0].from.id === transitions[0].to.id) {
                    const stateId = transitions[0].from.id;
                    const occupied = occupiedDirections.get(stateId);

                    const canTop = !occupied.has('top');
                    const canBottom = !occupied.has('bottom');

                    if (canTop && canBottom) {
                        selfLoopDir = Math.random() < 0.5 ? 'top' : 'bottom';
                    } else if (canTop) {
                        selfLoopDir = 'top';
                    } else if (canBottom) {
                        selfLoopDir = 'bottom';
                    } else {
                        // Even if both are occupied, force to be either top or bottom
                        selfLoopDir = Math.random() < 0.5 ? 'top' : 'bottom';
                    }
                }

                this.edgeRenderer.render(combinedTransition, fromPos, toPos, this.theme, isBidirectional, 0, selfLoopDir);
            }
        });

        // Render Start Arrow (pointing to start state)
        const startState = automaton.startState;
        const startPos = positions.get(startState.id);
        if (startPos) {
            const arrowLength = 30;
            const nodeRadius = 22;
            const startX = startPos.x - nodeRadius - arrowLength;
            const startY = startPos.y;
            const endX = startPos.x - nodeRadius;
            const endY = startPos.y;

            // Draw start arrow as path with integrated arrowhead
            const size = 8;
            const tipX = endX;
            const tipY = endY;
            const lineEndX = endX - size;
            const baseY1 = endY - size / 2.5;
            const baseY2 = endY + size / 2.5;

            const startArrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = `M ${startX} ${startY} L ${lineEndX} ${endY} L ${lineEndX} ${baseY1} L ${tipX} ${tipY} L ${lineEndX} ${baseY2} L ${lineEndX} ${endY}`;
            startArrowPath.setAttribute("d", d);
            startArrowPath.style.stroke = this.theme.edgeColor;
            startArrowPath.style.strokeWidth = "2px";
            startArrowPath.style.fill = this.theme.edgeColor;
            startArrowPath.style.strokeLinejoin = "round";
            this.edgesGroup.appendChild(startArrowPath);

            // "start" label - positioned above the arrow
            const startLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
            startLabel.setAttribute("x", (startX + endX) / 2);
            startLabel.setAttribute("y", startY - 8);
            startLabel.setAttribute("text-anchor", "middle");
            startLabel.textContent = "start";
            startLabel.style.fontSize = "11px";
            startLabel.style.fontFamily = "Inter, sans-serif";
            startLabel.style.fill = this.theme.edgeColor;
            this.edgesGroup.appendChild(startLabel);
        }

        // Render Nodes
        automaton.states.forEach(state => {
            const pos = positions.get(state.id);
            if (pos) {
                this.nodeRenderer.render(state, pos.x, pos.y, this.theme);
            }
        });
    }
}
