# Configuration Guide

This guide explains all available configuration options for STL Previewer.

## Table of Contents

- [Accessing Settings](#accessing-settings)
- [Visual Display Settings](#visual-display-settings)
- [Camera Settings](#camera-settings)
- [Material Settings](#material-settings)
- [Grid Settings](#grid-settings)
- [Debug Settings](#debug-settings)
- [Configuration Examples](#configuration-examples)

## Accessing Settings

### Via VS Code Settings UI

1. Open Settings: `File > Preferences > Settings` (or `Ctrl+,`)
2. Search for "STL Previewer"
3. Modify settings as needed

### Via settings.json

1. Open Command Palette: `Ctrl+Shift+P`
2. Type "Preferences: Open Settings (JSON)"
3. Add STL Previewer settings

## Visual Display Settings

### Show View Buttons

Controls whether camera position control buttons are displayed.

```json
{
  "stlPreviewer.showViewButtons": true
}
```

- **Type**: `boolean`
- **Default**: `true`
- **Description**: When enabled, shows buttons in the top-right corner for quick camera positioning (Isometric, Top, Left, Right, Bottom views)

**Use Cases:**

- Enable for quick navigation between standard views
- Disable for a cleaner interface or when you prefer manual camera control

### Show Info Box

Controls whether the debug information panel is displayed.

```json
{
  "stlPreviewer.showInfo": false
}
```

- **Type**: `boolean`
- **Default**: `false`
- **Description**: When enabled, shows a panel with real-time camera position, rotation, and object bounding box information

**Information Displayed:**

- Camera X, Y, Z position
- Camera X, Y, Z rotation
- Bounding box width, length, height
- Bounding box min/max coordinates

**Use Cases:**

- Enable for debugging or precision work
- Enable when you need exact measurements
- Disable for cleaner viewing experience

### Show Axes

Controls whether the axes helper is displayed.

```json
{
  "stlPreviewer.showAxes": false
}
```

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Shows X, Y, Z coordinate axes at the origin

**Axes Colors:**

- Red = X axis
- Green = Y axis
- Blue = Z axis

**Use Cases:**

- Enable to understand object orientation
- Enable when teaching/learning 3D concepts
- Enable for debugging coordinate systems

### Show Bounding Box

Controls whether the object's bounding box is displayed.

```json
{
  "stlPreviewer.showBoundingBox": false
}
```

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Shows a yellow wireframe box around the object representing its boundaries

**Use Cases:**

- Enable to see object dimensions at a glance
- Enable to verify object positioning
- Enable for collision detection visualization

### Show Grid

Controls whether the floor grid is displayed.

```json
{
  "stlPreviewer.showGrid": true
}
```

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Shows a grid on the ground plane for spatial reference

**Use Cases:**

- Enable for better depth perception
- Enable to understand object position relative to ground
- Disable for cleaner screenshots or presentations

## Camera Settings

### View Offset

Controls the distance of the camera from the object in preset views.

```json
{
  "stlPreviewer.viewOffset": 40
}
```

- **Type**: `number`
- **Default**: `40`
- **Description**: Distance multiplier for preset camera positions

**How it works:**

- Larger values = camera further away (wider view)
- Smaller values = camera closer (tighter view)
- Only affects preset view buttons, not manual camera control

**Recommended Values:**

- Small objects: 20-30
- Medium objects: 30-50
- Large objects: 50-100

## Material Settings

### Mesh Material Type

Controls the rendering material type for the 3D object.

```json
{
  "stlPreviewer.meshMaterialType": "lambert"
}
```

- **Type**: `enum`
- **Default**: `"lambert"`
- **Options**: `"basic"`, `"standard"`, `"lambert"`, `"normal"`, `"phong"`
- **Description**: Determines how the object surface is rendered

#### Material Type Details

**Basic Material**

- Flat shading without lighting effects
- Fastest rendering performance
- Good for large files or performance-critical scenarios

**Lambert Material (Default)**

- Matte surface with diffuse reflection
- Good for general viewing
- Low computational cost
- No specular highlights

**Phong Material**

- Shiny surface with specular highlights
- Good for plastics, metals, and reflective surfaces
- Moderate computational cost
- Configurable shininess and specular properties

**Standard Material (PBR)**

- Physically Based Rendering
- Most realistic material appearance
- High computational cost
- Roughness and metalness controls

**Normal Material**

- Debug view showing surface normals as colors
- Useful for checking geometry and debugging
- RGB colors represent XYZ directions

### Mesh Material Config

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

Advanced material configuration using Three.js material properties.

```json
{
  "stlPreviewer.meshMaterialConfig": null
}
```

- **Type**: `object` or `null`
- **Default**: `null`
- **Description**: Custom material properties (Three.js format)

#### Common Properties

**Color**

```json
{
  "stlPreviewer.meshMaterialConfig": {
    "color": "#ff6600"
  }
}
```

**Wireframe**

```json
{
  "stlPreviewer.meshMaterialConfig": {
    "wireframe": true
  }
}
```

**Transparency**

```json
{
  "stlPreviewer.meshMaterialConfig": {
    "transparent": true,
    "opacity": 0.5
  }
}
```

**Phong Material**

```json
{
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "shininess": 100,
    "specular": "#ffffff",
    "color": "#808080"
  }
}
```

**Standard Material (PBR)**

```json
{
  "stlPreviewer.meshMaterialType": "standard",
  "stlPreviewer.meshMaterialConfig": {
    "roughness": 0.5,
    "metalness": 0.2,
    "color": "#808080"
  }
}
```

#### Available Properties by Material Type

**Basic Material**

- `color`: Color (hex string)
- `wireframe`: Boolean
- `opacity`: Number (0-1)
- `transparent`: Boolean
- `side`: Number (0=front, 1=back, 2=both)

**Lambert Material**

- `color`: Color (hex string)
- `emissive`: Color (hex string)
- `wireframe`: Boolean
- `opacity`: Number (0-1)
- `transparent`: Boolean

**Phong Material**

- `color`: Color (hex string)
- `emissive`: Color (hex string)
- `specular`: Color (hex string)
- `shininess`: Number (0-100+)
- `wireframe`: Boolean
- `opacity`: Number (0-1)
- `transparent`: Boolean

**Standard Material**

- `color`: Color (hex string)
- `roughness`: Number (0-1)
- `metalness`: Number (0-1)
- `emissive`: Color (hex string)
- `wireframe`: Boolean
- `opacity`: Number (0-1)
- `transparent`: Boolean

## Grid Settings

### Grid Color

Controls the color of the floor grid.

```json
{
  "stlPreviewer.gridColor": "#111"
}
```

- **Type**: `string`
- **Default**: `"#111"` (dark gray)
- **Description**: Hex color code for the grid

**Recommended Colors:**

- Dark theme: `"#333"`, `"#444"`, `"#555"`
- Light theme: `"#ccc"`, `"#ddd"`, `"#eee"`
- Custom: Any valid hex color code

## Configuration Examples

### Minimal Setup (Performance)

```json
{
  "stlPreviewer.showViewButtons": false,
  "stlPreviewer.showInfo": false,
  "stlPreviewer.showAxes": false,
  "stlPreviewer.showBoundingBox": false,
  "stlPreviewer.showGrid": false,
  "stlPreviewer.meshMaterialType": "basic"
}
```

### Debug Setup

```json
{
  "stlPreviewer.showViewButtons": true,
  "stlPreviewer.showInfo": true,
  "stlPreviewer.showAxes": true,
  "stlPreviewer.showBoundingBox": true,
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#333"
}
```

### High-Quality Rendering

```json
{
  "stlPreviewer.showViewButtons": true,
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#222",
  "stlPreviewer.meshMaterialType": "standard",
  "stlPreviewer.meshMaterialConfig": {
    "roughness": 0.3,
    "metalness": 0.8,
    "color": "#c0c0c0"
  }
}
```

### Presentation Mode

```json
{
  "stlPreviewer.showViewButtons": false,
  "stlPreviewer.showInfo": false,
  "stlPreviewer.showAxes": false,
  "stlPreviewer.showBoundingBox": false,
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#000",
  "stlPreviewer.meshMaterialType": "phong",
  "stlPreviewer.meshMaterialConfig": {
    "color": "#4080ff",
    "shininess": 80,
    "specular": "#ffffff"
  }
}
```

### Transparent Wireframe

```json
{
  "stlPreviewer.showGrid": false,
  "stlPreviewer.meshMaterialType": "basic",
  "stlPreviewer.meshMaterialConfig": {
    "wireframe": true,
    "color": "#00ff00"
  }
}
```

### Engineering View

```json
{
  "stlPreviewer.showViewButtons": true,
  "stlPreviewer.showInfo": true,
  "stlPreviewer.showAxes": true,
  "stlPreviewer.showBoundingBox": true,
  "stlPreviewer.showGrid": true,
  "stlPreviewer.gridColor": "#444",
  "stlPreviewer.meshMaterialType": "lambert",
  "stlPreviewer.viewOffset": 50
}
```
