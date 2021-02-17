# Nautilus
<span style="display: inline-block;">

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com/)
[![Version](https://img.shields.io/badge/Version-1.0.0b-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![made-with-electron](https://img.shields.io/badge/Made%20with-Electron-1f425f.svg)](https://www.python.org/)

</span>

<p align="center">
  <img src="templates\assets\img\Nautilus.png" height="40%", width="40%">
</p>

Nautilus is a cross-platform visualization tool for sensor data in serial form.

### Dependencies

<ul>
    <li> 
        <p>Node.js</p>
    </li>
    <li> 
        <p>Electron</p>
    </li>
    <li>
        <p>ApexCharts</p>
    </li>
    <li>
        node-serialport
    </li>
</ul>

Main GUI is based on <a href="https://themeforest.net/item/cork-responsive-admin-dashboard-template/25582188" > CORK Admin Template.

***
### Download links

You can download the latest version of Nautilus for Windows, macOS and Debian based systems (Ubuntu, mint, etc.) from the <a href="https://github.com/djsracing/Nautilus/releases">releases page</a>.

***
### Run the app

```
git clone
cd Nautilus
npm install
npm start
```

***
### Package the app
```
npm run build
node ./build.js
```
A new folder will be created which contains the installer files.
***
### Directory structure

```
~/Nautilus
  |__ Licenses
  |__ .gitignore
  |__ package-lock.json
  |__ package.json
  |__ main.js
  |__ page_render_files.js
  |__ ...
  |__ node_modules
  |__ release_builds
  |__ templates
      |__ _assets
      |   |__ css
      |   |__ img
      |   |__ img
      |__ bootstrap
      |__ plugins
      |__ sass
      |
      |__ pages.html
      |__ ...
```
***
### TODO
- VirtualGL integration.
