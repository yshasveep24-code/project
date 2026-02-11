# ◉━━◉ AUTOMATA VISUALIZER

A distinctive web-based tool for visualizing the conversion of regular expressions to finite automata through multiple stages: ε-NFA → NFA → DFA. Built with a unique **Technical Laboratory** aesthetic inspired by oscilloscopes and vintage computing equipment.

![License](https://img.shields.io/badge/license-MIT-orange.svg)
![Version](https://img.shields.io/badge/version-1.0.0-teal.svg)

---

## 🎯 Features

### Core Functionality
- **Multi-stage Visualization**: Watch your regex transform through each conversion stage
  - Regular Expression parsing
  - ε-NFA construction (Thompson's Construction)
  - NFA generation (epsilon removal)
  - DFA conversion (subset construction)
  
- **Interactive Testing**
  - Single string validation
  - Batch testing with multiple strings
  - Real-time acceptance/rejection feedback
  - Visual state highlighting during execution

- **Professional Export Options**
  - SVG export for vector graphics
  - PNG export for raster images
  - JSON export for data interchange

### Advanced Features
- **Detailed Information Views**
  - Transition table display
  - State information panel
  - Complete conversion log
  - Real-time statistics

- **Graph Manipulation**
  - Zoom in/out controls
  - Pan and navigate large automata
  - Reset view functionality
  - Fullscreen mode

### User Experience
- **Example Patterns** library for learning
- **Responsive Design** for all screen sizes
- **Theme Toggle** (Dark/Light modes)
- **Help Documentation** built-in

---

## 🎨 Design Philosophy

This project deliberately avoids generic "AI-generated" aesthetics in favor of a **distinctive Technical Laboratory theme**:

### Visual Identity
- **Oscilloscope-inspired** UI with technical grid backgrounds
- **CRT monitor effects** including subtle scanlines
- **Neon glow accents** on interactive elements
- **Brutalist edges** with minimal rounding

### Typography
- **Syne**: Bold display font for headings
- **Azeret Mono**: Technical monospace for body text  
- **Share Tech Mono**: Terminal-style code display

### Color Palette
```css
Primary:   #FF9500 (Amber/Orange)
Secondary: #00E5CC (Teal/Cyan)
Background: #0A0E27 (Deep Navy)
Accents:   #FF00AA (Magenta highlights)
```

### Unique Elements
- ASCII markers (▸, ◆, ┌──┐) throughout interface
- Bracket notation `[BUTTONS]` for technical precision
- Uppercase text with wide letter-spacing
- Animated pulse effects on key elements

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (for development) or static hosting

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yshasveep24-code/project.git
   cd project
   ```

2. **Project Structure**
   ```
    ├── index.html                  # Main entry point (Webpage)
    ├── package.json                # Project metadata
    ├── README.md                   # Documentation
    ├── styles.css                  # Global Styles (Technical Lab Theme)
    └── src/                        # Source Code
        ├── main.js                 # Application Entry Point
        ├── app/                    # App State & Bootstrap
        │   ├── bootstrap.js
        │   └── state.js
        ├── automata/               # Core Algorithms
        │   ├── dfa/                # DFA Generation
        │   │   ├── dfaStateNaming.js
        │   │   └── subsetConstruction.js
        │   ├── epsilonNFA/         # Thompson's Construction
        │   │   ├── epsilonUtils.js
        │   │   ├── fragment.js
        │   │   └── thompson.js
        │   ├── model/              # Data Models
        │   │   ├── Automaton.js
        │   │   ├── State.js
        │   │   └── Transition.js
        │   ├── nfa/                # ε-Removal & NFA Logic
        │   │   ├── epsilonClosure.js
        │   │   ├── epsilonRemoval.js
        │   │   └── move.js
        │   └── utils/
        │       └── stateSet.js
        ├── export/                 # Export Logic
        │   ├── exportController.js
        │   ├── pngExporter.js
        │   └── svgExporter.js
        ├── parser/                 # Regex Parsing
        │   ├── postfixEvaluator.js
        │   ├── regexToPostfix.js
        │   ├── regexTokenizer.js
        │   └── regexValidator.js
        ├── simulation/             # String Testing Logic
        │   ├── dfaSimulator.js
        │   └── pathHighlighter.js
        ├── ui/                     # User Interface Logic
        │   └── components/
        │       ├── AnimationSpeedControl.js
        │       ├── BatchTester.js
        │       ├── ClearButtons.js
        │       ├── DiagramInteraction.js
        │       ├── ExamplesModal.js
        │       ├── FeedbackModal.js
        │       ├── HelpModal.js
        │       ├── HowItWorksModal.js
        │       ├── InfoPanelController.js
        │       ├── InfoPanelToggles.js
        │       ├── ModalController.js
        │       ├── RegexInput.js
        │       ├── SettingsModal.js
        │       ├── SimulationPanel.js
        │       ├── StageSelector.js
        │       ├── StringTester.js
        │       ├── ThemeController.js
        │       ├── ToastController.js
        │       ├── ViewControls.js
        │       └── ZoomController.js
        └── visualization/          # D3.js Visualization
            └── renderer/
                ├── edgeRenderer.js
                ├── graphRenderer.js
                ├── layoutManager.js
                └── nodeRenderer.js
   ```

3. **Serve the application**
   
   **Option A: Python HTTP Server**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B: Node.js HTTP Server**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

4. **Access the application**
   ```
   http://localhost:8000
   ```

---

## 📖 Usage Guide

### Basic Workflow

1. **Enter Regular Expression**
   - Type your regex in the input field (e.g., `(a|b)abb`)
   - Click `VISUALIZE` or press `Ctrl+Enter`

2. **View Visualizations**
   - Navigate through conversion stages
   - Examine the generated automata graphs
   - Check statistics and transition tables

3. **Test Strings**
   - Enter a test string
   - Click `RUN TEST` or press `Ctrl+T`
   - View acceptance/rejection results

4. **Batch Testing**
   - Enter multiple strings (one per line)
   - Run batch test to validate multiple inputs
   - Review comprehensive results

### Regular Expression Syntax

| Operator | Description | Example |
|----------|-------------|---------|
| `a` | Literal character | `a` matches "a" |
| `\|` | Alternation (OR) | `a\|b` matches "a" or "b" |
| `*` | Kleene star (0 or more) | `a*` matches "", "a", "aa", ... |
| `+` | Plus (1 or more) | `a+` matches "a", "aa", "aaa", ... |
| `?` | Optional (0 or 1) | `a?` matches "" or "a" |
| `()` | Grouping | `(ab)*` matches "", "ab", "abab", ... |
| `ε` | Epsilon (empty string) | `ε` matches empty string |

### Example Patterns

```regex
(a|b)abb        # Strings ending in "abb"
a+b+            # One or more a's followed by one or more b's
(ab|cd)(e|f)    # Two-part choice pattern
a(b|c)d(e|f)    # Branching paths
```

---


## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Advanced styling with CSS variables
- **Vanilla JavaScript** - No framework dependencies
- **SVG** - Scalable graph visualizations

### External Dependencies
- **FileSaver.js** - Client-side file export
- **Google Fonts** - Custom typography (Syne, Azeret Mono, Share Tech Mono)

### Browser APIs Used
- Canvas API (for PNG export)
- Blob API (for file downloads)
- CSS Grid & Flexbox (responsive layouts)
- CSS Custom Properties (theming)

---

## 🎭 Theme Customization

The application supports two built-in themes:

### Dark Theme (Default)
- Deep navy background (#0A0E27)
- Amber and teal accents
- High contrast for extended use

### Light Theme (CRT Amber)
- Warm cream background (#FDF6E3)
- Amber primary accent
- Vintage terminal aesthetic

Toggle between themes using the button in the header.

### Creating Custom Themes

Modify CSS variables in `styles.css`:

```css
:root {
    --primary: #FF9500;      /* Main accent color */
    --secondary: #00E5CC;    /* Secondary accent */
    --bg: #0A0E27;          /* Background */
    --text: #E8F4F8;        /* Text color */
    /* ... more variables ... */
}
```

---

## 📱 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Opera | 76+ | ✅ Fully supported |

**Note**: Internet Explorer is not supported.

---

## 🏗️ Project Architecture

### File Organization

```
├── index.html                  # Main entry point (Webpage)
├── package.json                # Project metadata
├── README.md                   # Documentation
├── styles.css                  # Global Styles (Technical Lab Theme)
└── src/                        # Source Code
    ├── main.js                 # Application Entry Point
    ├── app/                    # App State & Bootstrap
    │   ├── bootstrap.js
    │   └── state.js
    ├── automata/               # Core Algorithms
    │   ├── dfa/                # DFA Generation
    │   │   ├── dfaStateNaming.js
    │   │   └── subsetConstruction.js
    │   ├── epsilonNFA/         # Thompson's Construction
    │   │   ├── epsilonUtils.js
    │   │   ├── fragment.js
    │   │   └── thompson.js
    │   ├── model/              # Data Models
    │   │   ├── Automaton.js
    │   │   ├── State.js
    │   │   └── Transition.js
    │   ├── nfa/                # ε-Removal & NFA Logic
    │   │   ├── epsilonClosure.js
    │   │   ├── epsilonRemoval.js
    │   │   └── move.js
    │   └── utils/
    │       └── stateSet.js
    ├── export/                 # Export Logic
    │   ├── exportController.js
    │   ├── pngExporter.js
    │   └── svgExporter.js
    ├── parser/                 # Regex Parsing
    │   ├── postfixEvaluator.js
    │   ├── regexToPostfix.js
    │   ├── regexTokenizer.js
    │   └── regexValidator.js
    ├── simulation/             # String Testing Logic
    │   ├── dfaSimulator.js
    │   └── pathHighlighter.js
    ├── ui/                     # User Interface Logic
    │   └── components/
    │       ├── AnimationSpeedControl.js
    │       ├── BatchTester.js
    │       ├── ClearButtons.js
    │       ├── DiagramInteraction.js
    │       ├── ExamplesModal.js
    │       ├── FeedbackModal.js
    │       ├── HelpModal.js
    │       ├── HowItWorksModal.js
    │       ├── InfoPanelController.js
    │       ├── InfoPanelToggles.js
    │       ├── ModalController.js
    │       ├── RegexInput.js
    │       ├── SettingsModal.js
    │       ├── SimulationPanel.js
    │       ├── StageSelector.js
    │       ├── StringTester.js
    │       ├── ThemeController.js
    │       ├── ToastController.js
    │       ├── ViewControls.js
    │       └── ZoomController.js
    └── visualization/          # D3.js Visualization
        └── renderer/
            ├── edgeRenderer.js
            ├── graphRenderer.js
            ├── layoutManager.js
            └── nodeRenderer.js
```

### Key Components

1. **Regex Parser**: Converts regex string to AST
2. **Thompson's Construction**: Builds ε-NFA from AST
3. **Epsilon Removal**: Converts ε-NFA to NFA
4. **Subset Construction**: Converts NFA to DFA
5. **Graph Renderer**: Visualizes automata using SVG
6. **Test Engine**: Validates strings against automata

---

## 🧪 Development

### Adding New Features

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly** across browsers
5. **Commit with descriptive messages**
   ```bash
   git commit -m "Add: Description of your feature"
   ```
6. **Push and create a Pull Request**

### Code Style Guidelines

- **HTML**: Semantic elements, proper indentation (4 spaces)
- **CSS**: BEM-like naming, organized by component
- **JavaScript**: ES6+, clear variable names, JSDoc comments
- **Naming Convention**: Preserve existing class/ID names for compatibility

### Design Guidelines

When adding UI elements:
- Follow the technical laboratory aesthetic
- Use uppercase text with letter-spacing
- Apply appropriate glow effects to interactive elements
- Maintain the grid-based layout system
- Test in both dark and light themes

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Read the Code of Conduct** (to be added)
2. **Check existing issues** or create a new one
3. **Fork and create a feature branch**
4. **Follow the development guidelines above**
5. **Write clear commit messages**
6. **Test your changes thoroughly**
7. **Submit a Pull Request with detailed description**

### Areas for Contribution

- [ ] Additional regex operators support
- [ ] Regex to NFA optimization algorithms
- [ ] DFA minimization visualization
- [ ] Export to additional formats (PDF, LaTeX)
- [ ] Interactive tutorials/walkthroughs
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements
- [ ] Unit tests and test coverage
- [ ] Performance optimizations for large automata

---

## 🐛 Known Issues

- Large automata (>50 states) & more than 7 symbols in regex may require manual graph adjustment
- SVG export may not preserve all styling in some browsers
- Mobile touch gestures limited on graph canvas

See [Issues](https://github.com/yshasveep24-code/project/issues) for complete list.

---

## 📚 Resources & References

### Theory & Algorithms
- **Compilers: Principles, Techniques, and Tools** (Dragon Book)
- **Introduction to Automata Theory** by Hopcroft & Ullman
- [Thompson's Construction Algorithm](https://en.wikipedia.org/wiki/Thompson%27s_construction)
- [Powerset Construction](https://en.wikipedia.org/wiki/Powerset_construction)

### Design Inspiration
- Vintage oscilloscope interfaces
- CRT terminal aesthetics  
- Laboratory equipment displays
- Technical documentation typography

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Automata Visualizer Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

- **Design Inspiration**: Vintage laboratory equipment and oscilloscope interfaces
- **Typography**: Google Fonts (Syne, Azeret Mono, Share Tech Mono)
- **File Export**: FileSaver.js library
- **Icons**: Custom ASCII and Unicode symbols
- **Community**: Thanks to all contributors and users

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yshasveep24-code/project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yshasveep24-code/project/discussions)
- **Email**: your.email@example.com

---

## 🗺️ Roadmap

### v1.1.0 (Planned)
- [ ] DFA minimization algorithm
- [ ] Regular expression to minimal DFA direct conversion
- [ ] Graph layout algorithms (force-directed, hierarchical)

### v1.2.0 (Future)
- [ ] Context-free grammar support
- [ ] Pushdown automata visualization
- [ ] Turing machine simulator
- [ ] Export to LaTeX (TikZ)

### v2.0.0 (Vision)
- [ ] Collaborative editing
- [ ] Save/load projects
- [ ] Educational mode with step-by-step explanations
- [ ] Mobile app versions

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ⚡ for Computer Science Education**

[Report Bug](https://github.com/yshasveep24-code/project/issues) · 
[Request Feature](https://github.com/yshasveep24-code/project/issues) · 
[View Demo](https://yshasveep24-code.github.io/project)

</div>