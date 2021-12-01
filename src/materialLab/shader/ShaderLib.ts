import { ShaderCodeObject } from "./ShaderCodeObject";

class ShaderCodeObjectLoader {

    private m_loadingTotal: number = 4;
    constructor(loadingTotal: number) {
        this.m_loadingTotal = loadingTotal;
    }
    
    private load(url: string, type: string, loadedCallback: (url: string, type: string) => void): void {
        let request: XMLHttpRequest = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = () => {
                if (request.status <= 206) {
                    
                }
                else {
                    console.error("loading shader code url error: ", url);
                }
            };
            request.onerror = e => {
                console.error("loading shader code url error: ", url);
            };

            request.send();
    }
    loadWithUUID(uuid: string, loadedCallback: (uuid: string, shaderCodeobject: ShaderCodeObject) => void): void {
        
    }
}

class ShaderLib {
    private m_loadStatusMap: Map<string, number> = new Map();
    private m_shaderCodeMap: Map<string, ShaderCodeObject> = new Map();
    constructor() { }

    addShaderCodeObjectWithUUID(uuid: string): void {
        if (uuid != "" && !this.m_shaderCodeMap.has(uuid) && !this.m_loadStatusMap.has(uuid)) {

        }
    }
    getShaderCodeObjectWithUUID(uuid: string): ShaderCodeObject {
        let obj: ShaderCodeObject = null;
        if (uuid != "" && !this.m_shaderCodeMap.has(uuid)) {
            obj = this.m_shaderCodeMap.get(uuid);
        }
        return obj;
    }
    private loadedShaderCodeObject(uuid: string): void {

    }
}
export { ShaderLib };