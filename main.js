// Imports
let {config} = require('./config');

const {app, BrowserWindow, Menu, ipcMain, systemPreferences} = require('electron');
const url = require('url');
const path = require('path');
const SerialPort = require('serialport');
const fs = require('fs');
const mkdirp = require('mkdirp');

// Set exports
exports.mode = 'light';

exports.savePath = app.getPath('documents');
exports.appConfigPath = app.getPath('userData');

if(systemPreferences.isDarkMode()){
    exports.mode = 'dark';
}

var session = {};
var d = new Date()
var sessionTimestamp = d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();
var sessionSavePath = path.join(app.getPath('documents'), './Nautilus/');

var trackMap = [];

// Set global variables
const _sharedObj = {config:config, session:session, trackMap:trackMap, sessionSavePath:sessionSavePath};

global.sharedObj = _sharedObj;
// fs.writeFileSync('./test.json', JSON.stringify(config))
// console.log(app.getPath('documents'));
try {
    let newConfig = JSON.parse(fs.readFileSync(path.join(exports.appConfigPath, './config.json'), 'utf8'));
    global.sharedObj.config = newConfig;
    console.log("Continuing last session.");
}catch (err){
    console.log(err);
    console.log("Couldn't load last session.");
}

// Set environment
process.env.NODE_ENV = 'development';

// Set serial port handlers
const Readline = SerialPort.parsers.Readline;

// Set main process variables
let mainWindow;
let changePort;
let port;
let parser;
let data;

// Listen for app to be ready
app.on('ready', function() {

    mainWindow = new BrowserWindow({
        // frame:false,
        webPreferences: {
            // Enable Node.js integration
            nodeIntegration: true
        },
        icon: __dirname + '/templates/assets/img/djsr.jpg'
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'templates/dashboard.html'),
        protocol:'file:',
        slashes: true
    }));
    mainWindow.setBackgroundColor('#050715');
    mainWindow.once('ready-to-show', function (){
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.on('closed', function() {
        const path = require('path');
        const fs = require('fs');
        fs.writeFileSync(path.join(exports.appConfigPath, './config.json'), JSON.stringify(global.sharedObj.config));
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Create new template
const mainMenuTemplate = [
    {
        label:'Actions',
        submenu:[
            {
                label: 'Select Port',
                accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',
                click() {
                    mainWindow.webContents.send('action-port', 'clicked');
                }
            },
            {
                role: 'reload'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu : [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}

// Handle change COM Port
exports.handleForm = function handleForm(targetWindow, com_port) {
    // console.log("this is the name of the port ->", com_port)
    
    // Set serial port
    port = null;
    parser = null;
    port = new SerialPort(com_port, {
        baudRate: 9600,
        flowControl: false,
        parser: new SerialPort.parsers.Readline("\n")
    });
    parser = new Readline();
    port.pipe(parser);
    parser.on('data', function(data) {
        data = data.split(',');
        mainWindow.webContents.send('ser-data', data);
    });
    targetWindow.webContents.send('form-received', com_port);
};

exports.handleNameChange = function handleNameChange(targetWindow, sensorID, newName) {
    global.sharedObj.config[sensorID] = newName;
    targetWindow.webContents.send('name-changed', newName);
}

exports.handleMapChange = function handleMapChange(targetWindow, sensorID, map1, unit1, map2, unit2) {
    global.sharedObj.config[sensorID+'_mapping1'] = map1;
    global.sharedObj.config[sensorID+'_unit1'] = unit1;
    global.sharedObj.config[sensorID+'_mapping2'] = map2;
    global.sharedObj.config[sensorID+'_unit2'] = unit2;
    targetWindow.webContents.send('map-changed');
}

exports.handleSaveSession = function handleSaveSession(targetWindow) {
    try {
        var tempPath = sessionSavePath + sessionTimestamp + '.json'
        mkdirp(sessionSavePath);
        fs.writeFileSync(tempPath, JSON.stringify(session));
        targetWindow.webContents.send('session-save-success');
    }catch (err){
        console.log(err);
        console.log("Couldn't save session.");
        targetWindow.webContents.send('session-save-failure');
    }
}

exports.handleChangeSessionPath = function handleChangeSessionPath(targetWindow, pathName) {
    sessionSavePath = pathName;
    if(process.platform == 'darwin' || process.platform == 'linux') {
        sessionSavePath += '/';
    }else {
        sessionSavePath += '\\';
    }
    
    global.sharedObj.config["sessionSavePath"] = sessionSavePath;
    targetWindow.webContents.send('session-change-success');
}

exports.handleLoadConfig = function handleLoadConfig(targetWindow, fileName) {
    try {
        let newConfig = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        global.sharedObj.config = newConfig;
        targetWindow.webContents.send('config-success');
    }catch (err){
        console.log(err);
        console.log("Couldn't load config.");
        targetWindow.webContents.send('config-failure');
    }
}

exports.handleResetConfig = function handleResetConfig(targetWindow) {
    global.sharedObj.config = config;
    targetWindow.webContents.send('reset-success');
}

exports.handleChangeMode = function handleChangeMode(targetWindow, mode) {
    exports.mode = mode;
}

exports.handleChangeTrackMap = function handleChangeTrackMap(targetWindow, map) {
    global.sharedObj.trackMap = map;
    targetWindow.webContents.send('track-map-change-success');
}
