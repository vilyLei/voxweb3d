import RendererParam from "../vox/scene/RendererParam";
import MouseEvent from "../vox/event/MouseEvent";
import TextureProxy from "../vox/texture/TextureProxy";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import PingpongBlur from "../renderingtoy/mcase/PingpongBlur";
import { RenderableMaterialBlock } from "../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../vox/scene/block/RenderableEntityBlock";

export class DemoPingpongBlur {
    constructor() { }

    private m_cameraTrack: CameraTrack = null;
    private m_textureLoader: ImageTextureLoader = null;
    private m_rscene: RendererScene = null;
    private m_blurModule: PingpongBlur = null;
    private getImageTexByUrl(url: string): TextureProxy {
        return this.m_textureLoader.getImageTexByUrl(url);
    }
    private initializeRenderer(): void {
        let rparam: RendererParam = new RendererParam();
        //rparam.maxWebGLVersion = 1;
        rparam.setCamPosition(500.0, 500.0, 500.0);

        this.m_rscene = new RendererScene();
        this.m_rscene.initialize(rparam, 3);
        
        let rscene = this.m_rscene;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        rscene.entityBlock = entityBlock;

        this.m_textureLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
        this.m_cameraTrack = new CameraTrack();
        this.m_cameraTrack.bindCamera(this.m_rscene.getCamera());

        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

        this.m_blurModule = new PingpongBlur( this.m_rscene );
        //this.m_blurModule.setSyncViewSizeEnabled(false);
        //this.m_blurModule.setFBOSize(128,128);
        this.m_blurModule.setBlurDensity(2.0);
        this.m_blurModule.bindSrcProcessId(0);
        this.m_blurModule.setBackbufferVisible(true);
    }
    // 构建添加可用于渲染的资源
    private addEntity(): void {
        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        let plane: Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        this.m_rscene.addEntity(plane);

        let box: Box3DEntity = new Box3DEntity();
        box.initializeCube(200.0, [tex1]);
        this.m_rscene.addEntity(box);
    }
    initialize(): void {
        this.initializeRenderer();
        this.addEntity();
    }
    private mouseDown(evt: any): void {
        this.m_blurModule.setFBOSize(512, 512);
    }
    // 渲染器执行过程
    run(): void {
        
        // 更新渲染数据
        this.m_rscene.update();
        // blur 渲染过程
        this.m_blurModule.run();

        this.m_cameraTrack.rotationOffsetAngleWorldY(-0.2);
    }
    // 渲染器执行过程
    runNoBlur(): void {
        // 纹理源数据分帧加载/卸载
        this.m_textureLoader.run();
        // 运行默认渲染过程
        this.m_rscene.run();

        this.m_cameraTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoPingpongBlur;