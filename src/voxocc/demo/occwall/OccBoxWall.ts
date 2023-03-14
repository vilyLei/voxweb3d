
import Vector3D from "../../../vox/math/Vector3D";
import TextureProxy from "../../../vox/texture/TextureProxy";
import RendererScene from "../../../vox/scene/RendererScene";

import Box3DEntity from "../../../vox/entity/Box3DEntity";
import BoxFrame3D from "../../../vox/entity/BoxFrame3D";
import { QuadHolePOV } from "../../../voxocc/occlusion/QuadHolePOV";
import { BoxFarFacePOV } from "../../../voxocc/occlusion/BoxFarFacePOV";
import IRendererSpace from "../../../vox/scene/IRendererSpace";
import SpaceCullingor from "../../../vox/scene/SpaceCullingor";
import { SpaceCullingMask } from "../../../vox/space/SpaceCullingMask";

class OccBoxWall {
    constructor() {
    }
    private m_rscene: RendererScene = null;
    private m_rspace: IRendererSpace = null;
    private m_texList: TextureProxy[] = null;
    private m_cullingor: SpaceCullingor = null;
    initialize(rscene: RendererScene, cullingor: SpaceCullingor, texList: TextureProxy[]): void {
        this.m_rscene = rscene;
        this.m_cullingor = cullingor;
        this.m_texList = texList;
        this.m_rspace = this.m_rscene.getSpace();

    }
    // gapList 的数据按照 r,c 的方式来 也就是对应着 y, x
    createXOYWall(pv: Vector3D, sizeV: Vector3D, rn: number, cn: number, gapList: number[], gapSizeList: number[], texId: number, pr: number, pc: number): void {
        let cullingor = this.m_cullingor;
        let i = 0;
        let j = 0;
        let pV = new Vector3D(0.0, 0.0, 0.0);
        let minV = new Vector3D();
        //let sizeV:Vector3D = new Vector3D(300.0,350.0,250.0);
        //let sizeV:Vector3D = new Vector3D(300.0,350.0,250.0);
        let texList: TextureProxy[] = [this.m_texList[texId]];
        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.initialize(minV, sizeV, texList);
        let box: Box3DEntity = null;
        let boxList: Box3DEntity[] = [];
        let tpv: Vector3D = new Vector3D();
        let startX: number = pv.x;// - 2.0 * sizeV.x;
        let startY: number = pv.y;// - 2.0 * sizeV.y;
        let startZ: number = pv.z;
        pV.z = startZ;
        for (; i < rn; ++i) {
            pV.y = startY + i * sizeV.y;
            for (j = 0; j < cn; ++j) {
                pV.x = startX + j * sizeV.x;
                box = new Box3DEntity();
                box.setMesh(srcBox.getMesh());
                box.initialize(minV, sizeV, texList);
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
        let ki: number = 0;
        let kj = 0;
        let len = gapList.length;
        let pcn = 0;
        let prn = 0;
        let povGaps: QuadHolePOV[] = [];
        for (; len > 0;) {
            i = gapList[len - 2];
            j = gapList[len - 1];
            subMinV.x = startX + j * sizeV.x;
            subMinV.y = startY + i * sizeV.y;
            subMinV.z = startZ;
            prn = gapSizeList[len - 2];
            pcn = gapSizeList[len - 1];
            subMaxV.x = subMinV.x + sizeV.x * pcn;
            subMaxV.y = subMinV.y + sizeV.y * prn;
            subMaxV.z = subMinV.z + sizeV.z;
            //gapSizeList
            kj = j;
            prn += i;
            pcn += j;
            for (; i < prn; ++i) {
                for (j = kj; j < pcn; ++j) {
                    k = i * cn + j;
                    boxList[k].setVisible(false);
                }
            }
            //k = i * cn + j;
            //boxList[k].setVisible(false);

            let quadHolePOV: QuadHolePOV = new QuadHolePOV();
            quadHolePOV.setCamPosition(this.m_rscene.getCamera().getPosition());
            quadHolePOV.setParamFromeBoxFaceZ(subMinV, subMaxV);
            quadHolePOV.updateOccData();
            povGaps.push(quadHolePOV);

            len -= 2;
        }
        let boxMinV = new Vector3D(startX, startY, startZ);
        let boxMaxV = new Vector3D(startX + cn * sizeV.x, startY + rn * sizeV.y, startZ + sizeV.z);
        let boxFrame = new BoxFrame3D();
        boxFrame.initialize(boxMinV, boxMaxV);
        boxFrame.setScaleXYZ(1.01, 1.01, 1.01);
        this.m_rscene.addEntity(boxFrame);
        
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

    // gapList 的数据按照 r,c 的方式来 也就是对应着 y, z
    createZOYWall(pv: Vector3D, sizeV: Vector3D, rn: number, cn: number, gapList: number[], gapSizeList: number[], texId: number, pr: number, pc: number): void {
        let cullingor: SpaceCullingor = this.m_cullingor;
        let i: number = 0;
        let j: number = 0;
        let pV: Vector3D = new Vector3D(0.0, 0.0, 0.0);
        let minV: Vector3D = new Vector3D();
        let texList: TextureProxy[] = [this.m_texList[texId]];
        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.initialize(minV, sizeV, texList);
        let box: Box3DEntity = null;
        let boxList: Box3DEntity[] = [];

        let startX: number = pv.x;
        let startY: number = pv.y;// - 2.0 * sizeV.y;
        let startZ: number = pv.z;// - 2.0 * sizeV.z;
        pV.x = startX;
        for (; i < rn; ++i) {
            pV.y = startY + i * sizeV.y;
            for (j = 0; j < cn; ++j) {
                pV.z = startZ + j * sizeV.z;
                box = new Box3DEntity();
                box.setMesh(srcBox.getMesh());
                box.initialize(minV, sizeV, texList);
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
        let subMinV: Vector3D = new Vector3D();
        let subMaxV: Vector3D = new Vector3D();
        let k: number = 0;
        let ki: number = 0;
        let kj: number = 0;
        let len: number = gapList.length;
        let pcn: number = 0;
        let prn: number = 0;
        let povGaps: QuadHolePOV[] = [];
        for (; len > 0;) {
            i = gapList[len - 2];
            j = gapList[len - 1];
            subMinV.x = startX;
            subMinV.y = startY + i * sizeV.y;
            subMinV.z = startZ + j * sizeV.z;
            prn = gapSizeList[len - 2];
            pcn = gapSizeList[len - 1];
            subMaxV.x = subMinV.x + sizeV.x;
            subMaxV.y = subMinV.y + sizeV.y * prn;
            subMaxV.z = subMinV.z + sizeV.z * pcn;

            kj = j;
            prn += i;
            pcn += j;
            for (; i < prn; ++i) {
                for (j = kj; j < pcn; ++j) {
                    k = i * cn + j;
                    boxList[k].setVisible(false);
                }
            }

            let quadHolePOV: QuadHolePOV = new QuadHolePOV();
            quadHolePOV.setCamPosition(this.m_rscene.getCamera().getPosition());
            quadHolePOV.setParamFromeBoxFaceX(subMinV, subMaxV);
            quadHolePOV.updateOccData();
            povGaps.push(quadHolePOV);

            //  let boxFrame:BoxFrame3D = new BoxFrame3D();
            //  boxFrame.initialize(subMinV,subMaxV);
            //  boxFrame.setScaleXYZ(1.01,1.01,1.01);
            //  this.m_rscene.addEntity(boxFrame);

            len -= 2;
        }
        let boxMinV: Vector3D = new Vector3D(startX, startY, startZ);
        let boxMaxV: Vector3D = new Vector3D(startX + sizeV.x, startY + rn * sizeV.y, startZ + cn * sizeV.z);
        let boxFrame: BoxFrame3D = new BoxFrame3D();
        boxFrame.initialize(boxMinV, boxMaxV);
        boxFrame.setScaleXYZ(1.01, 1.01, 1.01);
        this.m_rscene.addEntity(boxFrame);
        let wallOcc0: BoxFarFacePOV = new BoxFarFacePOV();
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
}
export { OccBoxWall };