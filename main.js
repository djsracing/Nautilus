// Imports
let {config} = require('./config');

const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const SerialPort = require('serialport');
const fs = require('fs');

// Set global variables
const _sharedObj = {config:config};

global.sharedObj = _sharedObj;
fs.writeFileSync('./test.json', JSON.stringify(config))
// console.log(app.getPath('documents'));

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

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

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
