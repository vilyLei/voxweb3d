

export class DemoRendererIsolate {

    private m_inited: boolean = true;
    private m_module: any = null;
    private m_loadFlag: boolean = true;
    private m_className: string = "";
    private m_noduleInsList: any[] = [];
    private m_moduleNameList: string[] = [
        "baseRenderer",
        "rfuncs",
        "player"
    ];
    
    private m_moduleClassNameList: string[] = [
        "BaseRenderer",
        "ROFunctions",
        "PlayerOne"
    ];
    private m_buttonInfoList: string[] = null;

    //private m_button = document.createElement('button');
    private m_button: any = null;
    constructor() { }
    
    private initLoadJS(module_ns:string): void {

        let pwindwo: any = window;

        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", "static/code/rendererIsolate/"+module_ns+".js", true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            //console.log("progress, e: ", e);
            //document.body.innerText = Math.round(100.0 * e.loaded / e.total) + "%";
            this.showInfo(" " + Math.round(100.0 * e.loaded / e.total) + "% ");
        };

        codeLoader.onload = () => {

            console.log("module file load success.....");
            let scriptEle: HTMLScriptElement = document.createElement("script");

            scriptEle.onerror = (e) => {
                console.log("module script onerror, e: ", e);
            }

            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            let pwindow: any = window;
            var VoxCore = pwindow.VoxCore;
            if(module_ns == "baseRenderer") {
                //console.log("pwindow.VoxCore: ", pwindow.VoxCore);
            }
            else if (VoxCore[this.m_className] != null) {
                console.log("module build success: ",module_ns);
                console.log("module class name: ",this.m_className);
                let noduleIns = new VoxCore[this.m_className]();
                console.log("module noduleIns: ",noduleIns);
                //noduleIns.initialize(VoxCore);
                this.m_noduleInsList.push(noduleIns);

                if(this.m_moduleNameList.length < 1) {

                    document.body.removeChild(this.m_div);
                    let mainModule = new VoxCore["BaseRenderer"]();
                    mainModule.initialize();
                    VoxCore["mainModule"] = mainModule;
                    this.m_module = mainModule;

                    for(let i: number = 0; i < this.m_noduleInsList.length; ++i) {
                        this.m_noduleInsList[i].initialize( VoxCore );
                    }
                }
            }
            
            this.m_loadFlag = true;

            if(this.m_button != null) {
                this.m_button.innerText = this.m_buttonInfoList.shift();
                document.body.appendChild( this.m_button );
            }
            else {
                this.loadNextModule();
            }
        }
        codeLoader.send(null);
    }
    initialize(): void {

        if ( this.m_inited ) {
            this.m_inited = false;

            console.log("DemoRendererIsolate::initialize()......navigator.language: ",navigator.language);
            if(navigator.language == "zh-CN") {

                this.m_buttonInfoList = [
                    "加载渲染器核心",
                    "加载基础功能 ",
                    "加载测试用例"
            ];
            }
            else {
                this.m_buttonInfoList = [
                        "load renderer core",
                        "load base functions",
                        "load test exmaple"
                ];
            }
            document.body.style.background = "#000000";

            if(this.m_button != null) {
                this.m_button.id = "button";
                this.m_button.innerText = this.m_buttonInfoList.shift();
                this.m_button.onclick = ()=> {
                    this.loadNextModule();
                    document.body.removeChild( this.m_button );
                }
                document.body.appendChild( this.m_button );
            }
            else {
                this.loadNextModule();
            }
        }
    }
    private m_div: any = null;
    private showInfo(str:string): void {
        if(this.m_div == null) {

            var div: HTMLDivElement = document.createElement('div');
            //div.style.color = "";
            var pdiv: any = div;
            this.m_div = pdiv;
            pdiv.width = 128;
            pdiv.height = 64;
            pdiv.style.backgroundColor = "#aa0033";
            pdiv.style.left = '10px';
            pdiv.style.top = '50px';
            pdiv.style.position = 'absolute';
            document.body.appendChild(this.m_div);
        }
        this.m_div.innerHTML = str;
    }
    private loadNextModule(): void {

        if(this.m_moduleNameList.length > 0 && this.m_loadFlag) {

            this.m_loadFlag = false;

            let module_ns: string = this.m_moduleNameList.shift();
            this.m_className = this.m_moduleClassNameList.shift();

            console.log("start load module name: ", module_ns);
            console.log("start load class name: ", this.m_className);

            this.initLoadJS( module_ns );
        }
    }

    run(): void {

        if(this.m_module != null) {
            if(this.m_noduleInsList.length > 1) {

                for(let i: number = 0; i < this.m_noduleInsList.length; ++i) {
                    this.m_noduleInsList[i].run();
                }
                this.m_module.run();
            }
        }
    }
}
export default DemoRendererIsolate;