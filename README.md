# Automata Visualizer - Regex to DFA Converter

A beautiful, interactive web application that visualizes the conversion of Regular Expressions to Deterministic Finite Automata (DFA).

## Features

- **Step-by-Step Visualization**: Watch the transformation from Regex → ε-NFA → NFA → DFA.
- **Interactive Graph**: Zoom, pan, and drag nodes to explore the automata.
- **Technical Aesthetic**: Designed with a "Technical Laboratory" theme using neon colors, crt effects, and monospace typography.
- **Testing Tools**: Test individual strings or run batch tests to verify your automata.
- **Export Options**: Export diagrams as SVG, PNG, or JSON.

## Usage

1. **Clone the repository**
2. **Open `index.html`** in your modern web browser.
   - No build step required for the core functionality (vanilla JS/ES6 modules).
   - Recommended: Use a local server (e.g., Live Server in VS Code) to avoid CORS issues with modules.

## Project Structure

- `src/app`: Application logic and state management.
- `src/automata`: Core algorithms for NFA/DFA construction.
- `src/parser`: Regex parsing and AST generation.
- `src/visualization`: D3.js based graph rendering.
- `src/ui`: UI components and interactions.

## Technologies

- **HTML5/CSS3**: Custom properties, CSS Grid/Flexbox.
- **JavaScript (ES6+)**: Modular architecture.
- **D3.js**: For graph visualization.

## License

ISC
