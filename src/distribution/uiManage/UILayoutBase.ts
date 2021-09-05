import RendererScene from "../../vox/scene/RendererScene";
import RendererSubScene from "../../vox/scene/RendererSubScene";
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import RendererDevice from "../../vox/render/RendererDevice";

interface IUILayoutModule {
    run(): boolean;
}
class UILayoutBase {

    private static s_ins: UILayoutBase = null;
    private m_rsc: RendererScene;
    private m_ruisc: RendererSubScene;
    private m_texLoader: ImageTextureLoader = null;
    private m_modules: IUILayoutModule[] = [];
    private m_entities: DisplayEntity[] = [];
    private m_isRunning: boolean = true;
    constructor() {

        if (UILayoutBase.s_ins == null) {
            UILayoutBase.s_ins = this;
        }
        else {
            throw Error("UILayoutBase is a singleton class.");
        }
    }
    static GetInstance(): UILayoutBase {

        if (UILayoutBase.s_ins != null) {
            return UILayoutBase.s_ins;
        }
        return new UILayoutBase();
    }
    initialize(rsc: RendererScene, ruisc: RendererSubScene, texLoader: ImageTextureLoader): void {
        if (this.m_rsc == null) {
            this.m_rsc = rsc;
            this.m_ruisc = ruisc;
            this.m_texLoader = texLoader;
            console.log("UILayoutBase::initialize()...");
        }
    }
    getUIScene(): RendererSubScene {
        return this.m_ruisc;
    }
    getLanguage(): string {
        return RendererDevice.GetLanguage();
    }
    isMobileWeb(): boolean {
        return RendererDevice.IsMobileWeb();
    }
    isWebGL1(): boolean {
        return RendererDevice.IsWebGL1();
    }
    isWebGL2(): boolean {
        return RendererDevice.IsWebGL2();
    }
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }

    getEntities(): DisplayEntity[] {

        return this.m_entities;
    }

    saveEntity(entity: DisplayEntity): void {
        this.m_entities.push(entity);
    }
    addToScene(entity: DisplayEntity, i: number = 0): void {

        let p: any = entity;
        if (p.__$rseFlag != null) {
            this.m_rsc.addEntity(entity, i, true);
        }
        else {
            let container: any = entity;
            this.m_rsc.addContainer(container, i);
        }
    }

    addToUIScene(entity: DisplayEntity, i: number = 0): void {

        let p: any = entity;
        if (p.__$rseFlag != null) {
            this.m_ruisc.addEntity(entity, i, true);
        }
        else {
            let container: any = entity;
            this.m_ruisc.addContainer(container, i);
        }

    }

    showInfo(): void {

        console.log("UILayoutBase::showInfo()...");
    }

    addModule(pmodule: IUILayoutModule): void {
        if (pmodule != null) {
            this.m_modules.push(pmodule);
        }
    }

    play(): void {
        this.m_isRunning = true;
    }
    pause(): void {

        this.m_isRunning = false;
    }
    run(): void {
        if(this.m_isRunning) {
            for (let i: number = 0; i < this.m_modules.length; i++) {
                this.m_modules[i].run();
            }
        }
    }
}
export { UILayoutBase };