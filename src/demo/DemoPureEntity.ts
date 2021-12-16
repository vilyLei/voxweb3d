
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import Vector3D from "../vox/math/Vector3D";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import PureEntity from "../vox/entity/PureEntity";
import MathConst from "../vox/math/MathConst";
import BoxFrame3D from "../vox/entity/BoxFrame3D";
import { UserInteraction } from "../vox/engine/UserInteraction";

export class DemoPureEntity {

    constructor() { }
    
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    
    private m_interaction: UserInteraction = new UserInteraction();
    private m_posV: Vector3D = new Vector3D();
    private m_rotV: Vector3D = new Vector3D();
    private m_scaleV: Vector3D = new Vector3D(1.0,1.0,1.0);
    private m_targetEntity: PureEntity;
    private m_srcBox0: Box3DEntity;
    private m_srcBox1: Box3DEntity;
    private m_boundsFrame: BoxFrame3D = new BoxFrame3D();
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    
    initialize(): void {

        console.log("DemoPureEntity::initialize()......");

        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45, 10.0, 8000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setClearRGBColor3f(0.0, 0.0, 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();

            this.m_interaction.initialize( this.m_rscene );
            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            //console.log("isWinExternalVideoCard: ",isWinExternalVideoCard);
            //this.m_materialCtx.initialize( this.m_rscene );

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            let halfSize: number = 100.0;;

            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/wood_02.jpg");
            if (this.m_srcBox0 == null) {
                this.m_srcBox0 = new Box3DEntity();
                this.m_srcBox0.initialize(new Vector3D(-halfSize, -halfSize * 0.5, -halfSize), new Vector3D(halfSize, halfSize * 0.5, halfSize), [tex0]);
            }
            if (this.m_srcBox1 == null) {
                this.m_srcBox1 = new Box3DEntity();
                this.m_srcBox1.initialize(new Vector3D(-halfSize, -halfSize, -halfSize), new Vector3D(halfSize, halfSize, halfSize), [tex0]);
            }
            let srcBox0 = this.m_srcBox0;
            let srcBox1 = this.m_srcBox1;

            let materialBox0: Box3DEntity = new Box3DEntity();
            materialBox0.copyMeshFrom(srcBox0);
            materialBox0.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
            let material0: any = materialBox0.getMaterial();
            //material0.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

            let materialBox1: Box3DEntity = new Box3DEntity();
            materialBox1.copyMeshFrom(srcBox0);
            materialBox1.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
            let material1: any = materialBox1.getMaterial();
            //material1.setRGB3f(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4);

            let box: PureEntity;
            box = new PureEntity();
            box.copyMeshFrom(srcBox0);
            box.copyMaterialFrom(materialBox0);
            this.m_rscene.addEntity(box);
            this.m_targetEntity = box;
            // box.update();
            this.m_boundsFrame.initializeByAABB(box.getGlobalBounds());
            this.m_rscene.addEntity(this.m_boundsFrame);
            console.log(">>>>>>>>>>>>>>> test ea....");
            
            this.update();
        }
    }
    private m_time: number = 0.0;
    private mouseDown(evt: any): void {
        this.updateEntity();
    }
    private updateEntity(): void {
        
        let entity = this.m_targetEntity;
        let mat = entity.getMatrix();
        mat.identity();
        mat.setScaleXYZ(this.m_scaleV.x,  this.m_scaleV.y, this.m_scaleV.z);
        mat.setRotationEulerAngle(this.m_rotV.x * MathConst.MATH_PI_OVER_180, this.m_rotV.y * MathConst.MATH_PI_OVER_180, this.m_rotV.z * MathConst.MATH_PI_OVER_180);
        mat.appendTranslation(this.m_posV);
        //this.m_posV.x += 2.0;
        this.m_posV.y = Math.cos(this.m_time) * 200.0;
        this.m_rotV.y += 2.0;
        this.m_rotV.z += 2.0;
        entity.updateTransform();
        entity.update();
        this.m_time += 0.02;

        
        this.m_boundsFrame.updateFrameByAABB(entity.getGlobalBounds());
        this.m_boundsFrame.updateMeshToGpu();
    }
    
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 20 fps
        this.m_statusDisp.render();
        this.updateEntity();
    }
    run(): void {
        
        this.m_interaction.run();
        this.m_statusDisp.update(false);

        //this.m_materialCtx.run();
        this.m_rscene.run();

    }
}
export default DemoPureEntity;