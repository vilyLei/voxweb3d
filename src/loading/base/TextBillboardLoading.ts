import RendererScene from "../../vox/scene/RendererScene";
import TextBillboard3DEntity from "../../vox/text/TextBillboard3DEntity";
import H5FontSystem from "../../vox/text/H5FontSys";
import Color4 from "../../vox/material/Color4";
import Vector3D from "../../vox/math/Vector3D";

class TextBillboardLoading {

    private m_rscene: RendererScene = null;
    private m_rendererProcessIndex: number = 0;

    private m_loaded: boolean = false;
    private m_loadingFlag: boolean = false;
    private m_progress: number = 0.0;
    private m_dstProgress: number = 0.0;
    step: number = 2.0;
    fontSize: number = 32;

    loadingName:string = "resource";
    loadingInfo:string = "loading";
    loadingNameScale: number = 2.0;
    loadingInfoScale: number = 2.0;
    loadingNamePos: Vector3D = new Vector3D(0.0, -230.0, 0.0);
    loadingInfoPos: Vector3D = new Vector3D(0.0, -370.0, 0.0);
    loadingNameColor: Color4 = new Color4(0.3, 1.7, 0.5);
    loadingInfoColor: Color4 = new Color4(0.5, 0.5, 1.3);

    constructor() { }



    initialize(rscene: RendererScene, rendererProcessIndex: number = 0): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            this.m_rendererProcessIndex = rendererProcessIndex;
            this.init();
        }
    }
    private m_loadingNSEntity: TextBillboard3DEntity;
    private m_loadingEntity: TextBillboard3DEntity;

    private init(): void {

        let fontSys = H5FontSystem.GetInstance();
        fontSys.mobileEnabled = false;
        fontSys.setRenderProxy(this.m_rscene.getRenderProxy());
        fontSys.initialize("fontTex", this.fontSize, 512, 512, false, true);

        if(this.loadingName != "") {
            this.m_loadingNSEntity = new TextBillboard3DEntity();
            this.m_loadingNSEntity.initialize( this.loadingName );
            this.m_loadingNSEntity.setPosition( this.loadingNamePos );
            this.m_loadingNSEntity.setScaleXY(this.loadingNameScale, this.loadingNameScale);
            this.m_loadingNSEntity.setRGB3f(this.loadingNameColor.r, this.loadingNameColor.g, this.loadingNameColor.b);
            this.m_rscene.addEntity(this.m_loadingNSEntity, this.m_rendererProcessIndex);
        }

        this.m_loadingEntity = new TextBillboard3DEntity();
        this.m_loadingEntity.initialize(this.loadingInfo + "...");
        this.m_loadingEntity.setPosition( this.loadingInfoPos );
        this.m_loadingEntity.setScaleXY(this.loadingInfoScale, this.loadingInfoScale);
        this.m_loadingEntity.setRGB3f(this.loadingInfoColor.r, this.loadingInfoColor.g, this.loadingInfoColor.b);
        this.m_rscene.addEntity(this.m_loadingEntity, this.m_rendererProcessIndex);

    }
    isLoaded(): boolean {
        return this.m_loaded;
    }
    reset(): void {
        this.m_progress = 0.0;
        this.m_dstProgress = 0.0;
        this.m_loadingFlag = this.m_loaded = false;
    }
    run(dstProgress: number): void {

        if (this.m_loadingFlag) {

            this.m_loaded = true;

            if (this.m_loadingEntity.getVisible()) {

                this.m_loadingEntity.setVisible(false);
                this.m_rscene.removeEntity(this.m_loadingEntity);

                if (this.m_loadingNSEntity != null) {
                    this.m_loadingNSEntity.setVisible(false);
                    this.m_rscene.removeEntity(this.m_loadingNSEntity);
                }
            }
        }
        else if (this.m_loadingEntity != null && this.m_progress < this.m_dstProgress && this.m_dstProgress > 0) {

            this.m_progress += 4;
            if (this.m_progress > this.m_dstProgress) {
                this.m_progress = this.m_dstProgress;
            }
            let f: number = this.m_progress / 100.0;
            this.m_loadingEntity.setText(this.loadingInfo + " " + Math.round(f * 100) + "%");
            this.m_loadingEntity.updateMeshToGpu();
            this.m_loadingEntity.update();
        }

        let f: number = dstProgress;
        this.m_dstProgress = Math.round(f * 100);

        if (this.m_dstProgress >= 100.0 && this.m_progress >= this.m_dstProgress) {
            this.m_loadingFlag = true;
        }
    }
}
export { TextBillboardLoading };