var electronInstaller = require('electron-winstaller');
var path = require('path');
// In this case, we can use relative paths
var settings = {
    // Specify the folder where the built app is located
    appDirectory: './Nautilus-win32-x64',
    // Specify the existing folder where
    outputDirectory: './Nautilus-installers',
    // The name of the Author of the app (the name of your company)
    authors: 'DJS Racing',
    // The name of the executable of your built
    exe: './Nautilus.exe',
    description: 'DJSR E03 Data Visualization App',
    loadingGif: path.join(__dirname, './templates/assets/gif/Nautilus.gif'),
    iconUrl: path.join(__dirname, './templates/assets/img/Nautilus.ico'),
    setupIcon: path.join(__dirname, './templates/assets/img/Nautilus.ico')
};

resultPromise = electronInstaller.createWindowsInstaller(settings);

resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});
