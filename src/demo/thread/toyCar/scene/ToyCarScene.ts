import Plane3DEntity from "../../../../vox/entity/Plane3DEntity";
import Box3DEntity from "../../../../vox/entity/Box3DEntity";
import ImageTextureProxy from "../../../../vox/texture/ImageTextureProxy";
import RendererScene from "../../../../vox/scene/RendererScene";
import TextureProxy from "../../../../vox/texture/TextureProxy";
import {TextureConst} from "../../../../vox/texture/TextureConst";
import ImageTextureLoader from "../../../../vox/texture/ImageTextureLoader";
import Vector3D from "../../../../vox/math/Vector3D";
import Line3DEntity from "../../../../vox/entity/Line3DEntity";
import Axis3DEntity from "../../../../vox/entity/Axis3DEntity";

/**
 * a 3d rectangle plane display example
 */
class ToyCarScene {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader:ImageTextureLoader;
    getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
    {
        let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(scene: RendererScene, texLoader:ImageTextureLoader): void {
        if(this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_texLoader = texLoader;
            this.initTerrain();
        }
    }
    private initTerrain(): void {
        
        let terrData: Float32Array = new Float32Array(
            [
                0,0,0,0,0,0,
                0,0,1,1,0,0,
                0,0,0,0,0,0,
                0,0,0,1,0,0,
                0,0,0,1,0,0,
                0,0,0,0,0,0
            ]
        );
        
        let size: number = 40.0;
        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.initialize(new Vector3D(-size, 0, -size), new Vector3D(size, size * 2.0, size), [this.getImageTexByUrl("static/assets/default.jpg")]);
        size *= 2.0;
        let rn: number = 6;
        let cn: number = 6;
        let startPos: Vector3D = new Vector3D(cn * size * -0.5 + 0.5 * size, 0.0, rn * size * -0.5 + 0.5 * size);
        let pos: Vector3D = new Vector3D();
        for(let r: number = 0; r < rn; r++) {
            for(let c: number = 0; c < cn; c++) {
                pos.x = startPos.x + c * size;
                pos.y = startPos.y;
                pos.z = startPos.z + r * size;
                let flag: number = r * rn + c;
                flag = terrData[flag];
                let scale: number = flag > 0 ? 1.0 : 0.2
                let box: Box3DEntity = new Box3DEntity();
                box.copyMeshFrom( srcBox );
                if(flag > 0) {
                    box.initializeCube(50, [this.getImageTexByUrl("static/assets/box_wood01.jpg")]);
                    box.setXYZ( pos.x, pos.y + 16, pos.z );
                }
                else {
                    if(Math.random() > 0.5) {
                        box.initializeCube(50, [this.getImageTexByUrl("static/assets/moss_04.jpg")]);
                    }
                    else {
                        box.initializeCube(50, [this.getImageTexByUrl("static/assets/moss_03.jpg")]);
                    }
                    box.setPosition( pos );
                }
                box.setScaleXYZ(1.0, scale, 1.0);
                this.m_rscene.addEntity( box );
            }
        }

        //  let axis: Axis3DEntity = new Axis3DEntity();
        //  axis.initialize(50);
        //  axis.setXYZ(100,100,100);
        //  this.m_rscene.addEntity( axis );

        let pathList: number[] = [4, 4, 2, 4, 2, 1, 1, 1];
        let total: number = pathList.length / 2;
        //total = 0;
        let k: number = 0;
        for(let i: number = 0; i < total; ++i) {

            let r: number = pathList[k];
            let c: number = pathList[k + 1];
            pos.x = startPos.x + c * size;
            pos.y = startPos.y;
            pos.z = startPos.z + r * size;
            let ls: Line3DEntity = new Line3DEntity();
            ls.initializeRectXOZ(-15, -15, 30,30);
            ls.setXYZ(pos.x, pos.y + 21, pos.z);
            this.m_rscene.addEntity( ls );
            k += 2;
        }
    }

    run(): void {

    }
}
export {ToyCarScene}
