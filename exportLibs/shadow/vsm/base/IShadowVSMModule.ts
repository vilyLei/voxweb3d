import IVector3D from "../../../vox/math/IVector3D";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IMaterialPipe } from "../../../vox/material/pipeline/IMaterialPipe";
import IRendererScene from "../../../vox/scene/IRendererScene";

interface IShadowVSMModule extends IMaterialPipe {

    force: boolean;
    initialize(rscene: IRendererScene, processIDList: number[], buildShadowDelay?: number, blurEnabled?: boolean): void;
    /**
     * set shawow rtt texture size
     * @param mapW shadow rtt texture width
     * @param mapH shadow rtt texture height
     */
    setMapSize(mapW: number, mapH: number): void
    /**
     * set shadow camera world position 
     * @param pos shadow camera position in world.
     */
    setCameraPosition(pos: IVector3D): void
    /**
     * set shadow camera near plane distance 
     * @param near shadow camera near plane distance 
     */
    setCameraNear(near: number): void
    /**
     * set shadow camera far plane distance 
     * @param far shadow camera far plane distance 
     */
    setCameraFar(far: number): void
    setCameraViewSize(viewW: number, viewH: number): void
    setShadowRadius(radius: number): void
    setShadowBias(bias: number): void
    setShadowIntensity(intensity: number): void
    setColorIntensity(intensity: number): void

    getShadowMap(): IRenderTexture;

    getCamera(): IRenderCamera;
    setRendererProcessIDList(processIDList: number[]): void;

    upate(): void;
    run(): void;
    destroy(): void;
}
export { IShadowVSMModule }