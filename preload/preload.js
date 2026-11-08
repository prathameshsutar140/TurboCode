/**
 * TurboCode IDE - Preload Script
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('turboElectron', {
  isDesktop: true,
  platform: process.platform,
  openNativeFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveNativeFile: (defaultName, content) =>
    ipcRenderer.invoke('dialog:saveFile', defaultName, content),
  onMenuAction: (callback) => {
    const handler = (_event, action) => callback(action);
    ipcRenderer.on('menu:action', handler);
    return () => {
      ipcRenderer.removeListener('menu:action', handler);
    };
  },
});
