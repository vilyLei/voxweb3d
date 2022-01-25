
import RendererParam from "../../../vox/scene/RendererParam";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IAppEngine {

    // getImageTexByUrl(purl: string, wrapRepeat?: boolean, mipmapEnabled?: boolean): IRenderTexture;
    setSyncLookEnabled(enabled: boolean): void;
    addEntity(entity: IRenderEntity, processIndex?: number): void;
    removeEntity(entity: IRenderEntity): void;
    getRendererScene(): IRendererScene;
    createRendererScene(): IRendererScene;
    initialize(debug?: boolean, rparam?: RendererParam, timerDelay?: number, renderStatus?: boolean): void;
    run(): void;
}

export { IAppEngine }
