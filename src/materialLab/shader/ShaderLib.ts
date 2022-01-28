import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { IShaderLib } from "../../vox/material/IShaderLib";
import { ShaderCodeObject } from "./ShaderCodeObject";
import { ShaderCodeType } from "./ShaderCodeType";
import { ShaderCodeConfigure } from "./ShaderCodeConfigure";
import { IShaderLibConfigure } from "./IShaderLibConfigure";
import { FileIO } from "../../app/slickRoad/io/FileIO";
import { IShaderLibListener } from "./IShaderLibListener";

class ShaderCodeConfigureLib {

    private m_map: Map<ShaderCodeUUID, ShaderCodeConfigure> = new Map();
    private m_uuidList: ShaderCodeUUID[] = [];
    constructor() {
    }
    addConfigureWithUUID(uuid: ShaderCodeUUID, configure: ShaderCodeConfigure): void {
        if(uuid != "" && !this.m_map.has(uuid)) {
            this.m_map.set(uuid, configure);
            this.m_uuidList.push( uuid );
        }
    }
    getConfigureWithUUID(uuid: ShaderCodeUUID): ShaderCodeConfigure {
        return this.m_map.get(uuid);
    }
    getUUIDList(): ShaderCodeUUID[] {
        return this.m_uuidList;
    }
    getUUIDListLength(): number {
        return this.m_uuidList.length;
    }
}
class ShaderCodeObjectLoader {

    private static s_fileIO: FileIO = new FileIO();

    private m_loadingTotal: number = 0;
    private m_shaderCodeObject: ShaderCodeObject = new ShaderCodeObject();
    private m_configure: ShaderCodeConfigure = null;
    version: string = "";
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
        
        if(this.m_configure.buildBinaryFile && !this.m_configure.binary) {
            let u8arr: Uint8Array = this.encodeUint8Arr(code);
            for(let i: number = 0; i < u8arr.length; ++i) {
                u8arr[i] = 222 - u8arr[i];
            }
            ShaderCodeObjectLoader.s_fileIO.downloadBinFile(u8arr,type+"","bin");
        }
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
            let version = this.version != "" ? this.version + "/" : "";
            let suffix: string = this.m_configure.binary ? ".bin" : ".glsl";
            for (let i: number = 0; i < this.m_configure.types.length; ++i) {
                let url: string = "static/shader/" + version + "glsl/" + this.m_configure.uuid + "/" + this.m_configure.types[i] + suffix;
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

class ShaderLib implements IShaderLib{

    private m_loadingTotal: number = 0;
    private m_loadedTotal: number = 0;

    private m_loadStatusMap: Map<ShaderCodeUUID, ShaderCodeObjectLoader> = new Map();
    private m_shaderCodeMap: Map<ShaderCodeUUID, ShaderCodeObject> = new Map();
    private m_configLib: ShaderCodeConfigureLib = null;
    private m_listener: IShaderLibListener = null;
    private m_version: string = "";

    constructor() { }

    setListener(listener: IShaderLibListener): void {
        this.m_listener = listener;
    }
    getListener(): IShaderLibListener {
        return this.m_listener;
    }
    initialize(shaderLibConfigure: IShaderLibConfigure = null, binary: boolean = false): void {

        if (this.m_configLib == null) {

            this.m_configLib = new ShaderCodeConfigureLib();
            let configure: ShaderCodeConfigure;
            let list: ShaderCodeConfigure[] = null;
            if (shaderLibConfigure != null) {
                list = shaderLibConfigure.shaderCodeConfigures;
                this.m_version = shaderLibConfigure.version;
            }
            if(list != null) {
                for(let i: number = 0; i < list.length; ++i) {
                    configure = list[i];
                    if(configure != null) {
                        this.m_configLib.addConfigureWithUUID(configure.uuid, configure);
                    }
                }
            }
            else {
                configure = new ShaderCodeConfigure();
                configure.uuid = ShaderCodeUUID.PBR;
                configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
                configure.binary = binary;
                this.m_configLib.addConfigureWithUUID(configure.uuid, configure);
            }
        }
    }
    addAllShaderCodeObject(): void {
        if(this.m_configLib.getUUIDListLength() > 0) {
            let uuidList: ShaderCodeUUID[] = this.m_configLib.getUUIDList();
            for(let i: number = 0; i < uuidList.length; ++i) {
                this.addShaderCodeObjectWithUUID(uuidList[i]);
            }
        }
        else {
            if(this.m_listener != null) this.m_listener.shaderLibLoadComplete(0, 0);
        }
    }
    hasShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): boolean {
        return this.m_shaderCodeMap.has(uuid)
    }
    addShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): void {

        if (!this.m_shaderCodeMap.has(uuid) && !this.m_loadStatusMap.has(uuid)) {
            this.m_loadingTotal ++;
            let loader: ShaderCodeObjectLoader = new ShaderCodeObjectLoader(this.m_configLib.getConfigureWithUUID(uuid));
            loader.version = this.m_version;
            loader.load((uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject): void => {

                this.m_shaderCodeMap.set(uuid, shaderCodeobject);                
                this.m_loadedTotal ++;

                if(this.m_listener != null) this.m_listener.shaderLibLoadComplete(this.m_loadingTotal, this.m_loadedTotal);
            });
        }
    }
    addShaderCodeObject(uuid: ShaderCodeUUID, shaderCodeObject: ShaderCodeObject): void {

        if (shaderCodeObject != null && shaderCodeObject.uuid == (""+uuid) && !this.m_shaderCodeMap.has(uuid)) {
            this.m_shaderCodeMap.set(uuid, shaderCodeObject);
        }
    }
    getShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): ShaderCodeObject {

        let obj: ShaderCodeObject = null;
        if (this.m_shaderCodeMap.has(uuid)) {
            obj = this.m_shaderCodeMap.get(uuid);
        }
        return obj;
    }
    createShaderCodeConfigure(param: any): ShaderCodeConfigure {

        let configure: ShaderCodeConfigure;
        let baseUrl: string = "static/shader/" + (param.shaderLibVersion != "" ? param.shaderLibVersion + "/" : "");
        baseUrl += "glsl/";
        let uuid = ShaderCodeUUID.None;
        if (param.lambertMaterialEnabled) {
            uuid = ShaderCodeUUID.Lambert;
        }else if (param.pbrMaterialEnabled) {
            uuid = ShaderCodeUUID.PBR;
        }
        if(uuid != ShaderCodeUUID.None) {
            configure = new ShaderCodeConfigure();
            configure.uuid = uuid;
            configure.buildBinaryFile = param.buildBinaryFile;
            baseUrl += configure.uuid + "/";
            if (param.shaderCodeBinary) {
                if(param.shaderFileNickname) {
                    configure.urls = [
                        baseUrl + "glsl01.bin",
                        baseUrl + "glsl02.bin",
                        baseUrl + "glsl03.bin",
                        baseUrl + "glsl04.bin"
                    ];
                }
            }
            configure.binary = param.shaderCodeBinary;
        }
        return configure;

    }
}
export { ShaderCodeConfigure, IShaderLibConfigure, ShaderCodeType, IShaderLibListener, ShaderLib };