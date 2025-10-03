# STL Previewer for VS Code

![STL Previewer Demo](https://raw.githubusercontent.com/misiekhardcore/stl-previewer/main/demo/stl-previewer.gif)

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

### From VS Code Marketplace
1. Open VS Code
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Type: `ext install misiekhardcore.stl-previewer`
4. Press Enter

### From Open VSX
1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Search for "STL Previewer"
4. Click Install

### Manual Installation
1. Download the `.vsix` file from [Releases](https://github.com/misiekhardcore/stl-previewer/releases)
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X`)
4. Click the `...` menu at the top
5. Select "Install from VSIX..."
6. Choose the downloaded file

## 🚀 Usage

### Basic Viewing
1. Open any `.stl` file in VS Code
2. The file will automatically open in the STL Previewer
3. Use your mouse to interact:
   - **Left Click + Drag**: Rotate the view
   - **Right Click + Drag**: Pan the view
   - **Scroll Wheel**: Zoom in/out

### Viewing Git Diffs
1. Open the Source Control view (`Ctrl+Shift+G`)
2. Find a modified `.stl` file
3. Click on the file to see the diff
4. The previewer will show:
   - Added geometry in **green**
   - Removed geometry in **red**
   - Intersecting/unchanged parts in **blue**

### Quick View Buttons
When enabled, use the view buttons in the top-right corner:
- **Isometric**: Standard 3D view
- **Top**: View from above
- **Left/Right**: Side views
- **Bottom**: View from below

### 📚 Detailed Documentation

For comprehensive guides and references, see the [Documentation](docs/README.md):
- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[Usage Guide](docs/USAGE.md)** - Complete feature walkthrough
- **[Configuration Guide](docs/CONFIGURATION.md)** - All settings explained
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Solve common issues

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "STL Previewer":

### Visual Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `stlPreviewer.showViewButtons` | boolean | `true` | Show camera position control buttons |
| `stlPreviewer.showInfo` | boolean | `false` | Show debug information box with camera and object data |
| `stlPreviewer.showAxes` | boolean | `false` | Display X, Y, Z axes helper |
| `stlPreviewer.showBoundingBox` | boolean | `false` | Display object bounding box |
| `stlPreviewer.showGrid` | boolean | `true` | Show floor grid |
| `stlPreviewer.viewOffset` | number | `40` | Distance offset when using view buttons |

### Grid Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `stlPreviewer.gridColor` | string | `"#111"` | Color of the floor grid (hex color) |

### Material Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `stlPreviewer.meshMaterialType` | enum | `"lambert"` | Material type: `basic`, `standard`, `lambert`, `normal`, or `phong` |
| `stlPreviewer.meshMaterialConfig` | object | `null` | Advanced material configuration (Three.js material properties) |

### Example Configuration

```json
{
  "stlPreviewer.showViewButtons": true,
  "stlPreviewer.showInfo": true,
  "stlPreviewer.showAxes": true,
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#333333",
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "shininess": 30,
    "specular": "#ffffff"
  }
}
```

## 🎯 Material Types Explained

- **Basic**: Simple flat shading, no lighting effects
- **Lambert**: Matte surface with diffuse reflection (default)
- **Phong**: Shiny surface with specular highlights
- **Standard**: PBR (Physically Based Rendering) material
- **Normal**: Debug view showing surface normals as colors

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

- Very large STL files (>50MB) may take longer to load
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
- **Open VSX**: https://open-vsx.org/extension/misiekhardcore/stl-previewer
- **GitHub Repository**: https://github.com/misiekhardcore/stl-previewer
- **Report Issues**: https://github.com/misiekhardcore/stl-previewer/issues

## 🙏 Acknowledgments

- Original extension concept by [Fumiaki MATSUSHIMA](https://github.com/misiekhardcore)
- Built with [Three.js](https://threejs.org/)
- CSG operations powered by [three-bvh-csg](https://github.com/gkjohnson/three-bvh-csg)

---

**Enjoy previewing your STL files! ⭐ Star this repo if you find it useful!**
