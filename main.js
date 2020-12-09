// Imports
const {config} = require('./config');

const {app, BrowserWindow, Menu, ipcMain, nativeTheme} = require('electron');
const window = require('electron').BrowserWindow;
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) return;

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Set exports
exports.mode = 'light';

exports.savePath = app.getPath('documents');
exports.appConfigPath = app.getPath('userData');

if(nativeTheme.shouldUseDarkColors){
    exports.mode = 'dark';
}

let session = {};
let globalMap = [];
let d;
let sessionTimestamp;
let currentIdx;
var sessionSavePath = path.join(app.getPath('documents'), './Nautilus/');

function initSession() {
    session = {};
    d = new Date();
    sessionTimestamp = d.getFullYear() + '_' + d.getMonth() + '_' + d.getDate() + '_' + d.getHours() + '_' + d.getMinutes() + '_' + d.getSeconds();
    currentIdx = 0;
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
                    serPortName:serPortName,
                    globalMap:globalMap
};

global.sharedObj = _sharedObj;

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
            nodeIntegration: true,
        },
        width: 800,
        height:700,
        icon: __dirname + '/templates/assets/img/Nautilus.ico'
    });
    // Load html into window
    let url = require('url');
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
        try{
            socket.disconnect();
        }catch (err) {
            console.log("Already disconnected");
        }

        try {
            let mkdirp = require('mkdirp');
            var tempPath = sessionSavePath + sessionTimestamp + '.json'
            mkdirp(sessionSavePath);
            fs.writeFileSync(tempPath, JSON.stringify(session));
        }catch (err){
            console.log(err);
            console.log("Couldn't save session.");
        }

        console.log('Saving to: ', path.join(exports.appConfigPath, './config.json'))
        fs.writeFile(path.join(app.getPath('userData'), './config.json'),
                     JSON.stringify(global.sharedObj.config),
                     { flag: 'w' }, 
                     (err) => {
                        console.log(err)
                     }
        );
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

        try{
            port.close();
        }catch (_)  {
            console.log("Already disconnected.");
        }

        // Set serial port
        let SerialPort = require('serialport');
        port = null;
        parser = null;
        port = new SerialPort(com_port, {
            baudRate: 9600,
            flowControl: false,
            parser: new SerialPort.parsers.Readline("\n")
        });

        // Set serial port handlers
        parser = new SerialPort.parsers.Readline();
        port.pipe(parser);
        
        port.on('close', function() { 
            port = null;
            parser = null;
        });

        parser.on('data', function(data) {
            data = data.split(',');

            if(data[2] > currentIdx) {
                currentIdx++;
                session[currentIdx] = [];
                let focusedWindow = window.getAllWindows()[0];
                exports.handleSaveSession(focusedWindow);
            }

            session[currentIdx].push(data);

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
    
    try{
        port.close();
    }catch (_)  {
        console.log("Already disconnected.");
    }

    url = 'http://' + url;
    
    global.sharedObj.connectedToCloud = true;
    global.sharedObj.connectedToSer = false;
    fetchDataFromSer = false;
    cloudURL = url;

    global.sharedObj.cloudURL = url;

    // Create socket connection
    const io = require('socket.io-client');
    socket = io.connect(cloudURL, {
                'reconnection': true,
                'reconnectionDelay': 500,
                'reconnectionAttempts': 100
                });
    
    console.log(cloudURL);

    socket.on('connect', function() {
        socket.emit('join', "{'room':'DJSR'}");
        let focusedWindow = window.getAllWindows()[0];
        focusedWindow.webContents.send('cloud-connection-success');
    });

    socket.on('response', function(data) {
        console.log("Joined a room!");
    });

    socket.on('data', function(data) {

        if(data['data_string'][2] > currentIdx) {
            currentIdx++;
            session[currentIdx] = [];
            let focusedWindow = window.getAllWindows()[0];
            exports.handleSaveSession(focusedWindow);
        }

        session[currentIdx].push(data['data_string']);

        if(!fetchDataFromSer) {
            let focusedWindow = window.getAllWindows()[0];
            focusedWindow.webContents.send('ser-data', data['data_string']);
        }
    });

    socket.on('reconnecting', function() {
        console.log('Reconnecting');
    });

    socket.on('disconnect', function() {
        let focusedWindow = window.getAllWindows()[0];
        focusedWindow.webContents.send('cloud-connection-failed');
    });

}

exports.handleDisconnectToCloud = function handleDisconnectToCloud(targetWindow) {
    cloudURL = '';
    global.sharedObj.cloudURL = '';
    try{
        socket.disconnect();
    }catch (_) {
        console.log("Already disconnected.");
    }
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

exports.handleSaveSession = async function handleSaveSession(targetWindow) {
    try {
        let mkdirp = require('mkdirp');
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

exports.requestSessionData = function requestSessionData(targetWindow) {
    // targetWindow.send('session-data-sent', session);
    return session;
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
    return false;
    }
    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
    const spawn = function(command, args) {
    let spawnedProcess, error;
    try {
    spawnedProcess = ChildProcess.spawn(command, args, {
    detached: true
    });
    } catch (error) {}
    return spawnedProcess;
    };
    const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
    };
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
    // Optionally do things such as:
    // - Add your .exe to the PATH
    // - Write to the registry for things like file associations and
    //   explorer context menus
    // Install desktop and start menu shortcuts
    spawnUpdate(['--createShortcut', exeName]);
    setTimeout(application.quit, 1000);
    return true;
    case '--squirrel-uninstall':
    // Undo anything you did in the --squirrel-install and
    // --squirrel-updated handlers
    // Remove desktop and start menu shortcuts
    spawnUpdate(['--removeShortcut', exeName]);
    setTimeout(application.quit, 1000);
    return true;
    case '--squirrel-obsolete':
    // This is called on the outgoing version of your app before
    // we update to the new version - it's the opposite of
    // --squirrel-updated
    application.quit();
    return true;
    }
    };
