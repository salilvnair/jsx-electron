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

    clientRequest(): Electron.ClientRequest {
        return this._electron.ClientRequest;
    }

    get(url, headers, partitionEnabled, partitionName) {
        var parser = document.createElement('a');
        parser.href = url;
        var protocol = parser.protocol;
        var hostname = parser.hostname;
        var path = parser.pathname;
        if (parser.search) {
            path = path + parser.search;
        }
        var requestApi = {
            method: "GET",
            headers: headers,
            protocol: protocol,
            hostname: hostname,
            path: path,
            partition: partitionEnabled ? partitionName : null
        };
        //console.log(requestApi);
        var net = this.electron.remote.net;
        //console.log(net);
        const clientRequest = net.request(requestApi);
        //console.log(clientRequest);
        clientRequest.on('response', function (response) {
          //console.log(`STATUS: ${response.statusCode}`)
          //console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
          response.on('data', (chunk) => {
            //console.log(`BODY: ${chunk}`)
          })
          response.on('end', () => {
            //console.log('No more data in response.')
          })
        });
        clientRequest.end();
    }

    save(url: string, fileName:string) {
      var remote = this.electron.remote;
      var dialog = remote.dialog;
      var app = remote.app;
      var path = remote.require('path');
      var toLocalPath = path.resolve(app.getPath("desktop"), fileName);
      var userChosenPath = dialog.showSaveDialogSync({ defaultPath: toLocalPath });
      if(userChosenPath){
          this.downloadFromUrl (url, userChosenPath, null)
      }
    }

    private downloadFromUrl(url:string, dest:string, cb:any) {
        var remote = this.electron.remote;
        var https = remote.require('https');
        var fs = remote.require('fs');
        var file = fs.createWriteStream(dest);
        var request = https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb); // close() is async, call cb after close completes.
            });
        }).on('error', function(err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    }
}