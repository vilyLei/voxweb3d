
import RendererParam from "../../vox/scene/RendererParam";
import IRendererScene from "../../vox/scene/IRendererScene";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";

interface AppEngineInstance {

    setMaterialContext(materialCtx: IMaterialContext): void
    setSyncLookEnabled(enabled: boolean): void;
    addEntity(entity: IRenderEntity, processIndex?: number): void;
    removeEntity(entity: IRenderEntity): void;
    getRendererScene(): IRendererScene;
    createRendererScene(): IRendererScene;
    initialize(debug?: boolean, rparam?: RendererParam, timerDelay?: number, renderStatus?: boolean): void;
    run(): void;
}

export { AppEngineInstance }
