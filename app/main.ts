import * as fs from 'fs';
import { app, BrowserWindow, dialog, Menu, shell } from 'electron';
import { constants } from './constants';

let mainWindow: BrowserWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.webContents.on('will-navigate', event => {
    event.preventDefault();
  })
  // Menu.setApplicationMenu(null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

export const getFileFromUser  = exports.getFileFromUser   = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Markdown Files', extensions: ['md'] }
    ]
  });

  if (files) { openFile(files[0]); } // A
};

export const saveMarkdown = (file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(mainWindow, {
      title: 'Save Markdown',
      defaultPath: app.getPath('desktop'),
      filters: [
        {
          name:'Markdown Files', 
          extensions: ['md']
        },
      ]
    })
  }

  if (!file) return;
  fs.writeFileSync(file, content);
}

export const openFile = (file) => {
  const content = fs.readFileSync(file).toString();
  app.addRecentDocument(file);
  mainWindow.webContents.send(constants.fileOpen, file, content);
};

export const saveHtml = (content)=>{
  const file = dialog.showSaveDialog(mainWindow, {
    title:'Save HTML',
    defaultPath: app.getPath('desktop'),
    filters: [
      {name:'HTML Files', extensions:['html']}
    ]
  })

  if (!file) return;

  fs.writeFileSync(file, content);
}

