"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var marked = require('marked');
var electron_1 = require("electron");
var mainProcess = electron_1.remote.require('./main');
var currentWindow = electron_1.remote.getCurrentWindow();
var constants = require('./constants').constants;
var path = require("path");
var resize_1 = require("./resize");
var markdownView = document.querySelector('#markdown');
var htmlView = document.querySelector('#html');
var newFileButton = document.querySelector('#new-file');
var openFileButton = document.querySelector('#open-file');
var saveMarkdownButton = document.querySelector('#save-markdown');
var revertButton = document.querySelector('#revert');
var saveHtmlButton = document.querySelector('#save-html');
var showFileButton = document.querySelector('#show-file');
var openInDefaultButton = document.querySelector('#open-in-default');
var separator = document.getElementById("separator");
var filePath = null;
var originalContent = '';
var updateUserInterface = function (isEdited) {
    console.log('isEdited', isEdited);
    var title = 'Fire Sale';
    if (isEdited === true) {
        title += ' (Edited)';
    }
    if (filePath) {
        title = path.basename(filePath) + " - " + title;
        currentWindow.setRepresentedFilename(filePath);
    }
    currentWindow.setDocumentEdited(isEdited);
    showFileButton.disabled = !filePath;
    openInDefaultButton.disabled = !filePath;
    saveMarkdownButton.disabled = !isEdited;
    revertButton.disabled = !isEdited;
    currentWindow.setTitle(title);
};
var renderMarkdownToHtml = function (markdown) {
    htmlView.innerHTML = marked(markdown, { sanitize: true });
};
markdownView.addEventListener('keyup', function (event) {
    var currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
    updateUserInterface(currentContent !== originalContent);
});
openFileButton.addEventListener('click', function () {
    mainProcess.getFileFromUser();
});
var saveMarkdown = function () {
    updateUserInterface(false);
    mainProcess.saveMarkdown(filePath, markdownView.value);
};
saveMarkdownButton.addEventListener('click', function () {
    mainProcess.saveMarkdown(filePath, markdownView.value);
});
saveHtmlButton.addEventListener('click', function () {
    mainProcess.saveHtml(htmlView.innerHTML);
});
var saveHTML = function () {
    mainProcess.saveHtml(htmlView.innerHTML);
};
electron_1.ipcRenderer.on(constants.saveHTML, function () {
    saveHTML();
});
electron_1.ipcRenderer.on(constants.saveMarkdown, function () {
    saveMarkdown();
});
electron_1.ipcRenderer.on(constants.fileOpen, function (event, file, content) {
    filePath = file;
    originalContent = content;
    markdownView.value = content;
    renderMarkdownToHtml(content);
    updateUserInterface(false);
});
document.addEventListener('dragstart', function (event) { return event.preventDefault(); });
document.addEventListener('dragover', function (event) { return event.preventDefault(); });
document.addEventListener('dragleave', function (event) { return event.preventDefault(); });
document.addEventListener('drop', function (event) { return event.preventDefault(); });
var getDraggedFile = function (event) { return event.dataTransfer.items[0]; };
var getDroppedFile = function (event) { return event.dataTransfer.files[0]; };
var fileTypeIsSupported = function (file) {
    console.log(file);
    return ['text/md', 'text/markdown', 'text/*'].includes(file.type);
};
markdownView.addEventListener('dragover', function (event) {
    var file = getDraggedFile(event);
    markdownView.classList.add('drag-over');
});
markdownView.addEventListener('dragleave', function (event) {
    markdownView.classList.remove('drag-over');
    markdownView.classList.remove('drag-error');
});
markdownView.addEventListener('drop', function (event) {
    markdownView.classList.remove('drag-over');
    markdownView.classList.remove('drag-error');
    var file = getDroppedFile(event);
    if (true) {
        mainProcess.openFile(file.path);
    }
    else {
        markdownView.classList.add('drag-error');
    }
});
showFileButton.addEventListener('click', function () {
    if (!filePath) {
        return alert('nope!');
    }
    electron_1.shell.showItemInFolder(filePath);
});
openInDefaultButton.addEventListener('click', function () {
    electron_1.shell.openItem(filePath);
});
var newFile = function () {
    console.log('new file');
    originalContent = '';
    filePath = undefined;
    if (!filePath) {
        currentWindow.setTitle("Untitled");
        markdownView.value = '';
        htmlView.innerHTML = '';
    }
};
newFileButton.addEventListener('click', function () {
    newFile();
});
resize_1.default(separator, 'H');
