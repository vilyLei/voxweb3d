import Plane3DEntity from "../vox/entity/Plane3DEntity";
import RendererScene from "../vox/scene/RendererScene";

/**
 * a 3d rectangle plane display example
 */
export class DemoAPlane {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_plane: Plane3DEntity = null;
    private m_degreeY: number = 0.0;

    initialize(): void {
        this.m_rscene = new RendererScene();
        this.m_rscene.initialize();
        this.createPlane();
    }
    private createPlane(): void {

        let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

        this.m_plane = new Plane3DEntity();
        this.m_plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
        this.m_rscene.addEntity(this.m_plane);

        let img: HTMLImageElement = new Image();
        img.onload = (evt: any): void => {
            tex.setDataFromImage(img, 0, 0, 0, false);
        }
        img.src = "static/assets/yanj.jpg";
    }

    run(): void {

        this.m_plane.setRotationXYZ(0.0, this.m_degreeY, 0.0);
        this.m_plane.update();
        this.m_degreeY += 0.5;

        this.m_rscene.run();
    }
}
