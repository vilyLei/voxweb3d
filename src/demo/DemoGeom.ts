
import Vector3D from "../vox/math/Vector3D";
import Sphere from "../vox/geom/Sphere";
import Cone from "../vox/geom/Cone";
import InfiniteCone from "../vox/geom/InfiniteCone";

import RendererDevice from "../vox/render/RendererDevice";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Line3DEntity from "../vox/entity/Line3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Cone3DEntity from "../vox/entity/Cone3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import TextureBlock from "../vox/texture/TextureBlock";
import CameraTrack from "../vox/view/CameraTrack";
import CameraBase from "../vox/view/CameraBase";

export namespace demo
{
    export class DemoGeom
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_texBlock:TextureBlock;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        initialize():void
        {
            console.log("DemoGeom::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = false;
                
                this.m_statusDisp.initialize();
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam, new CameraBase());
                this.m_rcontext = this.m_renderer.getRendererContext();
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer(this.m_renderer);
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);

                
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);

                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
                
                //  this.testReflect();

                //  let plane:Plane3DEntity = new Plane3DEntity();
                //  plane.name = "plane";
                //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //  this.m_renderer.addEntity(plane);
                //  plane.setRenderStateByName("ADD01");
                //          let clyEntity:Cylinder3DEntity = new Cylinder3DEntity();
                //          clyEntity.initialize(100.0,210.0,20,[tex0]);
                //          clyEntity.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                //          clyEntity.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
                //          this.m_renderer.addEntity(clyEntity);
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(600.0);
                axis.setXYZ(0.0,0.0,0.0);
                this.m_renderer.addEntity(axis);
                /*
                let outv0:Vector3D = new Vector3D();
                let outv1:Vector3D = new Vector3D();
                let ls0_pa:Vector3D = new Vector3D(700.0,100.0,600.0);
                let ls0_pb:Vector3D = new Vector3D(-700.0,100.0,-300.0);
                let ls0_tv:Vector3D = new Vector3D();
                ls0_tv.copyFrom(ls0_pb);
                ls0_tv.subtractBy(ls0_pa);
                ls0_tv.normalize();

                let ls1_pa:Vector3D = new Vector3D(-200.0,-50.0,300.0);
                let ls1_pb:Vector3D = new Vector3D(200.0,0.0,-300.0);
                let ls1_tv:Vector3D = new Vector3D();
                ls1_tv.copyFrom(ls1_pb);
                ls1_tv.subtractBy(ls1_pa);
                ls1_tv.normalize();


                let ls0:Line3DEntity = new Line3DEntity();
                ls0.initialize(ls0_pa, ls0_pb);
                this.m_renderer.addEntity(ls0);

                let ls1:Line3DEntity = new Line3DEntity();
                ls1.initialize(ls1_pa, ls1_pb);
                this.m_renderer.addEntity(ls1);

                StraightLine.CalcTwoSLDualCloseV2(ls0_pa, ls0_tv, ls1_pa, ls1_tv, outv0,outv1);
                //  StraightLine.CalcTwoSLCloseV2(ls0_pa, ls0_tv, ls1_pa, ls1_tv, outv0);
                //  StraightLine.CalcTwoSLCloseV2(ls1_pa, ls1_tv, ls0_pa, ls0_tv, outv1);
                
                let inter_ls:Line3DEntity = new Line3DEntity();
                inter_ls.setRGB3f(1.0,0.0,1.0);
                inter_ls.initialize(outv0, outv1);
                this.m_renderer.addEntity(inter_ls);
                //*/

                let outPv:Vector3D = new Vector3D(0.0,0.0,0.0);
                let paxis:Axis3DEntity = new Axis3DEntity();
                paxis.initialize(200.0);
                paxis.setRotationXYZ(0.0,45.0,0.0);
                paxis.setPosition(outPv);
                this.m_renderer.addEntity(paxis);
                //let pcone:Cone = new Cone();
                let pcone:InfiniteCone = new InfiniteCone();
                pcone.position.setTo(0.0,200.0,0.0);
                pcone.tv.setTo(0.0,-1.0,0.0);
                pcone.height = 210.0;
                pcone.radius = 100.0;

                let coneEntity:Cone3DEntity = new Cone3DEntity();
                coneEntity.initialize(pcone.radius,pcone.height,20,[tex0],1,-1.0);
                coneEntity.setPosition(pcone.position);
                //coneEntity.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
                //coneEntity.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                //coneEntity.setRotationXYZ(Math.random() * 360.0,Math.random() * 360.0,Math.random() * 360.0);
                coneEntity.setRotationXYZ(60.0,0.0,-30.0);
                this.m_renderer.addEntity(coneEntity);

                let innerPv:Vector3D = new Vector3D(0.0,-30.0,0.0);
                coneEntity.getTransform().getMatrix().transformVector3Self(innerPv);

                pcone.tv.copyFrom(innerPv);
                pcone.tv.subtractBy(pcone.position);
                pcone.tv.normalize();
                pcone.update();
                console.log("pcone.mcos: "+pcone.mcos);

                let boo0:boolean = pcone.containsPos(outPv);
                console.log("boo0: "+boo0);
                
                //  let pa:Vector3D = new Vector3D(450.0,60.0,-200.0);
                //  let pb:Vector3D = new Vector3D(-300.0,-30.0,-40.0);
                let pa:Vector3D = new Vector3D(450.0,60.0,200.0);
                let pb:Vector3D = new Vector3D(-200.0,-30.0,-340.0);
                //  let pa:Vector3D = new Vector3D(450.0,60.0,-50.0);
                //  let pb:Vector3D = new Vector3D(-300.0,-30.0,-240.0);
                //  let pa:Vector3D = new Vector3D(450.0,10.0,-200.0);
                //  let pb:Vector3D = new Vector3D(-300.0,-80.0,-50.0);
                //  let pa:Vector3D = new Vector3D(450.0,10.0,350.0);
                //  let pb:Vector3D = new Vector3D(-300.0,-70.0,-300.0);
                pa.copyFrom(pcone.position);
                pb = new Vector3D(100.0,-30.0,-340.0);
                let dv:Vector3D = new Vector3D(-50.0,41.072,-50.0);
                pa.addBy(dv);
                pb.addBy(dv);

                let tv:Vector3D = new Vector3D();
                tv.copyFrom(pb);
                tv.subtractBy(pa);
                tv.normalize();
                //tv.copyFrom(pcone.tv);
                
                pb.x = pa.x + tv.x * 700.0;
                pb.y = pa.y + tv.y * 700.0;
                pb.z = pa.z + tv.z * 700.0;

                pa.x += tv.x * -300.0;
                pa.y += tv.y * -300.0;
                pa.z += tv.z * -300.0;

                let ls:Line3DEntity = new Line3DEntity();
                ls.initialize(pa, pb);
                this.m_renderer.addEntity(ls);
                let nearV0:Vector3D = new Vector3D();
                let nearV1:Vector3D = new Vector3D();
                let nearV2:Vector3D = new Vector3D();
                let boo1:boolean = pcone.intersectionRL(pa,tv, nearV0,nearV1);
                console.log("boo1: "+boo1);
                nearV2.copyFrom(tv);
                nearV2.scaleBy(130.0);
                nearV2.addBy(pa);
                //let boo2:boolean = pcone.intersectSLTest(pa,tv);
                //console.log("boo2: "+boo2);

                let axis1:Axis3DEntity = new Axis3DEntity();
                axis1.colorX.setRGB3f(1.0,0.0,1.0);
                axis1.colorY.setRGB3f(1.0,0.0,1.0);
                axis1.colorZ.setRGB3f(1.0,0.0,1.0);
                axis1.initializeCross(50.0);
                axis1.setPosition(nearV0);
                this.m_renderer.addEntity(axis1);
                axis1 = new Axis3DEntity();
                axis1.colorX.setRGB3f(1.0,0.0,1.0);
                axis1.colorY.setRGB3f(1.0,0.0,1.0);
                axis1.colorZ.setRGB3f(1.0,0.0,1.0);
                axis1.initializeCross(50.0);
                axis1.setPosition(nearV1);
                this.m_renderer.addEntity(axis1);
                axis1 = new Axis3DEntity();
                axis1.colorX.setRGB3f(0.0,1.0,1.0);
                axis1.colorY.setRGB3f(0.0,1.0,1.0);
                axis1.colorZ.setRGB3f(0.0,1.0,1.0);
                axis1.initializeCross(50.0);
                axis1.setPosition(nearV2);
                this.m_renderer.addEntity(axis1);
                /*
                let shpCV:Vector3D = new Vector3D(10.0,30.0,20.0);
                let radius:number = 250.0;
                let sphere:Sphere3DEntity = new Sphere3DEntity();
                sphere.initialize(radius,25,25,[tex1]);
                sphere.setPosition(shpCV);
                //sphere.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                this.m_renderer.addEntity(sphere);

                let pa:Vector3D = new Vector3D(300.0,100.0,300.0);
                let pb:Vector3D = new Vector3D(-100.0,-80.0,-600.0);
                let tv:Vector3D = new Vector3D();
                let outv:Vector3D = new Vector3D();
                let outv2:Vector3D = new Vector3D();
                tv.copyFrom(pb);
                tv.subtractBy(pa);
                tv.normalize();

                let ls:Line3DEntity = new Line3DEntity();
                ls.initialize(pa, pb);
                this.m_renderer.addEntity(ls);


                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                axis.setXYZ(0.0,-200.0,0.0);
                this.m_renderer.addEntity(axis);
                
                let axisA:Axis3DEntity = new Axis3DEntity();
                axisA.initialize(180.0);
                axisA.setXYZ(0.0, 0.0, 0.0);
                this.m_renderer.addEntity(axisA);
                
                let axisB:Axis3DEntity = new Axis3DEntity();
                axisB.initializeCross(80.0);
                axisB.setXYZ(0.0, 0.0, 0.0);
                this.m_renderer.addEntity(axisB);
                
                Sphere.IntersectionTwoRLByV2(pa,tv,shpCV,radius,outv,outv2);
                axisA.setPosition(outv);
                axisA.update();
                console.log("outv: "+outv.toString());

                axisB.setPosition(outv2);
                axisB.update();
                console.log("outv2: "+outv2.toString());
                //*/
                /*
                Sphere.IntersectionRLByV2(pa,tv,shpCV,radius,outv);
                axisA.setPosition(outv);
                axisA.update();
                console.log("outv: "+outv.toString());

                tv.negate();
                Sphere.IntersectionRLByV2(pb,tv,shpCV,radius,outv);
                axisB.setPosition(outv);
                axisB.update();
                console.log("outv: "+outv.toString());
                //*/
                

            }
        }
        testReflect():void
        {

            let nv:Vector3D = new Vector3D(1.0,1.0,0.5);
            nv.normalize();

            let v0:Vector3D = new Vector3D(-50.0,250.0,-30.0);
            let v1:Vector3D = new Vector3D(0.0,0.0,0.0);
            let rv:Vector3D = v1.subtract(v0);
            rv.normalize();
            ///let rv:Vector3D = new Vector3D(0.0,-1.0,0.0);
            console.log("iv: "+rv);
            console.log("nv: "+nv);
            rv.reflectBy(nv);

            console.log("rv: "+rv+", nv: "+nv);
            let line:Line3DEntity = new Line3DEntity();
            line.color.setRGB3f(1.0,0.0,1.0);
            rv.scaleBy(250.0);
            line.initialize(new Vector3D(0.0,0.0,0.0), rv);
            this.m_renderer.addEntity(line);

            line = new Line3DEntity();
            line.color.setRGB3f(1.0,1.0,1.0);
            line.initialize(new Vector3D(0.0,0.0,0.0), v0);
            this.m_renderer.addEntity(line);

            line = new Line3DEntity();
            line.color.setRGB3f(0.0,0.0,0.0);
            nv.scaleBy(250.0);
            line.initialize(new Vector3D(0.0,0.0,0.0), nv);
            this.m_renderer.addEntity(line);
        }
        run():void
        {
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();

            //console.log("#---  end");
        }
    }
}