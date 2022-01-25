
import ModuleFlag from "./publish/base/ModuleFlag";
import LightViewer from "./publish/lightViewer/LightViewer";

let host = "static/publish/build/";

class AppShell {
    private m_viewer: LightViewer = new LightViewer();
    constructor() { }

    loadedWithIndex(index: number): void {
        this.m_viewer.setLoadedModuleFlag(index);
    }
}
export class AppLoader {

    private m_appShell: AppShell = new AppShell();
    private m_mf: ModuleFlag = new ModuleFlag();
    private m_initOther: boolean = true;
    constructor() { }

    initialize(): void {
        console.log("AppLoader::initialize()......");
        let url: string = location.href + "";
        console.log("A url: ", url);
        url = this.parseUrl(url);
        console.log("B url: ", url);
        this.initUI();

        ModuleFlag.Initialize();
        // this.load( url );
        this.loadEngine();
    }
    private loadEngine(): void {
        

        let objData_url = host + "AppObjData.package.js";
        let loader = new ModuleLoader(ModuleFlag.AppObjData, objData_url, this);

        
        let engine_url = host + "AppEngine.package.js";
        let base_url = host + "AppBase.package.js";
        loader = new ModuleLoader(ModuleFlag.AppEngine, engine_url, this);
        loader = new ModuleLoader(ModuleFlag.AppBase, base_url, this);
        
    }
    
    private loadAppFunctions(): void {

        let envLightModule_url = host + "AppEnvLightModule.package.js";
        let LightModule_url = host + "AppLightModule.package.js";
        let shadow_url = host + "AppShadow.package.js";
        let loader = new ModuleLoader(ModuleFlag.AppEnvLight, envLightModule_url, this);
        loader = new ModuleLoader(ModuleFlag.AppLight, LightModule_url, this);
        loader = new ModuleLoader(ModuleFlag.AppShadow, shadow_url, this);

        let lambert_url = host + "AppLambert.package.js";
        loader = new ModuleLoader(ModuleFlag.AppLambert, lambert_url, this);

        // let pbr_url = host + "AppPBR.package.js";
        // loader = new ModuleLoader(ModuleFlag.AppPBR, pbr_url, this);
    }
    private showLoadInfo(e: any, index: number = 0): void {
        if (index == ModuleFlag.AppEngine) {
            this.showLoadProgressInfo(e);
        }
    }
    private parseUrl(url: string): string {

        console.log("url: ", url);
        //http://192.168.0.102:9000/renderCase?sample=demoLoader&demo=cameraFollow2
        let params: string[] = url.split("?");
        if (params.length < 2 || params[0].indexOf("renderCase") < 1) {
            return "";
        }
        let moduleName: string = params[1];
        params = moduleName.split("&");
        if (params.length < 2 || params[0].indexOf("sample") < 0) {
            return "";
        }
        moduleName = params[1];
        params = moduleName.split("=");
        if (params.length < 2 || params[0] != "demo") {
            return "";
        }
        return "static/voxweb3d/demos/" + params[1] + ".js";
    }

    private m_bodyDiv: HTMLDivElement = null;
    private m_infoDiv: HTMLDivElement = null;
    private initUI(): void {
        document.body.style.background = "#000000";
        this.m_bodyDiv = document.createElement('div');
        this.m_bodyDiv.style.width = "100vw";
        this.m_bodyDiv.style.height = "100vh";
        this.elementCenter(this.m_bodyDiv);
        document.body.appendChild(this.m_bodyDiv);
        document.body.style.margin = '0';

        this.showInfo("init...");
    }

    private showInfo(str: string): void {

        if (this.m_infoDiv == null) {
            this.m_infoDiv = document.createElement('div');
            this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
            this.m_infoDiv.style.color = "#00ee00";
            this.elementCenter(this.m_infoDiv);
            this.m_bodyDiv.appendChild(this.m_infoDiv);
        }
        this.m_infoDiv.innerHTML = str;
    }
    showLoadProgressInfo(e: any): void {
        let str: string = "loading " + Math.round(100.0 * e.loaded / e.total) + "% ";
        this.showInfo(str);
    }

    showLoadStart(): void {
        this.showInfo("loading 0%");
    }
    showLoaded(): void {
        this.showInfo("100%");
    }
    loadFinish(index: number = 0): void {
        if (index == ModuleFlag.AppEngine) {
            if (this.m_bodyDiv != null) {
                this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
                this.m_bodyDiv = null;
            }
        }
        console.log("loadFinish(), index: ", index);
        this.m_appShell.loadedWithIndex(index);
        this.m_mf.addFlag(index);
        if(this.m_initOther && this.m_mf.hasEngineModule()) {
            this.m_initOther = false;
            this.loadAppFunctions();
        }
    }
    private elementCenter(ele: HTMLElement, top: string = "50%", left: string = "50%", position: string = "absolute"): void {
        
        ele.style.textAlign = "center";
        ele.style.display = "flex";
        ele.style.flexDirection = "column";
        ele.style.justifyContent = "center";
        ele.style.alignItems = "center";
        // ele.style.top = top;
        // ele.style.left = left;
        // ele.style.position = position;
        // ele.style.transform = "translate(-50%, -50%)";
    }
}
class ModuleLoader {

    index: number = 0;
    constructor(index: number, purl: string, listener: any) {
        this.index = index;
        this.load(purl, listener);
    }
    load(purl: string, listener: any): void {

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            if (listener != null) listener.showLoadInfo(e, this.index);
        };
        codeLoader.onload = () => {
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (e) => {
                console.error("module script onerror, e: ", e);
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            if (listener != null) listener.loadFinish(this.index);
            //this.initApp();
        }
        codeLoader.send(null);
    }
}
export default AppLoader;