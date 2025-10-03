# Troubleshooting Guide

This guide helps resolve common issues with STL Previewer.

## Table of Contents

- [Installation Issues](#installation-issues)
- [File Loading Issues](#file-loading-issues)
- [Rendering Issues](#rendering-issues)
- [Git Diff Issues](#git-diff-issues)
- [Performance Issues](#performance-issues)
- [UI Issues](#ui-issues)
- [Getting Help](#getting-help)

## Installation Issues

### Extension Not Installing

**Symptoms:**

- Extension installation fails
- Extension doesn't appear in extensions list

**Solutions:**

1. **Check VS Code Version**

   ```
   Help > About
   ```

   - Ensure you have VS Code 1.52.0 or higher
   - Update VS Code if needed

2. **Check Internet Connection**

   - Verify you can access marketplace.visualstudio.com
   - Try installing from Open VSX if marketplace is blocked

3. **Clear Extension Cache**

   ```bash
   # Close VS Code first
   # Linux/macOS
   rm -rf ~/.vscode/extensions

   # Windows
   rd /s /q %USERPROFILE%\.vscode\extensions
   ```

4. **Manual Installation**
   - Download .vsix from releases
   - Install via `Extensions > ... > Install from VSIX`

### Extension Not Activating

**Symptoms:**

- Extension installed but not working
- STL files don't open in previewer

**Solutions:**

1. **Check Activation Events**

   - Open Command Palette (`Ctrl+Shift+P`)
   - Type "Developer: Show Running Extensions"
   - Verify `misiekhardcore.stl-previewer` is listed

2. **Check for Conflicts**

   - Disable other STL viewer extensions
   - Restart VS Code

3. **Reinstall Extension**
   - Uninstall completely
   - Restart VS Code
   - Reinstall extension

## File Loading Issues

### STL File Won't Open

**Symptoms:**

- Clicking STL file does nothing
- Error message appears
- Loading spinner never stops

**Solutions:**

1. **Verify File Format**

   ```bash
   # Check if file is valid STL
   file yourfile.stl
   ```

   - Should show "STereoLithography" or similar
   - Both ASCII and Binary STL formats are supported

2. **Check File Size**

   - Very large files (>50MB) may take time to load
   - Wait at least 30 seconds before assuming failure
   - Consider splitting large files

3. **Check File Permissions**

   - Ensure you have read permissions
   - Verify file is not locked by another application

4. **Check Console for Errors**

   - Open Developer Tools: `Help > Toggle Developer Tools`
   - Check Console tab for error messages
   - Look for relevant error messages

5. **Try Opening in Text Editor**
   - Right-click file → Open With → Text Editor
   - Verify file is not corrupted
   - ASCII STL should show "solid" at start

### Loading Spinner Stuck

**Symptoms:**

- File opens but shows loading animation indefinitely

**Solutions:**

1. **Wait Longer**

   - Large files can take several minutes
   - Check CPU usage to see if processing is happening

2. **Check Worker Loading**

   - Open Developer Console
   - Look for "CSG_WORKER_URL" errors
   - May indicate issue with extension installation

3. **Restart VS Code**

   - Close and reopen VS Code
   - Try opening file again

4. **Clear Cache**
   ```bash
   # Close VS Code
   # Delete workspace storage
   rm -rf ~/.config/Code/User/workspaceStorage
   ```

## Rendering Issues

### Black/Blank Screen

**Symptoms:**

- Viewer opens but shows only black screen
- No visible 3D model

**Solutions:**

1. **Check GPU Acceleration**

   - Some systems have issues with hardware acceleration
   - Try disabling: `"disable-hardware-acceleration": true` in VS Code settings

2. **Reset Camera**

   - File might be loading but camera position is wrong
   - Try zooming out (scroll wheel)
   - Try different view buttons

3. **Check Material Settings**

   - Try changing material type to "basic"

   ```json
   {
     "stlPreviewer.meshMaterialType": "basic"
   }
   ```

4. **Verify Object Has Size**
   - Enable info box to check bounding box dimensions
   - Object might be extremely small or large

### Model Appears Distorted

**Symptoms:**

- Model looks stretched or squashed
- Proportions seem wrong

**Solutions:**

1. **Check Source File**

   - Open file in another STL viewer
   - Verify file is not corrupted
   - Check file was exported correctly

2. **Reset View**

   - Click isometric view button
   - Try zooming to fit object

3. **Check Scale in Source**
   - Some STL exporters use different units
   - Model might be exported at wrong scale

### Rendering Artifacts

**Symptoms:**

- Visual glitches
- Flickering
- Z-fighting (surfaces flickering between each other)

**Solutions:**

1. **Update Graphics Drivers**

   - Update your GPU drivers
   - Restart computer

2. **Try Different Material**

   ```json
   {
     "stlPreviewer.meshMaterialType": "lambert"
   }
   ```

3. **Disable Transparency**
   ```json
   {
     "stlPreviewer.meshMaterialConfig": {
       "transparent": false
     }
   }
   ```

## Git Diff Issues

### Diff View Not Working

**Symptoms:**

- Clicking modified STL file in Source Control shows nothing
- Only one version is displayed

**Solutions:**

1. **Verify Git Extension**

   - Ensure Git extension is enabled
   - Check: `Extensions > Git` is enabled

2. **Check Git Installation**

   ```bash
   git --version
   ```

   - Ensure Git is installed
   - Ensure Git is in PATH

3. **Verify File is Tracked**

   ```bash
   git ls-files yourfile.stl
   ```

   - File must be tracked by Git
   - File must have committed history

4. **Check File Changes**
   ```bash
   git status yourfile.stl
   ```
   - Verify file actually has changes

### Diff Shows Wrong Colors

**Symptoms:**

- Colors don't match expectations
- Can't distinguish added/removed parts

**Solutions:**

1. **Check Material Settings**

   - Diff view uses semi-transparent colors
   - Material config might override colors

2. **Reset Material Config**

   ```json
   {
     "stlPreviewer.meshMaterialConfig": null
   }
   ```

3. **Verify Changes**
   - Use Git command line to verify actual changes
   - File might not have geometric changes

### CSG Operation Fails

**Symptoms:**

- Error message about CSG operations
- Diff calculation fails

**Solutions:**

1. **Check Model Complexity**

   - Very complex models may fail CSG operations
   - Try simplifying models in CAD software

2. **Check Console for Errors**

   - Open Developer Tools
   - Check for specific error messages

3. **Verify Both Versions Load**
   - Try opening old and new versions separately
   - Ensure both are valid STL files

## Performance Issues

### Slow Loading

**Symptoms:**

- Takes very long to open files
- UI becomes unresponsive

**Solutions:**

1. **Check File Size**

   - Large files naturally take longer
   - Consider splitting files if possible

2. **Use Simpler Material**

   ```json
   {
     "stlPreviewer.meshMaterialType": "basic"
   }
   ```

3. **Disable Display Options**

   ```json
   {
     "stlPreviewer.showInfo": false,
     "stlPreviewer.showGrid": false,
     "stlPreviewer.showAxes": false,
     "stlPreviewer.showBoundingBox": false
   }
   ```

4. **Close Other Extensions**
   - Disable heavy extensions temporarily
   - Restart VS Code

### Laggy Interaction

**Symptoms:**

- Camera movements are choppy
- Rotation/zoom is slow

**Solutions:**

1. **Reduce Visual Complexity**

   - Disable grid: `"stlPreviewer.showGrid": false`
   - Use basic material
   - Disable info box updates

2. **Check System Resources**

   - Close other applications
   - Check CPU/GPU usage
   - Ensure adequate RAM

3. **Update Graphics Drivers**

   - Update GPU drivers
   - Restart computer

4. **Try Wireframe Mode**
   ```json
   {
     "stlPreviewer.meshMaterialConfig": {
       "wireframe": true
     }
   }
   ```

## UI Issues

### View Buttons Not Showing

**Symptoms:**

- View control buttons missing

**Solutions:**

1. **Check Setting**

   ```json
   {
     "stlPreviewer.showViewButtons": true
   }
   ```

2. **Refresh View**
   - Close and reopen file
   - Restart VS Code

### Info Box Not Updating

**Symptoms:**

- Info box shows but values don't update

**Solutions:**

1. **Check Setting**

   ```json
   {
     "stlPreviewer.showInfo": true
   }
   ```

2. **Refresh View**
   - Close and reopen file
   - Check Developer Console for errors

### UI Elements Overlapping

**Symptoms:**

- Buttons overlap with model
- Text is unreadable

**Solutions:**

1. **Adjust Window Size**

   - Resize VS Code window
   - Try full screen mode

2. **Adjust Offset**
   - The UI elements use CSS variables
   - Report as bug if persistent

## Getting Help

If you can't resolve your issue:

### 1. Gather Information

Collect the following:

- VS Code version (`Help > About`)
- Extension version (Extensions panel)
- Operating System and version
- STL file size (if applicable)
- Error messages from Developer Console
- Steps to reproduce the issue

### 2. Check Existing Issues

Search for similar issues:

- [GitHub Issues](https://github.com/misiekhardcore/stl-previewer/issues)
- Look for closed issues too (might have solutions)

### 3. Enable Logging

1. Open Developer Tools: `Help > Toggle Developer Tools`
2. Go to Console tab
3. Reproduce the issue
4. Copy console output

### 4. Create a Bug Report

If issue is not found:

1. Go to [GitHub Issues](https://github.com/misiekhardcore/stl-previewer/issues/new)
2. Use the bug report template
3. Include all gathered information
4. Attach screenshots if helpful
5. Share minimal STL file that reproduces issue (if possible)

### 5. Community Support

- Check [GitHub Discussions](https://github.com/misiekhardcore/stl-previewer/discussions)
- Ask questions with detailed context
- Share your configuration and setup

## Common Error Messages

### "Viewer element not found"

**Cause:** Internal error with webview initialization

**Solution:**

- Restart VS Code
- Reinstall extension
- Report as bug if persistent

### "CSG worker URL not available"

**Cause:** Worker script failed to load

**Solution:**

- Check extension installation
- Try reinstalling extension
- Check Developer Console for network errors

### "No solids provided for diff calculation"

**Cause:** One or both versions of STL file failed to load

**Solution:**

- Verify both versions are valid STL files
- Check Git history is intact
- Try viewing files individually first

## Debug Mode

To run VS Code in debug mode for better error reporting:

```bash
# Linux/macOS
code --verbose --log debug

# Windows
code.exe --verbose --log debug
```

This will provide more detailed logs in the console.
