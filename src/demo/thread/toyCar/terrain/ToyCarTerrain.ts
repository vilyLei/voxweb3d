import Box3DEntity from "../../../../vox/entity/Box3DEntity";
import RendererScene from "../../../../vox/scene/RendererScene";
import TextureProxy from "../../../../vox/texture/TextureProxy";
import { TextureConst } from "../../../../vox/texture/TextureConst";
import ImageTextureLoader from "../../../../vox/texture/ImageTextureLoader";
import Vector3D from "../../../../vox/math/Vector3D";
import Line3DEntity from "../../../../vox/entity/Line3DEntity";
import {TerrainData} from "./TerrainData";
import Axis3DEntity from "../../../../vox/entity/Axis3DEntity";

class ToyCarTerrain {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_terrainData: TerrainData;
    
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(scene: RendererScene, texLoader: ImageTextureLoader, terrainData: TerrainData): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_texLoader = texLoader;
            this.m_terrainData = terrainData;
            
            this.initTerrain();
        }
    }
    
    private initTerrain(): void {

        let size: number = this.m_terrainData.gridSize;
        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.initialize(new Vector3D(-size * 0.5, 0, -size * 0.5), new Vector3D(size * 0.5, size, size * 0.5), [this.getImageTexByUrl("static/assets/default.jpg")]);

        let rn: number = this.m_terrainData.rn;
        let cn: number = this.m_terrainData.cn;
        let pos: Vector3D = new Vector3D();
        let pv: Vector3D;
        for (let r: number = 0; r < rn; r++) {
            for (let c: number = 0; c < cn; c++) {
                pv = this.m_terrainData.getGridPositionByRC(r,c);
                let flag: number = this.m_terrainData.getGridStatusByRC(r, c);
                let scale: number = flag > 0 ? 0.3 : 0.2;
                let box: Box3DEntity = new Box3DEntity();
                box.copyMeshFrom(srcBox);
                if (flag > 0) {
                    box.initializeCube(50, [this.getImageTexByUrl("static/assets/box_wood01.jpg")]);
                    box.setXYZ(pv.x, pv.y + 0.8 * size * 0.2, pv.z);
                }
                else {
                    if (Math.random() > 0.5) {
                        box.initializeCube(50, [this.getImageTexByUrl("static/assets/moss_01.jpg")]);
                    }
                    else {
                        box.initializeCube(50, [this.getImageTexByUrl("static/assets/moss_03.jpg")]);
                    }
                    box.setPosition(pv);
                }
                box.setScaleXYZ(1.0, scale, 1.0);
                (box.getMaterial() as any).setRGB3f(0.0 + 1.5 * c/cn, 1.0, 0.0 + 1.5 * r/rn);
                this.m_rscene.addEntity(box);
            }
        }

        return;
        pv = this.m_terrainData.getGridPositionByRC(0,2);
        pv.y += 30.0;
        let beginAxis: Axis3DEntity = new Axis3DEntity();
        beginAxis.initializeCross(50);
        beginAxis.setPosition(pv);
        this.m_rscene.addEntity( beginAxis );

        //let pathList: number[] = [4, 4, 2, 4, 2, 1, 1, 1];
        //let pathList: number[] = [4, 4, 2, 4, 2, 1, 1, 1, 0, 0];
        let pathList: number[] = [0, 4, 2, 4, 2, 2, 3, 1];
        let total: number = pathList.length / 2;
        //total = 0;
        let k: number = 0;
        for (let i: number = 0; i < total; ++i) {

            let r: number = pathList[k];
            let c: number = pathList[k + 1];
            // pos.x = startPos.x + c * size;
            // pos.y = startPos.y;
            // pos.z = startPos.z + r * size;
            pv = this.m_terrainData.getGridPositionByRC(pathList[k], pathList[k+1]);
            let ls: Line3DEntity = new Line3DEntity();
            ls.initializeRectXOZ(-15, -15, 30, 30);
            //ls.setXYZ(pos.x, pos.y + 21, pos.z);
            pv.y += 21;
            ls.setPosition( pv );
            this.m_rscene.addEntity(ls);
            k += 2;
        }
    }
    run(): void {

    }
}
export { ToyCarTerrain }
