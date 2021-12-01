import { ShaderCodeUUID } from "./ShaderCodeUUID";
import { ShaderCodeObject } from "./ShaderCodeObject";

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

    private m_loadingTotal: number = 0;
    private m_shaderCodeObject: ShaderCodeObject = new ShaderCodeObject();
    private m_configure: ShaderCodeConfigure = null;
    constructor(configure: ShaderCodeConfigure) {
        this.m_configure = configure;
    }

    private loadCode(url: string, type: ShaderCodeType, loadedCallback: (uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject) => void): void {

        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = () => {

            if (request.status <= 206) {
                this.m_loadingTotal++;

                switch (type) {
                    case ShaderCodeType.VertHead:
                        this.m_shaderCodeObject.vert_head = request.responseText;
                        break;
                    case ShaderCodeType.VertBody:
                        this.m_shaderCodeObject.vert_body = request.responseText;
                        break;
                    case ShaderCodeType.FragHead:
                        this.m_shaderCodeObject.frag_head = request.responseText;
                        break;
                    case ShaderCodeType.FragBody:
                        this.m_shaderCodeObject.frag_body = request.responseText;
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
            else {
                console.error("loading shader code url error: ", url);
            }
        };
        request.onerror = e => {
            console.error("loading shader code url error: ", url);
        };

        request.send();
    }

    load(loadedCallback: (uuid: string, shaderCodeobject: ShaderCodeObject) => void): void {

        this.m_loadingTotal = 0;
        if (this.m_configure.urls == null) {
            for (let i: number = 0; i < this.m_configure.types.length; ++i) {
                let url: string = "static/shader/glsl" + this.m_configure.uuid + "/" + this.m_configure.types[i] + ".glsl";
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

class ShaderLib {

    private m_loadStatusMap: Map<ShaderCodeUUID, ShaderCodeObjectLoader> = new Map();
    private m_shaderCodeMap: Map<ShaderCodeUUID, ShaderCodeObject> = new Map();
    private m_configLib: ShaderCodeConfigureLib = null;

    constructor() { }

    initialize(configureData: any = null): void {

        if (this.m_configLib == null) {

            this.m_configLib = new ShaderCodeConfigureLib();
            let configure: ShaderCodeConfigure;

            if (configureData == null) {

                configure = new ShaderCodeConfigure();
                configure.uuid = ShaderCodeUUID.PBR;
                configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];

                this.m_configLib.addConfigureWithUUID(configure.uuid, configure);
            }
        }
    }
    addShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): void {
        if (!this.m_shaderCodeMap.has(uuid) && !this.m_loadStatusMap.has(uuid)) {
            let loader: ShaderCodeObjectLoader = new ShaderCodeObjectLoader(this.m_configLib.getConfigureWithUUID(uuid));
            loader.load((uuid: ShaderCodeUUID, shaderCodeobject: ShaderCodeObject):void=> {
                this.m_shaderCodeMap.set(uuid, shaderCodeobject);
            });
        }
    }
    getShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): ShaderCodeObject {
        let obj: ShaderCodeObject = null;
        if (!this.m_shaderCodeMap.has(uuid)) {
            obj = this.m_shaderCodeMap.get(uuid);
        }
        return obj;
    }
}
export { ShaderCodeType, ShaderLib };