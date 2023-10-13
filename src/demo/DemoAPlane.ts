import Plane3DEntity from "../vox/entity/Plane3DEntity";
import RendererScene from "../vox/scene/RendererScene";

export class DemoAPlane {
    private m_rscene: RendererScene = null;
    private m_plane: Plane3DEntity = null;
    private m_degreeY = 0.0;
    constructor() {}

    initialize(): void {

        this.m_rscene = new RendererScene();
        this.m_rscene.initialize();
        this.createPlane();
    }
    private createPlane(): void {

        let tex = this.m_rscene.textureBlock.createImageTex2D();
        let img = new Image();
        img.onload = (): void => { tex.setDataFromImage(img); }
        img.src = "static/assets/yanj.jpg";

        this.m_plane = new Plane3DEntity();
        this.m_plane.initializeXOZSquare(800, [tex]);
        this.m_rscene.addEntity(this.m_plane);
    }

    run(): void {

        this.m_plane.setRotationXYZ(0.0, this.m_degreeY += 0.5, 0.0);
        this.m_rscene.run();
    }
}
