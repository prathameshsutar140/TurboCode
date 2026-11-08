/**
 * TurboCode IDE - Secure IPC Registration
 */

import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

export function registerIpcHandlers() {
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'C/C++ Source Files', extensions: ['c', 'cpp', 'cc', 'cxx', 'h', 'hpp'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || filePaths.length === 0) return null;
    const targetPath = filePaths[0];

    try {
      const content = fs.readFileSync(targetPath, 'utf-8');
      return {
        path: targetPath,
        name: path.basename(targetPath),
        content,
      };
    } catch (err) {
      throw new Error(`Failed to read file: ${err.message}`);
    }
  });

  ipcMain.handle('dialog:saveFile', async (_event, defaultName, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultName || 'main.c',
      filters: [
        { name: 'C/C++ Source Files', extensions: ['c', 'cpp', 'h', 'hpp'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });

    if (canceled || !filePath) return null;

    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return {
        path: filePath,
        name: path.basename(filePath),
      };
    } catch (err) {
      throw new Error(`Failed to save file: ${err.message}`);
    }
  });
}
