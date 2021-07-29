import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Pipe3DEntity from "../vox/entity/Pipe3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import BillboardLine3DEntity from "../vox/entity/BillboardLine3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst } from "../vox/texture/TextureConst";

import TextureBlock from "../vox/texture/TextureBlock";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import * as EntityDispT from "./base/EntityDisp";
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export class DemoPrimitive {
    constructor() { }

    private m_renderer: RendererInstance = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader;

    private m_texBlock: TextureBlock;

    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_equeue: EntityDispQueue = new EntityDispQueue();
    private m_billLine: BillboardLine3DEntity = null;
    private m_beginPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
    private m_endPos: Vector3D = new Vector3D(0.0, 500.0, -100.0);
    private m_uvPos: Vector3D = new Vector3D(0.3, 0.0);
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        if (this.m_renderer == null) {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setTickUpdateTime(20);
            rparam.setCamProject(45.0, 1.0, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
            this.m_renderer = new RendererInstance();
            this.m_renderer.initialize(rparam);
            this.m_renderer.appendProcess();
            this.m_renderer.appendProcess();
            this.m_rcontext = this.m_renderer.getRendererContext();
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            this.m_texBlock = new TextureBlock();
            this.m_texBlock.setRenderer(this.m_renderer);
            this.m_texLoader = new ImageTextureLoader(this.m_texBlock);

            if (this.m_statusDisp != null) this.m_statusDisp.initialize("rstatus", this.m_renderer.getViewWidth() - 180);
            let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.getImageTexByUrl("static/assets/guangyun_H_0007.png");
            let tex3: TextureProxy = this.getImageTexByUrl("static/assets/flare_core_02.jpg");
            let tex4: TextureProxy = this.getImageTexByUrl("static/assets/flare_core_01.jpg");

            RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

            let i: number = 0;
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(110.0);
            this.m_renderer.addEntity(axis);
            ///*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.color0.setRGB3f(1.0, 0.0, 0.0);
            plane.color2.setRGB3f(0.0, 1.0, 0.0);
            plane.vtxColorEnabled = true;
            //plane.showDoubleFace();
            plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [tex0]);
            //plane.initializeXOZ(-200.0,-150.0,400.0,300.0);
            plane.setXYZ(0.0, -100.0, 0.0);
            this.m_renderer.addEntity(plane);
            //return;
            //*/
            ///*
            let billLine: BillboardLine3DEntity = new BillboardLine3DEntity();
            //lightLine.showDoubleFace();
            billLine.toBrightnessBlend();
            billLine.initialize([tex4]);
            billLine.setBeginAndEndPos(this.m_beginPos, this.m_endPos);
            billLine.setLineWidth(50.0);
            billLine.setRGB3f(0.1, 0.1, 0.1);
            //billLine.setUVOffset(0.0,0.5);
            billLine.setUVOffset(this.m_uvPos.x, this.m_uvPos.y);
            billLine.setFadeRange(0.3, 0.7);
            billLine.setRGBOffset3f(Math.random() * 1.5 + 0.1, Math.random() * 1.5 + 0.1, Math.random() * 1.5 + 0.1);
            this.m_renderer.addEntity(billLine, 1);
            //billLine.setFadeFactor(0.5);
            this.m_billLine = billLine;
            //return;
            //*/
            /*
            let lightLine:LightLine3DEntity = new LightLine3DEntity();
            //lightLine.showDoubleFace();
            lightLine.toBrightnessBlend();
            //lightLine.initialize(new Vector3D(-400.0,0.0,-400.0), new Vector3D(400.0,300.0,100.0), 200.0,[tex3]);
            lightLine.initialize(new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,500.0,-100.0), 100.0,[tex4]);
            lightLine.setRGB3f(0.1,0.1,0.1);
            lightLine.setRGBOffset3f(Math.random() * 1.5 + 0.1,Math.random() * 1.5 + 0.1,Math.random() * 1.5 + 0.1);
            this.m_renderer.addEntity(lightLine,1);
            lightLine.setFadeFactor(0.5);
            //return;
            //*/
            //let posV:Vector3D = new Vector3D();
            ///*
            let pipe: Pipe3DEntity = new Pipe3DEntity();
            pipe.showDoubleFace();
            //pipe.toBrightnessBlend(false,true);
            pipe.initialize(50.0, 200.0, 8, 1, [tex3]);
            //pipe.setXYZ(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 10.0,Math.random() * 500.0 - 250.0);
            this.m_renderer.addEntity(pipe, 1);
            //return;
            //*/
            ///*
            //  pipe.getCircleCenterAt(0,posV);
            //  console.log("XXX posV: ",posV);
            //  return;
            let srcBillboard: Billboard3DEntity = new Billboard3DEntity();
            srcBillboard.initialize(100.0, 100.0, [tex2]);
            for (i = 0; i < 2; ++i) {
                let billboard: Billboard3DEntity = new Billboard3DEntity();
                billboard.copyMeshFrom(srcBillboard);
                billboard.toBrightnessBlend();
                billboard.initialize(100.0, 100.0, [tex2]);
                billboard.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                billboard.setFadeFactor(Math.random());
                this.m_renderer.addEntity(billboard);
                this.m_equeue.addBillEntity(billboard, false);
            }

            for (i = 0; i < 2; ++i) {
                let billboard: Billboard3DEntity = new Billboard3DEntity();
                billboard.copyMeshFrom(srcBillboard);
                billboard.toBrightnessBlend();
                billboard.initialize(100.0, 100.0, [tex3]);
                billboard.setXYZ(Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                billboard.setFadeFactor(Math.random());
                this.m_renderer.addEntity(billboard);
                this.m_equeue.addBillEntity(billboard, false);
            }
            //*/
            let srcBox: Box3DEntity = new Box3DEntity();
            srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);

            let box: Box3DEntity = null;
            for (i = 0; i < 2; ++i) {
                box = new Box3DEntity();
                if (srcBox != null) box.setMesh(srcBox.getMesh());
                //box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(box);
            }

            for (i = 0; i < 1; ++i) {
                let sphere: Sphere3DEntity = new Sphere3DEntity();
                sphere.initialize(50.0, 15, 15, [tex1]);
                sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(sphere);
            }
            for (i = 0; i < 2; ++i) {
                let cylinder: Cylinder3DEntity = new Cylinder3DEntity();
                cylinder.initialize(30, 80, 15, [tex0]);
                cylinder.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(cylinder);
            }
        }
    }
    private m_time: number = 1.1;
    private m_uvRotation: number = 0.0;
    run(): void {
        if (this.m_billLine != null) {
            //  this.m_time += 0.01;
            //  this.m_billLine.setFadeFactor(Math.abs(Math.cos(this.m_time)));
            //  /*
            this.m_beginPos.x = 200.0 * Math.sin(this.m_time);
            //this.m_endPos.x = 200.0 * Math.sin(this.m_time);
            this.m_time += 0.02;
            this.m_uvPos.x += 0.01;
            this.m_uvPos.y += 0.01;
            this.m_uvRotation += 1.0;
            this.m_billLine.setUVOffset(this.m_uvPos.x, this.m_uvPos.y);
            //this.m_billLine.setUVRotation(this.m_uvRotation);
            //this.m_billLine.setEndPos(this.m_endPos);
            this.m_billLine.setBeginPos(this.m_beginPos);
            //this.m_billLine.setBeginAndEndPos(this.m_beginPos,this.m_endPos);
            //*/
        }
        this.m_texBlock.run();
        this.m_equeue.run();
        if (this.m_statusDisp != null) this.m_statusDisp.update();

        this.m_rcontext.setClearRGBColor3f(0.0, 0.1, 0.0);
        this.m_rcontext.renderBegin();
        this.m_renderer.update();
        this.m_renderer.run();

        this.m_rcontext.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_rcontext.updateCamera();
    }
}
export default DemoPrimitive;