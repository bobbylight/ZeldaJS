import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

const devMode: boolean = process.env.NODE_ENV !== 'production';

// Global reference to the window, necessary to prevent garbage collection
let mainWindow: BrowserWindow | null;

const createMenu: () => Menu = () => {

    return Menu.buildFromTemplate([

        {
            label: 'File',
            submenu: [
                { type: 'separator' },
                { role: 'quit' }
            ]
        },

        {
            role: 'window',
            submenu: [
                {
                    label: 'Stretch',
                    submenu: [
                        { label: 'Fill' },
                        { label: 'Stretch' },
                        { label: 'Proportional' }
                    ]
                }
            ]
        }
    ]);
};

const createMainWindow: () => BrowserWindow = () => {

    const window: BrowserWindow = new BrowserWindow({
        autoHideMenuBar: true,
        icon: '../res/originals/desktop_icon_gxi_icon.ico'
    });

    if (devMode) {
        window.webContents.openDevTools();
    }

    window.loadURL(formatUrl({
        pathname: path.join(__dirname, 'desktop-index.html'),
        protocol: 'file',
        slashes: true
    }));

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
};

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();
    Menu.setApplicationMenu(createMenu());
});
