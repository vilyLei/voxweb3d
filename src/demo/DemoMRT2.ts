
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import FrameBufferType from "../vox/render/FrameBufferType";
import RenderAdapter from "../vox/render/RenderAdapter";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import DefaultMRTMaterial from "../vox/material/mcase/DefaultMRTMaterial";

import TextureBlock from "../vox/texture/TextureBlock";

//import DefaultMRTMaterial = DefaultMRTMaterialT.vox.material.mcase.DefaultMRTMaterial;

export namespace demo
{
    export class DemoMRT2
    {
        constructor()
        {
        }
        private m_texBlock:TextureBlock;
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        
        initialize():void
        {
            console.log("DemoMRT2::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;

                this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();

                this.m_texBlock = new TextureBlock();
                this.m_texBlock.setRenderer( this.m_renderer );
                this.m_texLoader = new ImageTextureLoader(this.m_texBlock);
                let tex0:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/fruit_01.jpg");
                let tex1:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/metal_08.jpg");
                let tex3:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/warter_01.jpg");
                let tex4:TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex3.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                tex4.setWrap(TextureConst.WRAP_REPEAT);
                tex4.mipmapEnabled = true;

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                // add common 3d display entity
                this.m_rcontext.createFBOAt(0,FrameBufferType.FRAMEBUFFER,this.m_rcontext.getViewportWidth(),this.m_rcontext.getViewportHeight(),true,false);
                this.m_rcontext.createFBOAt(1,FrameBufferType.FRAMEBUFFER,this.m_rcontext.getViewportWidth(),this.m_rcontext.getViewportHeight(),false,false);
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(new DefaultMRTMaterial());
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                //this.m_renderer.addEntity(plane);

                //  var plane2:Plane3DEntity = new Plane3DEntity();
                //  //plane2.setMaterial(new DefaultMRTMaterial());
                //  plane2.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex2]);
                //  plane2.setXYZ(0.0,100.0,0.0);
                //  this.m_renderer.addEntity(plane2,1);

                //  var plane3:Plane3DEntity = new Plane3DEntity();
                //  plane3.setMaterial(new DefaultMRTMaterial());
                //  plane3.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex3]);
                //  plane3.setXYZ(0.0,170.0,0.0);
                //  this.m_renderer.addEntity(plane3,3);


                let boxSize:number = 110.0;
                let box:Box3DEntity = new Box3DEntity();
                box.setMaterial(new DefaultMRTMaterial());
                box.initialize(new Vector3D(-boxSize,-boxSize - 80.0,-boxSize),new Vector3D(boxSize,boxSize + 80.0,boxSize),[tex1]);
                //this.m_renderer.addEntity(box);

                
                //  let axis:Axis3DEntity = new Axis3DEntity();
                //  axis.initialize(500.0);
                //  this.m_renderer.addEntity(axis, 4);

                //  let bill:Billboard3DEntity = new Billboard3DEntity();
                //  bill.initialize(200.0,200.0,[tex4]);
                //  bill.setXYZ(200.0,200.0,200.0);
                //  this.m_renderer.addEntity(bill,4);

                box = new Box3DEntity();
                //box.setMaterial(new DefaultMRTMaterial());
                box.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[tex4]);
                box.setScaleXYZ(0.5,0.5,0.5);
                box.setXYZ(100.0,100.0,100.0);
                this.m_renderer.addEntity(box,4);

                boxSize = 100.0;
                // add mrt texture 3d display entity
                let boxMrt0:Box3DEntity = new Box3DEntity();
                boxMrt0.name = "boxMrt0";
                boxMrt0.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[this.m_texBlock.getRTTTextureAt(0)]);
                boxMrt0.setXYZ(-150,0,-150);
                this.m_renderer.addEntity(boxMrt0, 2);
                let boxMrt1:Box3DEntity = new Box3DEntity();
                boxMrt1.name = "boxMrt1";
                boxMrt1.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[this.m_texBlock.getRTTTextureAt(1)]);
                boxMrt1.setXYZ(150,0,150);
                this.m_renderer.addEntity(boxMrt1, 2);
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            let rinstance:RendererInstance = this.m_renderer;
            let radapter:RenderAdapter = pcontext.getRenderAdapter();

            this.m_statusDisp.update();

            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.renderBegin();
            rinstance.update();

            pcontext.bindFBOAt(0,FrameBufferType.FRAMEBUFFER);
            // --------------------------------------------- mrt begin
            pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            radapter.synFBOSizeWithViewport();
            radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 1);
            radapter.useFBO(true, true, false);
            rinstance.runAt(0);
            // --------------------------------------------- mrt end
            //  radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            //  radapter.useFBO(false, false, false);
            //  rinstance.runAt(1);
            //  radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            //  radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 1);
            //  radapter.useFBO(false, false, false);
            //  rinstance.runAt(3);
            //  radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(0), true, false, 0);
            //  //radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(1), true, false, 1);
            //  radapter.useFBO(false, false, false);
            //  //radapter.useFBO(true, true, false);
            //  rinstance.runAt(4);
            /*
            pcontext.bindFBOAt(1,FrameBufferType.FRAMEBUFFER);
            radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(2), false, false, 0);
            radapter.setRenderToTexture(this.m_texBlock.getRTTTextureAt(3), false, false, 1);
            radapter.useFBO(true, true, false);
            rinstance.runAt(5);
            // -------------------------------------------------------
            //*/
            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            radapter.setRenderToBackBuffer();
            rinstance.runAt(2);


            pcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            pcontext.updateCamera();
        }
    }
}