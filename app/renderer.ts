const marked = require('marked');
import { remote, ipcRenderer, shell } from 'electron';
const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const { constants } = require('./constants');
import * as path from 'path';
import resizeElement from './resize';
const markdownView: HTMLTextAreaElement = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton: HTMLButtonElement = document.querySelector('#save-markdown');
const revertButton: HTMLButtonElement = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton: HTMLButtonElement = document.querySelector('#show-file');
const openInDefaultButton: HTMLButtonElement = document.querySelector('#open-in-default');
const separator: HTMLElement = document.getElementById("separator");


let filePath:string = null;
let originalContent:string = '';

const updateUserInterface = (isEdited: boolean)=>{
  console.log('isEdited', isEdited);
  let title = 'Fire Sale';

  if (isEdited === true) {
    title+=' (Edited)';
  }
  if (filePath) {
    title = `${path.basename(filePath)} - ${title}`;
    currentWindow.setRepresentedFilename(filePath);
  }
  
  currentWindow.setDocumentEdited(isEdited);
  showFileButton.disabled = !filePath;
  openInDefaultButton.disabled = !filePath;

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;
  currentWindow.setTitle(title);
}

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

markdownView.addEventListener('keyup', event => {
  const currentContent = (event.target as HTMLTextAreaElement).value;
  renderMarkdownToHtml(currentContent);
  updateUserInterface(currentContent !== originalContent);
});

openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser();
  
});

const saveMarkdown = () => {
  updateUserInterface(false);
  mainProcess.saveMarkdown(filePath, markdownView.value);
};

saveMarkdownButton.addEventListener('click', ()=>{
  mainProcess.saveMarkdown(filePath, markdownView.value);
});

saveHtmlButton.addEventListener('click', ()=>{
  mainProcess.saveHtml(htmlView.innerHTML);
});

const saveHTML = () => {
  mainProcess.saveHtml(htmlView.innerHTML);
}

ipcRenderer.on(constants.saveHTML, ()=>{
  saveHTML();
})
ipcRenderer.on(constants.saveMarkdown, ()=>{
  saveMarkdown();
});

ipcRenderer.on(constants.fileOpen, (event, file, content) => {
  filePath = file;
  originalContent = content;
  markdownView.value = content;
  renderMarkdownToHtml(content);
  updateUserInterface(false);
});

document.addEventListener('dragstart', (event: DragEvent)=>event.preventDefault());
document.addEventListener('dragover', (event: DragEvent)=>event.preventDefault());
document.addEventListener('dragleave', (event: DragEvent)=>event.preventDefault());
document.addEventListener('drop', (event: DragEvent)=>event.preventDefault());

const getDraggedFile = (event: DragEvent) => event.dataTransfer.items[0];
const getDroppedFile = (event: DragEvent) => event.dataTransfer.files[0];
const fileTypeIsSupported = (file) => {
  console.log(file)
  return ['text/md', 'text/markdown', 'text/*'].includes(file.type);
};

markdownView.addEventListener('dragover',(event: DragEvent)=>{
  const file: DataTransferItem = getDraggedFile(event);
  markdownView.classList.add('drag-over');
});

markdownView.addEventListener('dragleave', (event: DragEvent) => {
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});

markdownView.addEventListener('drop', (event: DragEvent) => {
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
  const file: File = getDroppedFile(event);

  if (true) {
    mainProcess.openFile(file.path);
  } else {
    markdownView.classList.add('drag-error');
  }
});

showFileButton.addEventListener('click', ()=>{
  if (!filePath) {
    return alert('nope!');
  }
  shell.showItemInFolder(filePath);
});

openInDefaultButton.addEventListener('click', ()=>{
  shell.openItem(filePath);
});

const newFile = () => {
  console.log('new file');
  originalContent = '';
  filePath = undefined;
  if(!filePath) {
    currentWindow.setTitle(`Untitled`);
    markdownView.value= '';
    htmlView.innerHTML='';
  }
}

newFileButton.addEventListener('click', () => {
  newFile();
});

resizeElement(separator, 'H');