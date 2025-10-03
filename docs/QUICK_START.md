# Quick Start Guide

Get up and running with STL Previewer in 5 minutes!

## Installation

**Option 1: VS Code Marketplace**
1. Open VS Code
2. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
3. Type: `ext install misiekhardcore.stl-previewer`
4. Press Enter

**Option 2: Extensions Panel**
1. Open Extensions (`Ctrl+Shift+X`)
2. Search for "STL Previewer"
3. Click Install

## First Steps

### 1. Open an STL File
- Click any `.stl` file in your workspace
- The file opens automatically in the 3D viewer

### 2. Navigate the View
- **Rotate**: Left click + drag
- **Pan**: Right click + drag  
- **Zoom**: Mouse wheel

### 3. Try Quick Views
- Look for buttons in top-right corner
- Click "Isometric", "Top", "Left", etc.
- These provide preset camera angles

## Common Tasks

### View a Model with Grid
```json
{
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#333"
}
```

### See Object Dimensions
```json
{
  "stlPreviewer.showInfo": true,
  "stlPreviewer.showBoundingBox": true
}
```

### Compare File Versions (Git)
1. Open Source Control (`Ctrl+Shift+G`)
2. Click on modified `.stl` file
3. See color-coded differences:
   - 🟢 Green = Added
   - 🔴 Red = Removed
   - 🔵 Blue = Unchanged

### Change Material Style
```json
{
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "shininess": 80,
    "color": "#808080"
  }
}
```

## Tips

- 💡 Enable view buttons for quick navigation
- 💡 Use Lambert material for general viewing
- 💡 Enable info box to see exact dimensions
- 💡 Disable grid for cleaner screenshots
- 💡 Use basic material for faster rendering

## Next Steps

- 📖 Read the [Usage Guide](USAGE.md) for detailed instructions
- ⚙️ Check [Configuration Guide](CONFIGURATION.md) for all settings
- 🔧 See [Troubleshooting](TROUBLESHOOTING.md) if you have issues

## Keyboard Reference

| Action | Shortcut |
|--------|----------|
| Close viewer | `Ctrl+W` / `Cmd+W` |
| Source Control | `Ctrl+Shift+G` |
| Command Palette | `Ctrl+Shift+P` |
| Settings | `Ctrl+,` |

## Common Settings

**Minimal (Performance)**
```json
{
  "stlPreviewer.showGrid": false,
  "stlPreviewer.showViewButtons": false,
  "stlPreviewer.meshMaterialType": "basic"
}
```

**Debug Mode**
```json
{
  "stlPreviewer.showInfo": true,
  "stlPreviewer.showAxes": true,
  "stlPreviewer.showBoundingBox": true
}
```

**Presentation**
```json
{
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#000",
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "color": "#4080ff",
    "shininess": 80
  }
}
```

## Need Help?

- 🐛 [Report an issue](https://github.com/misiekhardcore/stl-previewer/issues)
- 💬 [Ask a question](https://github.com/misiekhardcore/stl-previewer/discussions)
- 📚 [Full documentation](../README.md)

---

**Happy STL viewing! 🎉**
