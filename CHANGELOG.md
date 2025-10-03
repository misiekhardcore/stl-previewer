# Changelog

All notable changes to the "STL Previewer" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2024

### Features
- Interactive 3D STL file viewer with Three.js
- Git diff visualization for STL files with CSG operations
- Color-coded diff display (green for added, red for removed, blue for intersection)
- Multiple camera view presets (Isometric, Top, Left, Right, Bottom)
- Configurable display options:
  - Grid display with customizable color
  - Axes helper
  - Bounding box visualization
  - Debug information panel
- Multiple material types support (Basic, Standard, Lambert, Normal, Phong)
- Custom material configuration
- Interactive camera controls (rotate, pan, zoom)
- Responsive viewer that adapts to window size
- Support for both ASCII and Binary STL formats

### Technical Details
- Built with Three.js v0.178.0
- Uses three-bvh-csg for CSG operations
- React-based UI components
- VS Code Webview API integration
- Git extension integration for diff functionality

### Requirements
- VS Code 1.52.0 or higher
- Git extension for diff functionality

---

## Previous Versions

For information about earlier versions, please refer to the [commit history](https://github.com/misiekhardcore/stl-previewer/commits/main).
