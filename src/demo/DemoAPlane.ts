import * as RendererParamT from "../vox/scene/RendererParam";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as ImageTextureProxyT from "../vox/texture/ImageTextureProxy";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";

import RendererParam = RendererParamT.vox.scene.RendererParam;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    /**
     * a 3d rectangle plane display example
     */
    export class DemoAPlane
    {
        constructor(){}
        
        private m_rscene:RendererScene = null;
        private m_camTrack:CameraTrack = null;

        initialize():void
        {
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(new RendererParam(),3);
            this.m_rscene.updateCamera();
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            
            this.createPlane();
        }
        private createPlane():void
        {
            let rscene:RendererScene = this.m_rscene;
            let img:HTMLImageElement = new Image();
            img.onload = function(evt:any):void
            {
                let tex:ImageTextureProxy = rscene.textureBlock.createImageTex2D(img.width, img.height);
                tex.setDataFromImage(img);

                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
                rscene.addEntity(plane);
            }
            img.src = "static/assets/yanj.jpg";
        }
        run():void
        {
            this.m_rscene.run();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}