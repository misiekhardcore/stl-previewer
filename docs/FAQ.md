# Frequently Asked Questions (FAQ)

Common questions and answers about STL Previewer.

## Table of Contents

- [General Questions](#general-questions)
- [Installation & Setup](#installation--setup)
- [Usage Questions](#usage-questions)
- [Git Diff Questions](#git-diff-questions)
- [Performance Questions](#performance-questions)
- [Compatibility Questions](#compatibility-questions)

## General Questions

### What is STL Previewer?

STL Previewer is a VS Code extension that lets you view and compare 3D STL (Stereolithography) files directly within the editor. It provides interactive 3D visualization and Git diff capabilities for STL files.

### What file formats are supported?

Currently, STL Previewer supports:

- **STL (Binary format)** - Most common, more compact
- **STL (ASCII format)** - Text-based, human-readable

Both formats are fully supported for viewing and Git diff operations.

### Is it free?

Yes! STL Previewer is completely free and open-source under the MIT license.

### Where can I get it?

- **VS Code Marketplace**: [Install from Marketplace](https://marketplace.visualstudio.com/items?itemName=misiekhardcore.stl-previewer)
- **GitHub**: [Source code](https://github.com/misiekhardcore/stl-previewer)

### Who maintains this extension?

The extension is maintained by [misiekhardcore](https://github.com/misiekhardcore) with contributions from the community.

## Installation & Setup

### How do I install it?

See the [Quick Start Guide](QUICK_START.md#installation) for detailed installation instructions.

### What are the requirements?

- **VS Code**: Version 1.52.0 or higher
- **Git Extension**: Required for diff functionality (usually pre-installed)
- **Operating System**: Windows, macOS, or Linux
- **Hardware**: Any system that runs VS Code (GPU acceleration recommended)

### Do I need any other software?

No! Everything needed is included in the extension. You don't need:

- ❌ Separate 3D viewer applications
- ❌ Additional plugins or libraries
- ❌ CAD software to view files

### Can I use it in VS Code Web/Browser?

The extension is designed for desktop VS Code. Browser support may be limited due to WebGL and file system requirements.

## Usage Questions

### How do I open an STL file?

Just click on any `.stl` file in VS Code. It will automatically open in the STL Previewer.

If it opens in a text editor instead:

1. Right-click the file
2. Choose "Open With..."
3. Select "STL Previewer"

### How do I rotate/zoom the view?

**Mouse controls:**

- **Rotate**: Left-click and drag
- **Pan**: Right-click and drag
- **Zoom**: Mouse wheel scroll

**Keyboard:**

- Use preset view buttons for standard angles

### Can I take screenshots?

Yes! Position your view as desired, then:

- **VS Code**: Use external screenshot tools
- **Windows**: Snipping Tool or Win+Shift+S
- **macOS**: Cmd+Shift+4
- **Linux**: Built-in screenshot tools

### How do I measure dimensions?

Enable the info panel to see bounding box dimensions:

```json
{
  "stlPreviewer.showInfo": true,
  "stlPreviewer.showBoundingBox": true
}
```

The info panel shows width, length, and height in the file's original units.

### Can I edit STL files?

No, STL Previewer is a viewer only. For editing, you'll need:

- CAD software (Fusion 360, SolidWorks, FreeCAD, etc.)
- Mesh editors (Blender, MeshLab, etc.)

### Can I export views as images?

Not directly. Use screenshot tools to capture the current view.

### Why don't I see any colors?

STL files don't contain color information - they only store geometry. The extension applies materials for visualization. You can customize colors in settings:

```json
{
  "stlPreviewer.meshMaterialConfig": {
    "color": "#ff6600"
  }
}
```

## Git Diff Questions

### How does Git diff work for STL files?

STL Previewer uses Constructive Solid Geometry (CSG) to calculate geometric differences:

1. Loads both versions (old and new)
2. Performs 3D boolean operations
3. Displays results with color coding:
   - 🟢 Green = Added geometry
   - 🔴 Red = Removed geometry
   - 🔵 Blue = Unchanged geometry

### What do the colors mean in diff view?

See the [Git Diff section in Usage Guide](USAGE.md#understanding-diff-colors) for detailed color explanations.

### Why is diff view slow?

CSG operations are computationally intensive, especially for complex models with many triangles. This is normal and expected.

**Tips for faster diff:**

- Simplify models in CAD software before committing
- Use lower polygon counts where possible
- Be patient - complex diffs can take 30+ seconds

### Can I compare any two STL files?

The Git diff feature only works with files tracked in Git. To compare arbitrary files:

1. Open both files side-by-side
2. Use the same viewing angle for both
3. Compare visually

### Why doesn't my diff show any changes?

Possible reasons:

- File might not have geometric changes (metadata only)
- Both versions might be identical
- File might not be tracked in Git
- Git extension might not be enabled

Check with:

```bash
git diff --stat yourfile.stl
```

## Performance Questions

### Why is my file loading slowly?

**Common causes:**

- **Large file size**: Files over 50MB take longer
- **Complex geometry**: High polygon count increases load time
- **Multiple features enabled**: Grid, axes, info panel add overhead

**Solutions:**

- Use "basic" material type
- Disable visual helpers (grid, axes, etc.)
- Close other heavy extensions

### How can I improve performance?

See the [Performance Optimization section in Usage Guide](USAGE.md#performance-optimization) for detailed performance tips and configuration examples.

### What's the maximum file size?

There's no hard limit, but:

- **< 10MB**: Fast loading, smooth interaction
- **10-50MB**: Slower loading, good interaction
- **50-100MB**: Slow loading, may lag
- **> 100MB**: Very slow, may fail on some systems

### Why is the viewer laggy?

**Possible causes:**

- Large file size
- Complex material (Standard/Phong)
- Too many visual helpers enabled
- Insufficient system resources
- Outdated graphics drivers

**Try:**

- Switch to "basic" material
- Disable all visual helpers
- Update graphics drivers
- Close other applications

## Compatibility Questions

### Which VS Code versions are supported?

STL Previewer requires **VS Code 1.52.0 or higher**.

Check your version:

```
Help > About
```

### Does it work on all operating systems?

Yes! Tested on:

- ✅ Windows 10/11
- ✅ macOS (Intel and Apple Silicon)
- ✅ Linux (Ubuntu, Fedora, etc.)

### Does it work with VS Code alternatives?

**Compatibility:**

- ✅ **Visual Studio Code** - Full support
- ⚠️ **VSCodium** - Should work (untested)
- ⚠️ **Code - OSS** - Should work (untested)
- ❌ **VS Code for Web** - Limited/No support

### Can I use it with Remote Development?

The extension should work with:

- ✅ **Remote - SSH**
- ✅ **Remote - Containers**
- ⚠️ **Remote - WSL** (may have performance issues)

Performance may vary depending on connection speed and remote system resources.

### Does it work with VS Code Insiders?

Yes! The extension works with VS Code Insiders.

### Are there any known conflicts?

No known conflicts with other extensions. If you encounter issues:

1. Disable other STL-related extensions
2. Report the conflict on [GitHub](https://github.com/misiekhardcore/stl-previewer/issues)

## Configuration Questions

### Where are settings stored?

Settings can be stored in:

1. **User Settings**: `settings.json` in your user config
2. **Workspace Settings**: `.vscode/settings.json` in your project

### How do I reset to defaults?

Remove all `stlPreviewer.*` entries from your settings.json, or use the reset button in the Settings UI.

### Can I have different settings per project?

Yes! Use Workspace Settings:

1. Open Settings (`Ctrl+,`)
2. Switch to "Workspace" tab
3. Configure STL Previewer settings
4. Settings save to `.vscode/settings.json`

### Do settings sync across devices?

Yes, if you have Settings Sync enabled in VS Code.

## Troubleshooting Questions

### Why won't my file open?

See the [Troubleshooting Guide](TROUBLESHOOTING.md#file-loading-issues) for comprehensive solutions.

### Where can I find error messages?

Open Developer Tools:

```
Help > Toggle Developer Tools
```

Check the **Console** tab for error messages.

### How do I report a bug?

1. Gather information:
   - VS Code version
   - Extension version
   - Error messages
   - Steps to reproduce
2. Search [existing issues](https://github.com/misiekhardcore/stl-previewer/issues)
3. Create a [new issue](https://github.com/misiekhardcore/stl-previewer/issues/new) if needed

### Where can I get help?

- **Documentation**: [docs/README.md](README.md)
- **GitHub Issues**: [Report bugs](https://github.com/misiekhardcore/stl-previewer/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/misiekhardcore/stl-previewer/discussions)

## Feature Requests

### Can you add support for [format]?

Feature requests are welcome! Open an issue on GitHub with:

- What format you'd like supported
- Why it would be useful
- Example files (if possible)

Popular format requests:

- OBJ - Under consideration
- STEP - Very complex, unlikely
- 3MF - Under consideration

### Can you add [feature]?

We welcome feature suggestions! Please:

1. Check if it's already requested
2. Open a [new issue](https://github.com/misiekhardcore/stl-previewer/issues/new)
3. Describe the use case
4. Explain the expected behavior

### How can I contribute?

See the [Contributing Guide](../CONTRIBUTING.md) for details on:

- Setting up development environment
- Coding guidelines
- Pull request process
- Testing requirements

## Questions About the Technology

### What rendering engine does it use?

STL Previewer uses **Three.js** (currently v0.178.0), a popular WebGL-based 3D library.

### How does CSG diff work?

The extension uses **three-bvh-csg** library to perform:

- Boolean subtraction (for added/removed parts)
- Boolean intersection (for common parts)

These operations run in a Web Worker to avoid blocking the UI.

### Is the viewer GPU-accelerated?

Yes! Three.js uses WebGL, which is GPU-accelerated. Performance depends on your graphics card.

### Can I use it offline?

Yes, once installed, the extension works completely offline. No internet connection needed for viewing files.

## Still Have Questions?

- 📖 Read the [full documentation](README.md)
- 🐛 [Open an issue](https://github.com/misiekhardcore/stl-previewer/issues) for bugs
- 💬 [Start a discussion](https://github.com/misiekhardcore/stl-previewer/discussions) for questions
- 🤝 [Contribute](../CONTRIBUTING.md) to the project
