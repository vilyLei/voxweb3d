import IRenderMaterial from "../vox/render/IRenderMaterial";
import IRendererScene from "../vox/scene/IRendererScene";
import { IShadowVSMModule } from "../shadow/vsm/base/IShadowVSMModule";

var VoxApp: any;
var VoxAppBase: any;
var Module: any = window;
function getSysModule(ns: string): any {
    return Module[ns];
}
function main(appIns: any): void {
    appIns.initialize();
    function mainLoop(now: any) {
        appIns.run();
        window.requestAnimationFrame(mainLoop);
    }
    window.requestAnimationFrame(mainLoop);
}

class AppShell {

    private m_loadedTotal: number = 0;
    private m_loadedFlags: number[] = [0, 0, 0, 0, 0, 0];
    private m_voxAppIns: any = null;
    private m_voxAppBaseIns: any = null;
    private m_rscene: IRendererScene;
    private m_shadow: IShadowVSMModule;
    constructor() { }

    loadedWithIndex(index: number): void {
        this.m_loadedTotal++;
        let list = this.m_loadedFlags;
        list[index] = 1;
        // if(this.m_loadedTotal >= 2) {
        if (list[0] > 0 && list[0] == list[1]) {
            console.log("loaded all engine sys module.");
            this.initialize();
        }
    }
    initialize(): void {
        if (this.m_voxAppIns == null) {

            VoxApp = getSysModule("VoxAppInstance");
            VoxAppBase = getSysModule("VoxAppBase");
            // console.log("AppShell::initialize()..., VoxApp: ", VoxApp);
            // console.log("AppShell::initialize()..., VoxAppBase: ", VoxAppBase);

            let voxAppIns = new VoxApp();
            let voxAppBaseIns = new VoxAppBase();
            this.m_voxAppIns = voxAppIns;
            this.m_voxAppBaseIns = voxAppBaseIns;
            voxAppIns.initialize();
            console.log("AppShell::initialize()..., voxAppIns: ", voxAppIns);
            console.log("AppShell::initialize()..., voxAppBaseIns: ", voxAppBaseIns);
            this.m_rscene = voxAppIns.getRendererScene() as IRendererScene;
            voxAppBaseIns.initialize(this.m_rscene);

            main(voxAppIns);
            this.initScene(voxAppIns);
        }
    }

    private initScene(appIns: any): void {

        console.log("AppShell::initScene()..., appIns: ", appIns);
        let rscene = this.m_rscene;
        let material = this.m_voxAppBaseIns.createDefaultMaterial() as IRenderMaterial;
        material.setTextureList([this.m_voxAppIns.getImageTexByUrl("static/assets/color_01.jpg")]);
        material.initializeByCodeBuf(true);

        let scale: number = 100.0
        let entity = rscene.entityBlock.createEntity();
        entity.setMaterial(material);
        entity.copyMeshFrom(rscene.entityBlock.unitBox);
        entity.setScaleXYZ(scale, scale, scale);
        rscene.addEntity( entity, 0, true );

        // let axis = new VoxApp.Axis3DEntity();
        // axis.initialize(30);
        // axis.setXYZ(300, 0.0, 0.0);
        // appIns.addEntity(axis);

        // let box = new VoxApp.Box3DEntity();
        // box.initializeCube(100.0, [appIns.getImageTexByUrl("./assets/default.jpg")]);
        // appIns.addEntity(box);
    }
}
export class AppLoader {

    private m_appShell: AppShell = new AppShell();
    constructor() { }

    initialize(): void {
        console.log("AppLoader::initialize()......");
        let url: string = location.href + "";
        console.log("A url: ", url);
        url = this.parseUrl(url);
        console.log("B url: ", url);
        //url = "http://localhost:9000/publish/build/VoxApp.package.js";
        // url = "../build/VoxAppEngine.package.js";
        url = "http://localhost:9000/publish/build/VoxApp.engine.js";
        // url = "../build/VoxApp.engine.js.js";
        this.initUI();
        // this.load( url );

        let engine_url = "http://localhost:9000/publish/build/VoxApp.engine.js";
        let base_url = "http://localhost:9000/publish/build/VoxApp.base.js";
        let engineLoader = new ModuleLoader(0, engine_url, this);
        let baseLoader = new ModuleLoader(1, base_url, this);
    }
    /*
    private load(purl: string): void {
        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            this.showLoadInfo(e);
        };
        codeLoader.onload = () => {
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (e) => {
                console.error("module script onerror, e: ", e);
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            this.loadFinish();
            this.initApp();
        }
        codeLoader.send(null);
    }
    //*/
    private initApp(): void {

        let shell = new AppShell();
        shell.initialize();
    }
    private showLoadInfo(e: any, index: number = 0): void {
        if (index == 0) {
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
        /*
        let params: string[] = url.split("?");
        if(params.length < 2 || params[0].indexOf("renderCase") < 1) {
            return "";
        }
        //renderCase?sample=cameraFollow2
        let moduleName: string = params[1];
        params = moduleName.split("=");
        if(params.length < 2 || params[0] != "sample") {
            return "";
        }
        return "static/voxweb3d/demos/"+params[1]+".js";
        //*/
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
        if (index == 0) {
            if (this.m_bodyDiv != null) {
                this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
                this.m_bodyDiv = null;
            }
        }
        console.log("loadFinish(), index: ", index);
        this.m_appShell.loadedWithIndex(index);
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