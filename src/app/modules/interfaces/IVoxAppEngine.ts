
import RendererParam from "../../../vox/scene/RendererParam";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

interface IVoxAppEngine {

    getImageTexByUrl(purl: string, wrapRepeat: boolean, mipmapEnabled: boolean): IRenderTexture;
    addEntity(entity: IRenderEntity, processIndex: number): void;
    getRendererScene(): IRendererScene;
    createRendererScene(): IRendererScene;
    initialize(rparam: RendererParam, timeerDelay: number, renderStatus: boolean): void;
    run(): void;
}

export { IVoxAppEngine }
