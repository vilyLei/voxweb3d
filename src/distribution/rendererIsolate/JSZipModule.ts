

import JSZip from "jszip";

class JSZipModule {
    private m_jszip: JSZip;
    constructor() { }

    initialize(pmodule: any): void {
        console.log("JSZipModule::initialize()......");
        if(this.m_jszip != null) {
            this.m_jszip = new JSZip();
        }
    }
    createModule(): JSZip {
        return new JSZip();
    }
    run(): void {
    }
    getModuleName():string {
        return "jsZipModule";
    }
    getModuleClassName():string {
        return "JSZipModule";
    }
    getRuntimeType():string {
        return "system_module";
    }
}

export {JSZipModule};