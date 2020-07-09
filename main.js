// Imports
const {config} = require('./config');

const {app, BrowserWindow, Menu, ipcMain, systemPreferences} = require('electron');
const window = require('electron').BrowserWindow;
const url = require('url');
const path = require('path');
const SerialPort = require('serialport');
const io = require('socket.io-client');
const fs = require('fs');
const mkdirp = require('mkdirp');

// Set exports
exports.mode = 'light';

exports.savePath = app.getPath('documents');
exports.appConfigPath = app.getPath('userData');

if(systemPreferences.isDarkMode()){
    exports.mode = 'dark';
}

let session;
let d;
let sessionTimestamp;
var sessionSavePath = path.join(app.getPath('documents'), './Nautilus/');;

function initSession() {
    session = {};
    d = new Date()
    sessionTimestamp = d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();
}

initSession();

var trackMap = [];

// Set global variables
var connectedToCloud = false;
var connectedToSer = false;
var fetchDataFromSer = true;
var cloudURL = ''
var serPortName = '';

const _sharedObj = {config:config, 
                    session:session, 
                    trackMap:trackMap, 
                    sessionSavePath:sessionSavePath, 
                    cloudURL:cloudURL, 
                    connectedToCloud:connectedToCloud, 
                    connectedToSer:connectedToSer, 
                    serPortName:serPortName
};

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

// Cloud Connection
var cloudURL = '';

// Set main process variables
var mainWindow;
var port;
var parser;
var data;
var socket;

// Listen for app to be ready
app.on('ready', function() {

    mainWindow = new BrowserWindow({
        // frame:false,
        webPreferences: {
            // Enable Node.js integration
            nodeIntegration: true
        },
        icon: __dirname + '/templates/assets/img/djsr.png'
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
        const fs = require('fs');

        try{
            socket.disconnect();
        }catch (_) {
            console.log("Already disconnected");
        }

        try {
            var tempPath = sessionSavePath + sessionTimestamp + '.json'
            mkdirp(sessionSavePath);
            fs.writeFileSync(tempPath, JSON.stringify(session));
        }catch (err){
            console.log(err);
            console.log("Couldn't save session.");
        }
        const path = require('path');
        mkdirp(path.join(exports.appConfigPath, './config.json'));
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
                label: 'Settings',
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
    try{

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
            if(fetchDataFromSer) {
                mainWindow.webContents.send('ser-data', data);
            }
        });

        fetchDataFromSer = true;

        global.sharedObj.connectedToCloud = false;
        global.sharedObj.connectedToSer = true;

        global.sharedObj.serPortName = com_port;

        targetWindow.webContents.send('form-received', com_port);

    }catch {
        targetWindow.webContents.send('form-not-received', com_port);
    }
};

exports.handleNewSession = function handleNewSession(targetWindow) {
    initSession();
    targetWindow.webContents.send('new-session-success');
}

exports.handleConnectToCloud = function handleConnectToCloud(targetWindow, url) {
    
    url = 'http://' + url;
    
    global.sharedObj.connectedToCloud = true;
    global.sharedObj.connectedToSer = false;
    fetchDataFromSer = false;
    cloudURL = url;

    global.sharedObj.cloudURL = url;

    // Create socket connection
    socket = io.connect(cloudURL, {
                'reconnection': true,
                'reconnectionDelay': 500,
                'reconnectionAttempts': 10
                });
    
    console.log(cloudURL);

    socket.on('connect', function() {
        socket.emit('join', "{'room':'DJSR'}");
        console.log("Connected");
    });

    socket.on('response', function(data) {
        console.log("Joined a room!");
    });

    socket.on('data', function(data) {
        if(!fetchDataFromSer) {
            let focusedWindow = window.getAllWindows()[0];
            focusedWindow.webContents.send('ser-data', data['data_string']);
        }
    });

    socket.on('reconnecting', function() {
        let focusedWindow = window.getAllWindows()[0];
        console.log('Reconnecting');
        focusedWindow.webContents.send('cloud-connection-failed');
    });

    socket.on('disconnect', function() {
        console.log("Disconnected");
    });

}

exports.handleDisconnectToCloud = function handleDisconnectToCloud(targetWindow) {
    cloudURL = '';
    global.sharedObj.cloudURL = '';
    socket.disconnect();
}

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

function autoSaveSession() {
    try{
        let focusedWindow = window.getAllWindows()[0];
        exports.handleSaveSession(focusedWindow);
    }catch (e){
        console.log(e);
    }
}

setInterval(autoSaveSession, 60000);

exports.handleChangeSessionPath = function handleChangeSessionPath(targetWindow, pathName) {
    sessionSavePath = pathName;
    if(process.platform == 'darwin' || process.platform == 'linux') {
        sessionSavePath += '/';
    }else {
        sessionSavePath += '\\';
    }
    
    global.sharedObj.config["sessionSavePath"] = sessionSavePath;
    global.sharedObj.sessionSavePath = sessionSavePath;
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
