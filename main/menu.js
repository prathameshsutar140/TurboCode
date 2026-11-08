/**
 * TurboCode IDE - Desktop Menu Configuration
 */

import { Menu } from 'electron';

export function setupApplicationMenu(mainWindow) {
  const template = [
    {
      label: '&File',
      submenu: [
        {
          label: 'New &Source File',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:action', 'file-new'),
        },
        {
          label: '&Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu:action', 'file-open'),
        },
        { type: 'separator' },
        {
          label: '&Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu:action', 'file-save'),
        },
        {
          label: 'Save &As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow.webContents.send('menu:action', 'file-save-as'),
        },
        {
          label: '&Close Tab',
          accelerator: 'CmdOrCtrl+W',
          click: () => mainWindow.webContents.send('menu:action', 'file-close'),
        },
        { type: 'separator' },
        { role: 'quit', label: 'E&xit TurboCode' },
      ],
    },
    {
      label: '&Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: '&Run',
      submenu: [
        {
          label: '&Compile',
          accelerator: 'F2',
          click: () => mainWindow.webContents.send('menu:action', 'run-compile'),
        },
        {
          label: '&Run Program',
          accelerator: 'F5',
          click: () => mainWindow.webContents.send('menu:action', 'run-execute'),
        },
        {
          label: 'Compile &and Run',
          accelerator: 'F6',
          click: () => mainWindow.webContents.send('menu:action', 'run-compile-and-run'),
        },
        {
          label: '&Stop Execution',
          accelerator: 'Shift+F5',
          click: () => mainWindow.webContents.send('menu:action', 'run-stop'),
        },
        { type: 'separator' },
        {
          label: 'Clear &Output Console',
          click: () => mainWindow.webContents.send('menu:action', 'run-clear-output'),
        },
      ],
    },
    {
      label: '&Options',
      submenu: [
        {
          label: 'Switch to Classic &Turbo C++ Theme',
          click: () => mainWindow.webContents.send('menu:action', 'theme-classic'),
        },
        {
          label: 'Switch to Modern &Dark Theme',
          click: () => mainWindow.webContents.send('menu:action', 'theme-modern-dark'),
        },
        {
          label: 'Switch to Modern &Light Theme',
          click: () => mainWindow.webContents.send('menu:action', 'theme-modern-light'),
        },
        { type: 'separator' },
        {
          label: '&Compiler Settings...',
          click: () => mainWindow.webContents.send('menu:action', 'open-settings'),
        },
      ],
    },
    {
      label: '&Help',
      submenu: [
        {
          label: '&Keyboard Shortcuts',
          click: () => mainWindow.webContents.send('menu:action', 'open-shortcuts'),
        },
        {
          label: 'C/C++ Example &Programs',
          click: () => mainWindow.webContents.send('menu:action', 'open-examples'),
        },
        { type: 'separator' },
        {
          label: '&About TurboCode IDE',
          click: () => mainWindow.webContents.send('menu:action', 'open-about'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
