
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { IShaderLib } from "../../vox/material/IShaderLib";
import { ShaderCodeObject } from "./ShaderCodeObject";
import { FileIO } from "../../app/slickRoad/io/FileIO";

enum ShaderCodeType {
    VertHead = "vertHead",
    VertBody = "vertBody",
    FragHead = "fragHead",
    FragBody = "fragBody"
}

class ShaderCodeConfigure {

    types: ShaderCodeType[] = null;
    urls: string[] = null;
    uuid: ShaderCodeUUID = ShaderCodeUUID.Default;
    binary: boolean = false;
    constructor() {
    }
}

class ShaderCodeConfigureLib {

    private m_map: Map<ShaderCodeUUID, ShaderCodeConfigure> = new Map();
    constructor() {
    }
    addConfigureWithUUID(uuid: ShaderCodeUUID, configure: ShaderCodeConfigure): void {
        this.m_map.set(uuid, configure);
    }
    getConfigureWithUUID(uuid: ShaderCodeUUID): ShaderCodeConfigure {
        return this.m_map.get(uuid);
    }
}
class ShaderCodeObjectLoader {

    private static s_fileIO: FileIO = new FileIO();

    private m_loadingTotal: number = 0;
    private m_shaderCodeObject: ShaderCodeObject = new ShaderCodeObject();
    private m_configure: ShaderCodeConfigure = null;
    constructor(configure: ShaderCodeConfigure) {
        this.m_configure = configure;
    }

    private decodeUint8Arr(u8array: Uint8Array): string{
        return new TextDecoder("utf-8").decode(u8array);
    }
    private encodeUint8Arr(code: string): Uint8Array{
        return new TextEncoder().encode(code);
    }
    private loadedShdCode(code: string, type: ShaderCodeType, loadedCallback: (uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject) => void): void {

        this.m_loadingTotal++;
        //let code: string;
        // if(this.m_configure.binary) {

        //     code = request.responseText;
        //     //code = this.decodeUint8Arr(u8arr);
        // }
        // else {
        //     code = request.responseText;
        //     // let u8arr: Uint8Array = this.encodeUint8Arr(code);
        //     // for(let i: number = 0; i < u8arr.length; ++i) {
        //     //     u8arr[i] = 222 - u8arr[i];
        //     // }
        //     // ShaderCodeObjectLoader.s_fileIO.downloadBinFile(u8arr,type+"","bin");
        // }
        switch (type) {
            case ShaderCodeType.VertHead:
                this.m_shaderCodeObject.vert_head = code;
                break;
            case ShaderCodeType.VertBody:
                this.m_shaderCodeObject.vert_body = code;
                break;
            case ShaderCodeType.FragHead:
                this.m_shaderCodeObject.frag_head = code;
                break;
            case ShaderCodeType.FragBody:
                this.m_shaderCodeObject.frag_body = code;
                break;
            default:
                console.error("loaded error shader code data.");
                break;
        }
        if (this.m_loadingTotal == this.m_configure.types.length) {

            loadedCallback(this.m_configure.uuid, this.m_shaderCodeObject);

            this.m_shaderCodeObject = null;
            this.m_configure = null;
        }
    }
    
    async loadBinCode(url: string, type: ShaderCodeType, loadedCallback: (uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject) => void) {
        const reader = new FileReader();
        reader.onload = e => {
            //target.loaded(<ArrayBuffer>reader.result, this.uuid);
            let u8arr: Uint8Array = new Uint8Array( <ArrayBuffer>reader.result );
            for(let i: number = 0; i < u8arr.length; ++i) {
                u8arr[i] = 222 - u8arr[i];
            }
            this.loadedShdCode(this.decodeUint8Arr(u8arr), type, loadedCallback);
        };
        
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "blob";
        request.onload = (e) => {
            if (request.status <= 206) {
                reader.readAsArrayBuffer(request.response);
            }
            else {
                console.error("loading binary shader code url error: ", url);
            }
        };
        request.onerror = e => {
            console.error("loading binary shader code url error: ", url);
        };
        request.send();
    }
    
    private loadTextCode(url: string, type: ShaderCodeType, loadedCallback: (uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject) => void): void {

        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = () => {

            if (request.status <= 206) {
                this.loadedShdCode(request.responseText, type, loadedCallback);
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
    private loadCode(url: string, type: ShaderCodeType, loadedCallback: (uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject) => void): void {
        
        if(this.m_configure.binary) {
            this.loadBinCode(url, type, loadedCallback);
        }
        else {
            this.loadTextCode(url, type, loadedCallback);
        }
    }

    load(loadedCallback: (uuid: string, shaderCodeobject: ShaderCodeObject) => void): void {

        this.m_loadingTotal = 0;
        if (this.m_configure.urls == null) {
            let suffix: string = this.m_configure.binary ? ".bin" : ".glsl";
            for (let i: number = 0; i < this.m_configure.types.length; ++i) {
                let url: string = "static/shader/glsl/" + this.m_configure.uuid + "/" + this.m_configure.types[i] + suffix;
                this.loadCode(url, this.m_configure.types[i], loadedCallback);
            }
        } else {
            for (let i: number = 0; i < this.m_configure.urls.length; ++i) {
                let url: string = this.m_configure.urls[i];
                this.loadCode(url, this.m_configure.types[i], loadedCallback);
            }
        }
    }
}
interface IShaderLibListener {
    loadedShaderCode(loadingTotal: number, loadedTotal: number): void;
}

class ShaderLib implements IShaderLib{

    private m_loadingTotal: number = 0;
    private m_loadedTotal: number = 0;

    private m_loadStatusMap: Map<ShaderCodeUUID, ShaderCodeObjectLoader> = new Map();
    private m_shaderCodeMap: Map<ShaderCodeUUID, ShaderCodeObject> = new Map();
    private m_configLib: ShaderCodeConfigureLib = null;
    private m_listener: IShaderLibListener = null;

    constructor() { }

    setListener(listener: IShaderLibListener): void {
        this.m_listener = listener;
    }
    initialize(configureData: any = null, binary: boolean = false): void {

        if (this.m_configLib == null) {

            this.m_configLib = new ShaderCodeConfigureLib();
            let configure: ShaderCodeConfigure;

            if (configureData == null) {

                configure = new ShaderCodeConfigure();
                configure.uuid = ShaderCodeUUID.PBR;
                configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
                configure.binary = binary;
                this.m_configLib.addConfigureWithUUID(configure.uuid, configure);
            }
        }
    }
    addAllShaderCodeObject(): void {
        this.addShaderCodeObjectWithUUID(ShaderCodeUUID.PBR);
    }
    addShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): void {

        if (!this.m_shaderCodeMap.has(uuid) && !this.m_loadStatusMap.has(uuid)) {
            this.m_loadingTotal ++;
            let loader: ShaderCodeObjectLoader = new ShaderCodeObjectLoader(this.m_configLib.getConfigureWithUUID(uuid));
            loader.load((uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject): void => {

                this.m_shaderCodeMap.set(uuid, shaderCodeobject);                
                this.m_loadedTotal ++;

                if(this.m_listener != null) this.m_listener.loadedShaderCode(this.m_loadingTotal, this.m_loadedTotal);
            });
        }
    }
    getShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): ShaderCodeObject {

        let obj: ShaderCodeObject = null;
        if (this.m_shaderCodeMap.has(uuid)) {
            obj = this.m_shaderCodeMap.get(uuid);
        }
        return obj;
    }
}
export { ShaderCodeType, IShaderLibListener, ShaderLib };