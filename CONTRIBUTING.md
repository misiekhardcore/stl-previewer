# Contributing to STL Previewer

Thank you for your interest in contributing to STL Previewer! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm (comes with Node.js)
- VS Code
- Git

### Setting Up Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stl-previewer.git
   cd stl-previewer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run compile
   ```

4. **Run in Development Mode**
   - Press `F5` in VS Code to open a new Extension Development Host window
   - The extension will be loaded and ready for testing
   - Use `npm run watch` in a terminal to automatically rebuild on changes

## 📝 Development Workflow

### Project Structure

```
stl-previewer/
├── src/                    # Extension source code
│   ├── extension.ts        # Extension entry point
│   ├── preview.ts          # Preview manager
│   ├── render-service.ts   # Three.js rendering logic
│   ├── csg-service.ts      # CSG operations for diff
│   ├── media/              # Webview UI components
│   │   ├── App.tsx         # Main React app
│   │   ├── controls.tsx    # View control buttons
│   │   ├── info-box.tsx    # Debug info display
│   │   └── index.css       # Webview styles
│   └── types/              # TypeScript type definitions
├── exampleFiles/           # Sample STL files for testing
├── demo/                   # Screenshots and demo files
├── icons/                  # Extension icons
└── dist/                   # Compiled output (generated)
```

### Available Scripts

- `npm run compile` - Type check, lint, and build
- `npm run watch` - Watch mode for development
- `npm run lint` - Run ESLint
- `npm run check-types` - Run TypeScript type checking
- `npm run package` - Build production package
- `npm test` - Run tests

### Code Style

- This project uses ESLint for code quality
- TypeScript strict mode is enabled
- Run `npm run lint` before committing
- Format your code consistently with the existing codebase

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - VS Code version
   - Extension version
   - Operating System
   - STL file details (if applicable)
6. **Screenshots**: If applicable
7. **Error Logs**: Check the Developer Tools console (Help > Toggle Developer Tools)

## 💡 Suggesting Features

Feature requests are welcome! Please include:

1. **Use Case**: Why is this feature needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions you've considered
4. **Additional Context**: Any other relevant information

## 🔧 Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clear, concise commit messages
   - Follow existing code style and patterns
   - Add/update tests if applicable
   - Update documentation if needed

3. **Test Your Changes**
   - Test in the Extension Development Host
   - Verify with different STL files
   - Check for console errors
   - Test relevant features

4. **Lint and Build**
   ```bash
   npm run lint
   npm run compile
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding/updating tests
   - `chore:` - Maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Go to GitHub and create a Pull Request
   - Provide a clear description of your changes
   - Link any related issues

## 🧪 Testing

### Manual Testing Checklist

When testing changes, verify:

- [ ] Extension loads without errors
- [ ] STL files open and render correctly
- [ ] Camera controls work (rotate, pan, zoom)
- [ ] View buttons change camera position correctly
- [ ] Settings are applied correctly
- [ ] Grid, axes, and bounding box toggle properly
- [ ] Info box displays correct values (if enabled)
- [ ] Git diff view shows changes correctly
- [ ] Different material types render appropriately
- [ ] No console errors in Developer Tools

### Test STL Files

Use files from `exampleFiles/` directory or create simple test STL files.

## 📚 Resources

### Three.js Documentation
- [Three.js Docs](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)

### VS Code Extension Development
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [Custom Editors](https://code.visualstudio.com/api/extension-guides/custom-editors)

### CSG Operations
- [three-bvh-csg](https://github.com/gkjohnson/three-bvh-csg)

## 🎯 Areas for Contribution

Looking for ways to contribute? Here are some ideas:

### Features
- Support for additional 3D file formats
- Measurement tools
- Export rendered views as images
- Animation/rotation controls
- Light source customization
- Texture support

### Improvements
- Performance optimization for large files
- Better error handling and user feedback
- Improved UI/UX
- Accessibility improvements
- Internationalization (i18n)

### Documentation
- Tutorial videos
- More examples
- API documentation
- Better inline code documentation

### Testing
- Unit tests
- Integration tests
- Test coverage improvements

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make STL Previewer better for everyone. We appreciate your time and effort!

## ❓ Questions?

If you have questions, feel free to:
- Open a discussion on GitHub
- Create an issue with the "question" label
- Check existing issues and discussions

---

Happy coding! 🚀
