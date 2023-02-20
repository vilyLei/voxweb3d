
import Vector3D from "../../../vox/math/Vector3D";
import RendererDevice from "../../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";

import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";
import BakeMaterial from "./BakeMaterial";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RendererSceneGraph from "../../../vox/scene/RendererSceneGraph";
import IRendererScene from "../../../vox/scene/IRendererScene";
import RendererState from "../../../vox/render/RendererState";
import Sphere3DMesh from "../../../vox/mesh/Sphere3DMesh";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

export class BakeExample {

    private m_rscene: IRendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_statusDisp = new RenderStatusDisplay();
    private m_stageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController = new CameraZoomController();

    private m_graph = new RendererSceneGraph();

    constructor() { }

    private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        ptex.minFilter = TextureConst.NEAREST;
        ptex.magFilter = TextureConst.NEAREST;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_CLAMP_TO_EDGE);
        return ptex;
    }
    
    private initSys(): void {

        this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.initWithRScene(this.m_rscene);
        this.m_stageDragSwinger.initWithRScene(this.m_rscene);

        this.m_statusDisp.initialize();
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);


    }
    
    private createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
        let div: HTMLDivElement = document.createElement('div');
        div.style.width = pw + 'px';
        div.style.height = ph + 'px';
        document.body.appendChild(div);
        div.style.display = 'bolck';
        div.style.left = px + 'px';
        div.style.top = py + 'px';
        div.style.position = 'absolute';
        div.style.display = 'bolck';
        div.style.position = 'absolute';
        return div;
    }
    initialize(): void {
        console.log("BakeExample::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam = this.m_graph.createRendererParam(this.createDiv(0,0,512,512));
            rparam.autoSyncRenderBufferAndWindowSize = false;
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = this.m_graph.createScene(rparam, 4);
            this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);

            this.initSys();
            this.init3DScene();
        }
    }
    
    private init3DScene(): void {
        
        // this.applyTex();

        this.buildTex();
    }
    private applyTex(): void {

        let tex = this.getTexByUrl("static/assets/sph_mapping01b.png");
        // tex.flipY = true;
        let material = new Default3DMaterial();
        material.setTextureList([tex]);
        material.initializeByCodeBuf(true);
        let mesh = new Sphere3DMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(200, 20, 20, false);

        let entity = new DisplayEntity();
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        entity.setMesh(mesh);
        entity.setMaterial(material);

        this.m_rscene.addEntity(entity);
    }
    private buildTex(): void {

        let material = new BakeMaterial();
        material.setTextureList([
            this.getTexByUrl("static/assets/color_02.jpg"),
            this.getTexByUrl("static/assets/fabric_01.jpg"),
        ]);
        material.initializeByCodeBuf(true);

        let mesh = new Sphere3DMesh();
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(200, 20, 20, false);


        // let mesh = new RectPlaneMesh();
        // mesh.axisFlag = 1;
        // mesh.setBufSortFormat(material.getBufSortFormat());
        // mesh.initialize(-250, -250, 500, 500);

        let entity = new DisplayEntity();
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity.setMesh(mesh);
        entity.setMaterial(material);

        this.m_rscene.addEntity(entity);

        
        return;
        material = new BakeMaterial(1);
        material.setTextureList([
            this.getTexByUrl("static/assets/color_02.jpg"),
            this.getTexByUrl("static/assets/fabric_01.jpg"),
        ]);
        material.initializeByCodeBuf(true);
        mesh = new Sphere3DMesh();
        mesh.wireframe = true;
        mesh.setBufSortFormat(material.getBufSortFormat());
        mesh.initialize(200, 20, 20, false);


        // let mesh = new RectPlaneMesh();
        // mesh.axisFlag = 1;
        // mesh.setBufSortFormat(material.getBufSortFormat());
        // mesh.initialize(-250, -250, 500, 500);

        entity = new DisplayEntity();
        entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
        entity.setMesh(mesh);
        entity.setMaterial(material);

        this.m_rscene.addEntity(entity, 1);

    }


    private mouseDown(evt: any): void {
    }

    run(): void {

        this.m_statusDisp.update(true);

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
        this.m_graph.run();

    }
}
export default BakeExample;