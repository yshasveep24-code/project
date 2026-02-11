# Automata Visualizer ⚡

A sophisticated, interactive web application that visualizes the conversion of Regular Expressions to Deterministic Finite Automata (DFA). Designed with a distinctive **Technical Laboratory Aesthetic**.

![Status](https://img.shields.io/badge/Status-Stable-success) ![License](https://img.shields.io/badge/License-ISC-blue)

## 🎨 Technical Laboratory Aesthetic

The user interface has been crafted to resemble high-end laboratory equipment, featuring:
- **Oscilloscope-style Grids**: Deep navy background with subtle teal grid overlays.
- **CRT Effects**: Micro-scanlines and glowing text for a retro-futuristic feel.
- **Neon Color Palette**: 
  - Primary: **Amber (#FF9500)** for active elements.
  - Secondary: **Teal (#00E5CC)** for data flow and borders.
- **Precision Typography**: Uses *Syne*, *Azeret Mono*, and *Share Tech Mono* for a technical look.

## 🚀 Features

- **Pipeline Visualization**: Watch the transformation step-by-step:
  1.  **Regex Parsing**: Tokenization and Postfix conversion.
  2.  **ε-NFA Construction**: Thompson's Construction algorithm.
  3.  **NFA Simplification**: Epsilon removal.
  4.  **DFA Generation**: Subset construction (Power Set algorithm).
- **Interactive Graphing**: 
  - Pan, zoom, and drag nodes.
  - Auto-layout for clear readability.
  - **Dead State (Φ)** visualization for strict DFAs.
- **Testing Suite**:
  - **String Tester**: Instant accept/reject feedback for inputs.
  - **Batch Testing**: Run multiple test cases at once.
- **Export Capabilities**: Save your diagrams as SVG, PNG, or JSON.

## 🧪 Verification & Testing

Validated with complex regex patterns to ensure algorithmic correctness.

### Recommended Test Patterns

| Regex | Description | Behavior |
| :--- | :--- | :--- |
| `0*|(1+0)*` | **Dead State Check** | Verifies the trap state (Φ) with self-loops. |
| `ab` | **Concatenation** | Linear state progression. |
| `a|b` | **Union** | Branching paths. |
| `a*` | **Kleene Star** | Self-looping accepting state. |
| `(ab)+` | **Groups & Loops** | Handles repeating sequences. |

## 🛠️ Usage

This is a **client-side only** application (Vanilla JS + ES6 Modules).

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/automata-visualizer.git
    ```
2.  **Run the application**:
    - Simply open `index.html` in a modern browser (Chrome/Edge recommended).
    - *Note*: For best experience with ES6 modules, use a local server (e.g., Live Server extension in VS Code).

## 📂 Project Structure

- `src/app`: Core application bootstrap and state.
- `src/automata`: Algorithms (NFA, DFA, Epsilon Closure).
- `src/parser`: Tokenizer and AST generators.
- `src/visualization`: D3.js rendering logic.
- `src/ui`: Component-based UI logic.

## 📝 License

ISC License. Free for educational and personal use.
