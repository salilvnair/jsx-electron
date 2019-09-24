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

    get desktopCapturer(): Electron.DesktopCapturer {
        return this.electron ? this.electron.desktopCapturer : null;
    }

    get ipcRenderer(): Electron.IpcRenderer {
        return this.electron ? this.electron.ipcRenderer : null;
    }

    get remote(): Electron.Remote {
        return this.electron ? this.electron.remote : null;
    }

    get webFrame(): Electron.WebFrame {
        return this.electron ? this.electron.webFrame : null;
    }

    get clipboard(): Electron.Clipboard {
        return this.electron ? this.electron.clipboard : null;
    }

    get crashReporter(): Electron.CrashReporter {
        return this.electron ? this.electron.crashReporter : null;
    }

    get process(): any {
        return this.remote ? this.remote.process : null;
    }

    get nativeImage(): typeof Electron.nativeImage {
        return this.electron ? this.electron.nativeImage : null;
    }

    get screen(): Electron.Screen {
        return this.electron ? this.electron.screen : null;
    }

    get shell(): Electron.Shell {
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

    os() {
        return this.process.platform;
    }

    pwd() {
        if(this.os()==='win32'){
            return this.env().INIT_CWD
        }
        return this.env().PWD
    }

    npmVersion() {
        let jsonFile = this.remote.require('jsonfile');
        let path = this.remote.require('path');
        let packageJsonPath = path.resolve(this.appPath(),"package.json");
        let packageJson = jsonFile.readFileSync(packageJsonPath);
        return packageJson.version;
    }
  
}