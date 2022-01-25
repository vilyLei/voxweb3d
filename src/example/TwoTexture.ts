
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import RendererState from "../vox/render/RendererState";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import * as BaseTextureMaterialT from "./material/base/BaseTextureMaterial";
import * as TwoPngTexMaterialT from "./material/base/TwoPngTexMaterial";

import BaseTextureMaterial = BaseTextureMaterialT.example.material.base.BaseTextureMaterial;
import TwoPngTexMaterial = TwoPngTexMaterialT.example.material.base.TwoPngTexMaterial;

export namespace example
{
    export class TwoTexture
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = true;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("TwoTexture::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.getImageTexByUrl("static/pics/127_witheEdge.png");
                tex2.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                //tex2.magFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setAttriAntialias(true);
                rparam.setAttriAlpha(false);
                rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(500.0,500.0,500.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                this.m_statusDisp.initialize();

                /*
                let towMaterial:TwoPngTexMaterial = new TwoPngTexMaterial();
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setMaterial(towMaterial);
                plane.initializeXOZ(-150.0,-200.0,300.0,400.0,[tex1,tex2]);
                //plane.setScaleXYZ(0.2,0.2,0.2);
                this.m_rscene.addEntity(plane);
                //*/
                ///*
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
                plane.initializeXOZ(-150.0,-200.0,300.0,400.0,[tex1]);
                let material:any = plane.getMaterial();
                material.setRGB3f(0.2,0.2,0.2);
                plane.setXYZ(0,-10,0);
                //plane.setScaleXYZ(0.2,0.2,0.2);
                this.m_rscene.addEntity(plane);

                // add common 3d display entity
                plane = new Plane3DEntity();
                plane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
                plane.initializeXOZ(-150.0,-200.0,300.0,400.0,[tex2]);
                //plane.setScaleXYZ(0.2,0.2,0.2);
                this.m_rscene.addEntity(plane,1);
                //*/
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                let box:Box3DEntity = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_rscene.addEntity(box);

            }
        }
        run():void
        {
            // show fps status
            this.m_statusDisp.update();
            this.m_rscene.run();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}