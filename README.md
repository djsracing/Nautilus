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

1. Replace sensor selection view with select2. - done
2. Remove lap tab. - done
3. Add lap selection dropdown menu in Analyse tab. - done
4. Automatic save session function. - done
5. Session file dialog menu. - done
6. Set default file location to "Documents/Nautilus" with timestamp. - done
7. Add mapping modal. - done
8. Show progress of mapping. - done
9. Don't replace current mapping until save button is pressed. - done
10. Add Kalman Filter for GPS data. - done
11. Save session interval. - done
12. Display current unit. - done
13. Django backend. - done
14. Fix reset button - done
15. Replace accel chart by scatter plot (x vs y)
16. Save session every lap.
17. Add seperate plots in Analysis
18. Integration and diff.