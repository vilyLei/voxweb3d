
import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import Matrix4Pool from "../vox/math/Matrix4Pool";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import VtxBufConst from "../vox/mesh/VtxBufConst";
import Box3DMesh from "../vox/mesh/Box3DMesh";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import BoxFrame3D from "../vox/entity/BoxFrame3D";

export class DemoFlexMesh {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_frameBox: BoxFrame3D = null;
    private m_targets: DisplayEntity[] = [];
    private m_srcBox: Box3DEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoFlexMesh::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            //skin_01
            // add common 3d display entity
            //      let plane:Plane3DEntity = new Plane3DEntity();
            //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //      this.m_rscene.addEntity(plane);
            //      this.m_targets.push(plane);
            //      //this.m_disp = plane
            //testTex
            //  let testBox:Box3DEntity = new Box3DEntity();
            //  testBox.uvPartsNumber = 6;
            //  testBox.initializeCube(100.0, [this.getImageTexByUrl("static/assets/sixParts.jpg")]);
            //  testBox.setScaleXYZ(2.0,2.0,2.0);
            //  this.m_rscene.addEntity(testBox);
            //  return;
            let box: Box3DEntity = new Box3DEntity();
            box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/skin_01.jpg")]);
            box.setScaleXYZ(2.0, 2.0, 2.0);
            //box.setRotationXYZ(-80,0,0);
            //this.m_rscene.addEntity(box);
            //this.updateBoxUV(box);
            //this.m_srcBox = box;
            //return;
            this.createAMeshDisp(box);

            //this.m_rscene.setAutoRunningEnabled(false);
            this.update();
        }
    }

    private updateBoxUV(box: Box3DEntity): void {
        box.scaleUVFaceAt(0, 0.5, 0.5, 0.5, 0.5);
        box.scaleUVFaceAt(1, 0.0, 0.0, 0.5, 0.5);
        box.scaleUVFaceAt(2, 0.5, 0.0, 0.5, 0.5);
        box.scaleUVFaceAt(3, 0.0, 0.5, 0.5, 0.5);
        box.scaleUVFaceAt(4, 0.5, 0.0, 0.5, 0.5);
        box.scaleUVFaceAt(5, 0.0, 0.5, 0.5, 0.5);
        box.reinitializeMesh();
    }
    private updateBoxMesh(): boolean {
        if (this.m_srcBox == null) return false;
        this.updateBoxUV(this.m_srcBox);
        this.m_srcBox.updateMeshToGpu(this.m_rscene.getRenderProxy());
        return true;
    }
    private m_box: Box3DEntity = null;
    private m_boxMesh: Box3DMesh = null;
    private createAMeshDisp(entity: Box3DEntity): void {
        let mesh: Box3DMesh = new Box3DMesh();
        this.m_boxMesh = mesh;
        mesh.setBufSortFormat(entity.getMaterial().getBufSortFormat());
        mesh.initializeWithYFace(
            new Vector3D(-60.0, -100.0, -60.0), new Vector3D(60.0, -100.0, 60.0),
            new Vector3D(-100.0, 100.0, -100.0), new Vector3D(100.0, 100.0, 100.0)
        );

        let box: Box3DEntity = new Box3DEntity();
        box.setMesh(mesh);
        box.initializeCube(100.0, [this.getImageTexByUrl("static/assets/skin_01.jpg")]);
        this.m_pos0.setXYZ(Math.random() * 1.0 + 0.1, Math.random() * 1.0 + 0.1, Math.random() * 1.0 + 0.1);
        this.m_pos0.normalize();
        this.m_pos0.scaleBy(1.1);
        (box.getMaterial() as any).setRGB3f(this.m_pos0.x, this.m_pos0.y, this.m_pos0.z);
        this.updateBoxUV(box);
        this.m_rscene.addEntity(box);
        //  box.reinitializeMesh();
        //  box.updateMeshToGpu(this.m_rscene.getRenderProxy());
        if(this.m_frameBox == null) {
            this.m_frameBox = new BoxFrame3D();
            this.m_frameBox.initializeByAABB( box.getGlobalBounds() );
            this.m_rscene.addEntity( this.m_frameBox );
        }
        this.m_box = box;
    }
    private m_testFlag: boolean = true;
    private m_pos0: Vector3D = new Vector3D();
    private m_pos1: Vector3D = new Vector3D();
    private m_pos2: Vector3D = new Vector3D();
    private m_pos3: Vector3D = new Vector3D();
    private deformateDefault(): void {
        if (this.m_testFlag) {
            this.m_boxMesh.initialize(new Vector3D(-60.0, -100.0, -60.0), new Vector3D(60.0, 100.0, 60.0));
        }
        else {
            this.m_boxMesh.initializeWithYFace(
                new Vector3D(-60.0, -100.0, -60.0), new Vector3D(60.0, -100.0, 60.0),
                new Vector3D(-100.0, 100.0, -100.0), new Vector3D(100.0, 100.0, 100.0)
            );
        }
    }
    private deformatePosAt(i: number): void {
        this.m_boxMesh.getPositionAt(i, this.m_pos0);
        this.m_pos0.x += 20.0;
        this.m_boxMesh.setPositionAt(i, this.m_pos0);
    }
    private deformateEdgeAt(i: number): void {
        this.m_boxMesh.getEdgeAt(i, this.m_pos0, this.m_pos1);
        this.m_pos0.x += 20.0;
        this.m_pos1.x += 20.0;
        this.m_boxMesh.setEdgeAt(i, this.m_pos0, this.m_pos1);
    }
    private deformateFaceAt(i: number): void {
        this.m_boxMesh.getFaceAt(i, this.m_pos0, this.m_pos1, this.m_pos2, this.m_pos3);
        this.m_pos0.x += 5.0; this.m_pos1.x += 5.0;
        this.m_pos2.x += 5.0; this.m_pos3.x += 5.0;
        this.m_boxMesh.setFaceAt(i, this.m_pos0, this.m_pos1, this.m_pos2, this.m_pos3);
    }
    private m_mat4: Matrix4 = new Matrix4();
    private m_transPos: Vector3D = new Vector3D();
    private m_rotV2: Vector3D = new Vector3D();
    private transformFaceAt(i: number): void {
        this.m_rotV2.x += Math.random() * 0.2 - 0.1;
        this.m_rotV2.z += Math.random() * 0.2 - 0.1;
        this.m_transPos.x += Math.random() * 2 - 1;
        this.m_transPos.y += Math.random() * 2 - 1;
        this.m_transPos.z += Math.random() * 2 - 1;
        this.m_mat4.identity();
        this.m_mat4.setRotationEulerAngle(this.m_rotV2.x, this.m_rotV2.y, this.m_rotV2.z);
        this.m_mat4.setTranslation(this.m_transPos);
        this.m_box.transformFaceAt(i, this.m_mat4);
    }
    private m_rotVA: Vector3D = new Vector3D(Math.random() * 200.0, Math.random() * 200.0, Math.random() * 200.0);
    private mouseDown(evt: any): void {
        // this.m_box.setRotationXYZ(this.m_rotVA.x,this.m_rotVA.y,this.m_rotVA.z);
        // this.m_rotVA.x += 1.0;
        // this.m_rotVA.y += 1.0;
        // this.m_rotVA.z += 1.0;
        // this.m_box.update();
        // this.m_frameBox.updateFrameByAABB(this.m_box.getGlobalBounds());
        // this.m_frameBox.updateMeshToGpu();
        // return;
        let boo: boolean = this.updateBoxMesh();
        if (boo) return;
        let i: number = 1;
        let type: number = 2;
        type = 4;
        if (this.m_box == null) {
            return;
        }
        switch (type) {
            case 0:
                this.deformateDefault();
                break;
            case 1:
                this.deformatePosAt(i);
                break;
            case 2:
                this.deformateEdgeAt(i);
                break;
            case 3:
                this.deformateFaceAt(i);
                break;
            case 4:
                this.transformFaceAt(i);
                break;
            default:
                break;
        }
        this.m_boxMesh.reinitialize();
        this.m_box.updateMeshToGpu(this.m_rscene.getRenderProxy());
        this.m_testFlag = !this.m_testFlag;
        this.m_box.updateBounds();
        this.m_frameBox.updateFrameByAABB(this.m_box.getGlobalBounds());
        this.m_frameBox.updateMeshToGpu();
    }
    private m_updateId: number = 0;
    private m_currentDelta: number = 0;
    private m_previousDelta: number = 0;
    private m_fpsLimit: number = 70;

    private m_timeoutId: any = -1;
    private m_rotV: Vector3D = new Vector3D();
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps
        let pcontext: RendererInstanceContext = this.m_rcontext;
        this.m_statusDisp.statusInfo = "/" + pcontext.getTextureResTotal() + "/" + pcontext.getTextureAttachTotal();

        this.m_rscene.update();
        this.m_statusDisp.render();

        if (this.m_srcBox != null) {
            this.m_srcBox.setRotationXYZ(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
            this.m_srcBox.update();
            this.m_rotV.x += 0.5;
            this.m_rotV.y += 1.0;
        }
    }
    run(): void {
        //  this.m_currentDelta = Date.now();
        //  let delta:number = this.m_currentDelta - this.m_previousDelta;
        //  if (this.m_fpsLimit && delta < (1000 / this.m_fpsLimit)) {
        //      return;
        //  }
        //  this.m_previousDelta = this.m_currentDelta;

        this.m_statusDisp.update(false);


        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        //this.m_rscene.
        this.m_rscene.run(true);

        //this.m_camTrack.rotationOffsetAngleWorldY(-1);
        //this.m_profileInstance.run();
    }
}
export default DemoFlexMesh;