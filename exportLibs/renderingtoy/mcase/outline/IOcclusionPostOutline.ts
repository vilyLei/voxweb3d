
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";

export default interface IOcclusionPostOutline {

    initialize(rscene: IRendererScene, fboIndex?: number, occlusionRProcessIDList?: number[]): void;
    getPreColorRTT(): IRTTTexture;
    setFBOSizeScaleRatio(scaleRatio: number): void;
    setOutlineThickness(thickness: number): void;
    setOutlineDensity(density: number): void;

    setOcclusionDensity(density: number): void;
    setRGB3f(pr: number, pg: number, pb: number): void;
    setPostRenderState(state: number): void;
    setTargetList(targets: IRenderEntity[]): void;
    getTargetList(): IRenderEntity[];
    setBoundsOffset(offset: number): void;
    startup(): void;
    quit(): void;
    isRunning(): boolean;
    /**
     * draw outline line effect rendring begin
     */
    drawBegin(): void;
    /**
     * draw outline effect rendring
     */
    draw(): void;

    /**
     * draw outline line effect rendring end
     */
    drawEnd(): void;
}
