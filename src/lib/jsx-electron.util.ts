import * as Electron from 'electron';
import { ElectronWindow } from "./electron-window";

declare let window: ElectronWindow;

export class JsxElectronUtil {
    private _electron: any;

    constructor() {}

    private get electron() {
        if (!this._electron) {
            this._electron = window.require('electron');
            return this._electron;
        }
        return this._electron;
    }

    isElectronApp(): boolean {
        return !!window.navigator.userAgent.match(/Electron/);
    }

    isMac(): boolean {
        return this.isElectronApp && this.process.platform === 'darwin';
    }

    isWindows(): boolean {
        return this.isElectronApp && this.process.platform === 'win32';
    }

    isLinux(): boolean {
        return this.isElectronApp && this.process.platform === 'linux';
    }

    isX86(): boolean {
        return this.isElectronApp && this.process.arch === 'ia32';
    }

    isX64(): boolean {
        return this.isElectronApp && this.process.arch === 'x64';
    }

    desktopCapturer(): Electron.DesktopCapturer {
        return this.electron ? this.electron.desktopCapturer : null;
    }

    ipcRenderer(): Electron.IpcRenderer {
        return this.electron ? this.electron.ipcRenderer : null;
    }

    get remote(): Electron.Remote {
        return this.electron ? this.electron.remote : null;
    }

    webFrame(): Electron.WebFrame {
        return this.electron ? this.electron.webFrame : null;
    }

    clipboard(): Electron.Clipboard {
        return this.electron ? this.electron.clipboard : null;
    }

    crashReporter(): Electron.CrashReporter {
        return this.electron ? this.electron.crashReporter : null;
    }

    get process(): any {
        return this.remote ? this.remote.process : null;
    }

    nativeImage(): typeof Electron.nativeImage {
        return this.electron ? this.electron.nativeImage : null;
    }

    screen(): Electron.Screen {
        return this.electron ? this.electron.screen : null;
    }

    shell(): Electron.Shell {
        return this.electron ? this.electron.shell : null;
    }

    restart() {
        this.remote.app.relaunch();
        this.remote.app.exit(0);
    }
  
    reload() {
        this.remote.webContents.getFocusedWebContents().reload();
    }

    env() {
        return this.process.env;
    }

    localAppDataPath() {
        let localAppDataPath = this.remote.process.platform == 'darwin' ? this.remote.process.env.HOME+ '/Library/Application Support':this.env().LOCALAPPDATA;
        return localAppDataPath;
    }
  
    appDataPath() {
        let appDataPath = this.remote.process.platform == 'darwin' ? this.remote.process.platform.env.HOME+ '/Library/Application Support':this.env().APPDATA;
        return appDataPath;
    }

    appPath() {
        let appPath = this.env().PWD;
        if(!appPath) {
            appPath = this.remote.app.getAppPath();
        }
        return appPath;
    }
}