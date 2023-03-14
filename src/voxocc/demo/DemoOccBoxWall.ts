import Vector3D from "../../vox/math/Vector3D";
import { CubeRandomRange } from "../../vox/utils/RandomRange";
import RendererDevice from "../../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import RendererState from "../../vox/render/RendererState";
import RendererParam from "../../vox/scene/RendererParam";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";
import MouseEvent from "../../vox/event/MouseEvent";
import Stage3D from "../../vox/display/Stage3D";
import H5FontSystem from "../../vox/text/H5FontSys";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import BillboardFrame from "../../vox/entity/BillboardFrame";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import CameraTrack from "../../vox/view/CameraTrack";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import { QuadHolePOV } from '../../voxocc/occlusion/QuadHolePOV';
import BoxPOV from '../../voxocc/occlusion/BoxPOV';
import { BoxFarFacePOV } from '../../voxocc/occlusion/BoxFarFacePOV';
import IRendererSpace from "../../vox/scene/IRendererSpace";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import SpaceCullingor from '../../vox/scene/SpaceCullingor';
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

export class DemoOccBoxWall {
    constructor() {
    }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;

    private m_profileInstance = new ProfileInstance();
    private m_dispList: DisplayEntity[] = [];
    private m_frameList: BillboardFrame[] = [];
    private m_occStatusList: number[] = [];
    private m_rspace: IRendererSpace = null;
    private m_texList: TextureProxy[] = [];

    initialize(): void {

        console.log("DemoOccBoxWall::initialize()......");

        if (this.m_rscene == null) {
            
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam = new RendererParam();
            rparam.setCamProject(45.0, 50.0, 6000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rspace = this.m_rscene.getSpace();
            this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

            new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
            new RenderStatusDisplay(this.m_rscene, true);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let tex0 = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            let tex1 = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2 = this.m_texLoader.getImageTexByUrl("static/assets/metal_08.jpg");
            let tex3 = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_01.jpg");
            let tex4 = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
            let tex5 = this.m_texLoader.getImageTexByUrl("static/assets/a_02_c.jpg");
            
            this.m_texList.push(tex0);
            this.m_texList.push(tex1);
            this.m_texList.push(tex2);
            this.m_texList.push(tex3);
            this.m_texList.push(tex4);
            this.m_texList.push(tex5);

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let cubeRange = new CubeRandomRange();
            cubeRange.min.setXYZ(-700.0, -600.0, -350.0);
            cubeRange.max.setXYZ(700.0, 600.0, -200.0);
            cubeRange.initialize();

            let cubeRange1 = new CubeRandomRange();
            cubeRange1.min.setXYZ(-700.0, -600.0, 450.0);
            cubeRange1.max.setXYZ(700.0, 600.0, 300.0);
            cubeRange1.initialize();


            let cubeRange2 = new CubeRandomRange();
            cubeRange2.min.setXYZ(-700.0, -600.0, -950.0);
            cubeRange2.max.setXYZ(700.0, 600.0, -800.0);
            cubeRange2.initialize();

            let i = 0;
            let total = 600;
            this.m_profileInstance = new ProfileInstance();
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());

            let src_circleFrame = new BillboardFrame();
            src_circleFrame.initializeCircle(100.0, 20);
            let pv = new Vector3D();
            let circleFrame: BillboardFrame = null;
            let srcBox = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex0]);
            let box: Box3DEntity = null;
            let scaleK = 0.2;
            let frameScaleK = 1.0;

            let minV = new Vector3D(-100.0, -100.0, -100.0);
            let maxV = new Vector3D(100.0, 100.0, 100.0);
            let texList: TextureProxy[] = [tex4];
            for (i = 0; i < total; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.setMesh(srcBox.getMesh());
                box.initialize(minV, maxV, texList);
                if (total > 1) {
                    box.setScaleXYZ((Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK, (Math.random() + 0.8) * scaleK);
                    let rand: number = Math.random();
                    if (rand > 0.6) {
                        cubeRange2.calc();
                        box.setPosition(cubeRange2.value);
                    }
                    else if (rand > 0.3) {
                        cubeRange1.calc();
                        box.setPosition(cubeRange1.value);
                    }
                    else {
                        cubeRange.calc();
                        box.setPosition(cubeRange.value);
                    }
                    //box.setXYZ(Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0,Math.random() * 2000.0 - 1000.0);
                }
                else {
                    box.setXYZ(0.0, 0.0, 0.0);
                    //box.setXYZ(-324.0,252.0,-619.0);
                }

                box.spaceCullMask |= SpaceCullingMask.POV;
                this.m_rscene.addEntity(box);
                this.m_dispList.push(box);
                this.m_occStatusList.push(0);

                box.getPosition(pv);
                circleFrame = new BillboardFrame();
                circleFrame.copyMeshFrom(src_circleFrame);
                circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
                frameScaleK = box.getGlobalBounds().radius / 100.0;
                circleFrame.setScaleXY(frameScaleK, frameScaleK);
                circleFrame.setPosition(pv);
                //this.m_rscene.addEntity(circleFrame);
                this.m_frameList.push(circleFrame);
            }

            let cullingor = new SpaceCullingor();
            this.m_rspace.setSpaceCullingor(cullingor);
            let gapList: number[] = null;
            gapList = [2, 1];
            //gapList = [];
            this.createXOYWall(cullingor, new Vector3D(0.0, 0.0, -700.0), 4, 4, gapList, 0, -1, -1);
            gapList = [1, 1, 3, 2];
            //gapList = [];
            this.createXOYWall(cullingor, new Vector3D(0.0, 0.0, 150.0), 5, 4, gapList, 2, -1, -1);

        }
    }
    createXOYWall(cullingor: SpaceCullingor, pv: Vector3D, rn: number, cn: number, gapList: number[], texId: number, pr: number, pc: number): void {
        let i = 0;
        let j = 0;
        //let rn:number = 5;
        //let cn:number = 4;

        let pV = new Vector3D(0.0, 0.0, 0.0);
        let minV = new Vector3D();
        let maxV = new Vector3D(300.0, 350.0, 250.0);
        let texList: TextureProxy[] = [this.m_texList[texId]];
        let srcBox = new Box3DEntity();
        srcBox.initialize(minV, maxV, texList);
        let box: Box3DEntity = null;
        let boxList: Box3DEntity[] = [];

        let tpv = new Vector3D();
        let startX = pv.x - 2.0 * maxV.x;
        let startY = pv.y - 2.0 * maxV.y;
        let startZ = pv.z;
        pV.z = startZ;
        for (; i < rn; ++i) {
            pV.y = startY + i * maxV.y;
            for (j = 0; j < cn; ++j) {
                pV.x = startX + j * maxV.x;
                box = new Box3DEntity();
                box.setMesh(srcBox.getMesh());
                box.initialize(minV, maxV, texList);
                box.setPosition(pV);
                box.spaceCullMask |= SpaceCullingMask.POV;
                if (cullingor != null) {
                    box.spaceCullMask |= SpaceCullingMask.INNER_POV_PASS;
                }
                if (pr > -1 && pc > -1) {
                    if (i != pr || j != pc) {
                    }
                    else {
                        this.m_rscene.addEntity(box);
                        let circleFrame: BillboardFrame = new BillboardFrame();
                        //circleFrame.copyMeshFrom(src_circleFrame);
                        circleFrame.initializeCircle(box.getGlobalBounds().radius, 20);
                        //frameScaleK = box.getGlobalBounds().radius / 100.0;
                        //circleFrame.setScaleXY(frameScaleK,frameScaleK);
                        tpv.copyFrom(pV);
                        tpv.x += maxV.x * 0.5;
                        tpv.y += maxV.y * 0.5;
                        tpv.z += maxV.z * 0.5;
                        console.log("XXXXXXX tpv: " + tpv.toString());
                        console.log("XXXXXXX box.getGlobalBounds().center: " + box.getGlobalBounds().center.toString());
                        circleFrame.setPosition(box.getGlobalBounds().center);
                        //circleFrame.setPosition(tpv);
                        this.m_rscene.addEntity(circleFrame);
                    }
                }
                else {
                    this.m_rscene.addEntity(box);
                }
                boxList.push(box);

                //console.log("create a wall brick.");
            }
        }

        if (cullingor == null) {
            return;
        }
        let subMinV = new Vector3D();
        let subMaxV = new Vector3D();
        let k = 0;
        let len = gapList.length;
        let povGaps: QuadHolePOV[] = [];
        for (; len > 0;) {
            i = gapList[len - 2];
            j = gapList[len - 1];
            subMinV.x = startX + j * maxV.x;
            subMinV.y = startY + i * maxV.y;
            subMinV.z = startZ;
            subMaxV.x = subMinV.x + maxV.x;
            subMaxV.y = subMinV.y + maxV.y;
            subMaxV.z = subMinV.z + maxV.z;

            k = i * cn + j;
            boxList[k].setVisible(false);

            let quadHolePOV: QuadHolePOV = new QuadHolePOV();
            quadHolePOV.setCamPosition(this.m_rscene.getCamera().getPosition());
            quadHolePOV.setParamFromeBoxFaceZ(subMinV, subMaxV);
            quadHolePOV.updateOccData();
            povGaps.push(quadHolePOV);

            len -= 2;
        }
        let boxMinV: Vector3D = new Vector3D(startX, startY, startZ);
        let boxMaxV: Vector3D = new Vector3D(startX + cn * maxV.x, startY + rn * maxV.y, startZ + maxV.z);
        let boxFrame: BoxFrame3D = new BoxFrame3D();
        boxFrame.initialize(boxMinV, boxMaxV);
        boxFrame.setScaleXYZ(1.01, 1.01, 1.01);
        this.m_rscene.addEntity(boxFrame);

        //let wallOcc0:BoxPOV = new BoxPOV();
        let wallOcc0 = new BoxFarFacePOV();
        wallOcc0.setCamPosition(this.m_rscene.getCamera().getPosition());
        wallOcc0.setParam(boxMinV, boxMaxV);
        wallOcc0.updateOccData();;

        len = povGaps.length - 1;
        for (; len >= 0;) {
            wallOcc0.addSubPov(povGaps[len]);
            --len;
        }

        cullingor.addPOVObject(wallOcc0);
    }
    mouseDownListener(evt: any): void {
    }
    showTestStatus(): void {
        let i: number = 0;
        let len: number = this.m_dispList.length;
        for (; i < len; ++i) {
            //this.m_frameList[i].setRGB3f(1.0,1.0,1.0);
            if (this.m_dispList[i].drawEnabled) {
                this.m_frameList[i].setRGB3f(1.0, 1.0, 1.0);
            }
            else {
                this.m_frameList[i].setRGB3f(1.0, 0.0, 1.0);
            }
        }
    }
    
    run(): void {
        if(this.m_rscene) {
            this.m_rscene.run();
            this.showTestStatus();

            if (this.m_profileInstance != null) {
                this.m_profileInstance.run();
            }
        }
    }
    run2(): void {
        //console.log("##-- begin");

        // this.m_rscene.setClearRGBColor3f(0.0, 0.1, 0.1);
        // this.m_rscene.runBegin();

        // this.m_rscene.update();
        // this.m_rscene.cullingTest();
        // this.showTestStatus();

        // this.m_rscene.run();
        // this.m_rscene.runEnd();
        // this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        // this.m_rscene.updateCamera();

        // if (this.m_profileInstance != null) {
        //     this.m_profileInstance.run();
        // }
    }
}