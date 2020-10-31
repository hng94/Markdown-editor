"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveHtml = exports.openFile = exports.saveMarkdown = exports.getFileFromUser = void 0;
var fs = require("fs");
var electron_1 = require("electron");
var constants_1 = require("./constants");
var mainWindow = null;
electron_1.app.on('ready', function () {
    mainWindow = new electron_1.BrowserWindow({ show: false });
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.webContents.on('will-navigate', function (event) {
        event.preventDefault();
    });
    // Menu.setApplicationMenu(null);
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
    });
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
exports.getFileFromUser = exports.getFileFromUser = function () {
    var files = electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Markdown Files', extensions: ['md'] }
        ]
    });
    if (files) {
        exports.openFile(files[0]);
    } // A
};
exports.saveMarkdown = function (file, content) {
    if (!file) {
        file = electron_1.dialog.showSaveDialog(mainWindow, {
            title: 'Save Markdown',
            defaultPath: electron_1.app.getPath('desktop'),
            filters: [
                {
                    name: 'Markdown Files',
                    extensions: ['md']
                },
            ]
        });
    }
    if (!file)
        return;
    fs.writeFileSync(file, content);
};
exports.openFile = function (file) {
    var content = fs.readFileSync(file).toString();
    electron_1.app.addRecentDocument(file);
    mainWindow.webContents.send(constants_1.constants.fileOpen, file, content);
};
exports.saveHtml = function (content) {
    var file = electron_1.dialog.showSaveDialog(mainWindow, {
        title: 'Save HTML',
        defaultPath: electron_1.app.getPath('desktop'),
        filters: [
            { name: 'HTML Files', extensions: ['html'] }
        ]
    });
    if (!file)
        return;
    fs.writeFileSync(file, content);
};
