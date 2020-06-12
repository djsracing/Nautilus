# Nautilus

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
        node - serialport
    </li>
</ul>

Main GUI is based on <a href="https://themeforest.net/item/cork-responsive-admin-dashboard-template/25582188" > Cork Admin Template </a>
(<a href="https://www14.zippyshare.com/v/rxtwUuAS/file.html">Download link</a> - do not distribute!).

***
### Download links

You can download the latest version of Nautilus for Windows, macOS and Debian based systems (Ubuntu, mint, etc.) from the <a href="https://github.com/djsracing/Nautilus/releases">releases page</a>.

***
### Build from source

```
git clone
cd Nautilus
npm install
npm run package-win      # package-mac, package-linux for others
```

A new directory will be created in ```/release_builds``` that contains the compiled binaries.


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

### Screenshots

-
