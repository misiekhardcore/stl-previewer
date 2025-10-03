# Usage Guide

This guide provides detailed instructions on how to use STL Previewer effectively.

## Table of Contents

- [Opening STL Files](#opening-stl-files)
- [Navigation Controls](#navigation-controls)
- [Camera Views](#camera-views)
- [Display Options](#display-options)
- [Viewing Git Diffs](#viewing-git-diffs)
- [Material Configuration](#material-configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tips and Tricks](#tips-and-tricks)

## Opening STL Files

### Method 1: Direct Open
1. Navigate to any `.stl` file in VS Code
2. Click on the file to open it
3. The file will automatically open in the STL Previewer

### Method 2: Open With
1. Right-click on an `.stl` file
2. Select "Open With..."
3. Choose "STL Previewer"

### Method 3: Default Editor
STL Previewer is set as the default editor for `.stl` files, so simply clicking any STL file will open it in the previewer.

## Navigation Controls

### Mouse Controls

| Action | Control |
|--------|---------|
| **Rotate View** | Left Click + Drag |
| **Pan View** | Right Click + Drag |
| **Zoom In/Out** | Mouse Wheel Up/Down |

### Touch Controls (Touchscreen)
- **Rotate**: Single finger drag
- **Pan**: Two finger drag
- **Zoom**: Pinch gesture

## Camera Views

When view buttons are enabled (`stlPreviewer.showViewButtons: true`), you can quickly switch between predefined camera positions:

### Available Views

1. **Isometric** - Default 3D perspective view
2. **Top** - View from directly above (XY plane)
3. **Left** - View from the left side (YZ plane)
4. **Right** - View from the right side (YZ plane)
5. **Bottom** - View from directly below

### View Offset

The `stlPreviewer.viewOffset` setting controls how far the camera is positioned from the object in these preset views. A larger value moves the camera further away.

```json
{
  "stlPreviewer.viewOffset": 40
}
```

## Display Options

### Grid

The floor grid helps visualize the object's position in 3D space.

**Enable/Disable:**
```json
{
  "stlPreviewer.showGrid": true
}
```

**Customize Color:**
```json
{
  "stlPreviewer.gridColor": "#333333"
}
```

### Axes Helper

Shows X, Y, Z axes to help understand object orientation.

```json
{
  "stlPreviewer.showAxes": true
}
```

- **Red** = X axis
- **Green** = Y axis
- **Blue** = Z axis

### Bounding Box

Displays a yellow box around the object showing its boundaries.

```json
{
  "stlPreviewer.showBoundingBox": true
}
```

### Info Box

Shows detailed information about the camera and object.

```json
{
  "stlPreviewer.showInfo": true
}
```

**Information Displayed:**
- Camera position (x, y, z)
- Camera rotation (x, y, z)
- Bounding box dimensions (width, length, height)
- Bounding box min/max coordinates

## Viewing Git Diffs

STL Previewer can visualize changes between different versions of an STL file.

### How to View Diffs

#### Method 1: Source Control Panel
1. Open the Source Control view (`Ctrl+Shift+G`)
2. Find a modified `.stl` file in the changes list
3. Click on the file
4. The diff will be displayed with color coding

#### Method 2: Git Command Line
```bash
# View changes in working tree
git diff filename.stl

# View changes in staged files
git diff --staged filename.stl

# Compare specific commits
git diff commit1 commit2 -- filename.stl
```

### Understanding Diff Colors

| Color | Meaning |
|-------|---------|
| 🟢 **Green** | Geometry added in the new version |
| 🔴 **Red** | Geometry removed from the old version |
| 🔵 **Blue** | Geometry that appears in both versions (intersection) |

### Diff View Opacity

When viewing diffs, the added and removed geometry is rendered with semi-transparency (70% opacity) to make it easier to see overlapping areas.

## Material Configuration

### Available Material Types

#### Lambert (Default)
Matte surface with diffuse reflection, good for general viewing.

```json
{
  "stlPreviewer.meshMaterialType": "lambert"
}
```

#### Phong
Shiny surface with specular highlights, good for plastic/metal objects.

```json
{
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "shininess": 30,
    "specular": "#ffffff"
  }
}
```

#### Standard
PBR (Physically Based Rendering) material for realistic rendering.

```json
{
  "stlPreviewer.meshMaterialType": "standard",
  "stlPreviewer.meshMaterialConfig": {
    "roughness": 0.5,
    "metalness": 0.1
  }
}
```

#### Basic
Simple flat shading without lighting effects.

```json
{
  "stlPreviewer.meshMaterialType": "basic"
}
```

#### Normal
Debug view showing surface normals as colors (useful for checking geometry).

```json
{
  "stlPreviewer.meshMaterialType": "normal"
}
```

### Custom Material Properties

You can pass any valid Three.js material properties in `meshMaterialConfig`:

```json
{
  "stlPreviewer.meshMaterialConfig": {
    "color": "#ff6600",
    "wireframe": false,
    "flatShading": false,
    "opacity": 1.0,
    "transparent": false,
    "side": 2,
    "shininess": 50,
    "specular": "#cccccc"
  }
}
```

Common properties:
- `color`: Hex color string (e.g., "#ff0000")
- `wireframe`: Show only edges (boolean)
- `flatShading`: Flat vs smooth shading (boolean)
- `opacity`: 0.0 to 1.0
- `transparent`: Enable transparency (boolean)
- `side`: 0=front, 1=back, 2=both

## Keyboard Shortcuts

While the STL Previewer is focused, standard VS Code shortcuts work:

| Shortcut | Action |
|----------|--------|
| `Ctrl+W` / `Cmd+W` | Close previewer |
| `Ctrl+K Z` / `Cmd+K Z` | Toggle Zen mode |
| `F11` | Toggle full screen |

## Tips and Tricks

### Performance Optimization

For very large STL files:
1. Use "basic" material type for faster rendering
2. Disable grid, axes, and bounding box
3. Disable info box updates
4. Close other heavy extensions

### Debug Information

Enable the info box to:
- Verify object dimensions
- Check camera position for screenshots
- Ensure object is properly centered
- Validate bounding box calculations

### Taking Screenshots

1. Position the camera to your desired view
2. Use VS Code's built-in screenshot tools
3. Or use external tools like Windows Snipping Tool, macOS Screenshot, etc.

### Working with Multiple Files

You can open multiple STL files side by side:
1. Open first STL file
2. Right-click second STL file
3. Select "Open to the Side"

### Comparing Files Manually

To compare two different STL files (not Git versions):
1. Open both files side by side
2. Use the same view angle for both
3. Toggle display options to match

### Git Integration Tips

- Commit your STL files in binary format (they're already binary)
- Use `.gitattributes` to mark STL files as binary:
  ```
  *.stl binary
  ```
- Enable Git LFS for large STL files

### Material Testing

Create a test configuration to quickly try different materials:

```json
{
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "color": "#808080",
    "shininess": 100,
    "specular": "#ffffff"
  }
}
```

## Troubleshooting

### File Won't Open
- Verify the file is a valid STL file (ASCII or Binary format)
- Check file size (very large files may take time to load)
- Look for errors in the Developer Console (Help > Toggle Developer Tools)

### Rendering Issues
- Try switching to "basic" material type
- Disable all display options (grid, axes, bounding box)
- Restart VS Code

### Diff Not Showing
- Ensure the Git extension is enabled
- Verify the file has actual changes
- Check that the file is tracked by Git

### Performance Issues
- Close unnecessary extensions
- Use a simpler material type
- Disable real-time info box updates
- Consider splitting very large models

## Next Steps

- Check [Configuration Guide](CONFIGURATION.md) for detailed settings
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) to help improve the extension
- Report issues on [GitHub](https://github.com/misiekhardcore/stl-previewer/issues)
