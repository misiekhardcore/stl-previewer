# STL Previewer for VS Code

![STL Previewer Demo](https://raw.githubusercontent.com/misiekhardcore/stl-previewer/main/demo/stl-previewer.gif)
![STL Previewer Diff Demo](https://raw.githubusercontent.com/misiekhardcore/stl-previewer/main/demo/stl-previewer-diff.gif)

A powerful VS Code extension for viewing and comparing STL (Stereolithography) files with interactive 3D rendering capabilities powered by Three.js.

## ✨ Features

### 🎨 Interactive 3D Viewer

- **View STL files directly** in VS Code without external applications
- **Interactive 3D rendering** with smooth rotation, zoom, and pan controls
- **Multiple camera views**: Isometric, Top, Left, Right, Bottom views with quick view buttons
- **High-quality rendering** powered by Three.js

### 🔍 Visual Comparison (Diff View)

- **Compare STL files** from Git history
- **Color-coded diff visualization**:
  - 🟢 **Green**: Added geometry
  - 🔴 **Red**: Removed geometry
  - 🔵 **Blue**: Intersecting/unchanged geometry
- **Automatic CSG operations** (Constructive Solid Geometry) for precise differences
- **Semi-transparent rendering** for better visibility of changes

### 📊 Debug Information

- **Real-time camera information**: Position and rotation values
- **Bounding box dimensions**: Width, length, height
- **Min/Max coordinates** for precise measurements
- **Live updates** as you interact with the model

### ⚙️ Customizable Display Options

- **Grid**: Toggle floor grid with customizable color
- **Axes Helper**: Show X, Y, Z axes for orientation
- **Bounding Box**: Display object boundaries
- **View Controls**: Enable/disable quick view buttons
- **Material Types**: Choose from Basic, Standard, Lambert, Normal, or Phong materials
- **Custom material configuration** for advanced users

## 📦 Installation

**Quick Install:**

1. Press `Ctrl+P` in VS Code
2. Type: `ext install misiekhardcore.stl-previewer`
3. Press Enter

For alternative installation methods, see the [Quick Start Guide](docs/QUICK_START.md#installation).

## 🚀 Usage

For detailed usage instructions, see the [Usage Guide](docs/USAGE.md).

**Quick Start:**

1. Open any `.stl` file in VS Code
2. Use mouse controls to navigate (left-click drag to rotate, right-click drag to pan, scroll to zoom)
3. Use view buttons for preset camera positions
4. View Git diffs through Source Control panel

### 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[Usage Guide](docs/USAGE.md)** - Complete feature walkthrough
- **[Configuration Guide](docs/CONFIGURATION.md)** - All settings explained
- **[Features Overview](docs/FEATURES.md)** - Detailed feature descriptions
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Solve common issues
- **[FAQ](docs/FAQ.md)** - Frequently Asked Questions

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "STL Previewer".

For comprehensive configuration options and examples, see the [Configuration Guide](docs/CONFIGURATION.md).

## 🛠️ Technical Details

### Supported File Formats

- STL (ASCII and Binary formats)

### Dependencies

- **Three.js** (v0.178.0): 3D rendering engine
- **three-bvh-csg** (v0.0.17): Constructive Solid Geometry operations for diff view

### Requirements

- VS Code version 1.52.0 or higher
- Git extension (for diff functionality)

## 📋 Known Limitations

- Large STL files may take longer to load
- Diff view requires Git version control
- CSG operations for complex models may be computationally intensive

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Reporting Issues

If you encounter any issues or have suggestions:

1. Check [existing issues](https://github.com/misiekhardcore/stl-previewer/issues)
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - VS Code version and OS information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **VS Code Marketplace**: https://marketplace.visualstudio.com/items?itemName=misiekhardcore.stl-previewer
- **GitHub Repository**: https://github.com/misiekhardcore/stl-previewer
- **Report Issues**: https://github.com/misiekhardcore/stl-previewer/issues

## 📚 External Resources

### Three.js

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)

### VS Code

- [VS Code Extension API](https://code.visualstudio.com/api)
- [VS Code Webview Guide](https://code.visualstudio.com/api/extension-guides/webview)

### STL Format

- [STL Format Specification](<https://en.wikipedia.org/wiki/STL_(file_format)>)

## 🙏 Acknowledgments

- Original extension concept by [Fumiaki MATSUSHIMA](https://github.com/mtsmfm/vscode-stl-viewer)
- Built with [Three.js](https://threejs.org/)
- CSG operations powered by [three-bvh-csg](https://github.com/gkjohnson/three-bvh-csg)

---

**Enjoy previewing your STL files! ⭐ Star this repo if you find it useful!**
