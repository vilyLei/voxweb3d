
import MouseEvent from "../../vox/event/MouseEvent";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import DullButton from "../button/DullButton";
import Color4 from "../../vox/material/Color4";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import Vector3D from "../../vox/math/Vector3D";

export default class RGBColorPanel extends DisplayEntityContainer
{
    constructor()
    {
        super();
    }
    
    private m_width:number = 100.0;
    private m_height:number = 100.0;
    private m_posZ:number = 0.0;
    private m_rn:number = 0.0;
    private m_colors: Color4[] = null;
    private m_selectColorGrid: DullButton = null;
    private m_selectFrame: Line3DEntity = null;
    uuid: string = "RGBColorPanel";

    initialize(gridSize: number, total: number): void {
        total = 4;

        let srcGrid: DullButton = new DullButton();
        srcGrid.initialize(0,0, gridSize, gridSize);
        let dis: number = 1;
        let size: number = dis + gridSize;
        let grid: DullButton = null;
        let px: number;
        let py: number;
        let rn: number = 8;
        let cn: number = 8;// * total;
        let index: number = 0;
        let pr: number;
        let pg: number;
        let pb: number;
        this.m_rn = rn;

        let startX: number = 0.0;
        let startY: number = 0.0;
        
        this.m_selectColorGrid = new DullButton();
        this.m_selectColorGrid.initialize(0,0, gridSize, gridSize);
        this.m_selectColorGrid.copyMeshFrom(srcGrid);
        this.m_selectColorGrid.setScaleXYZ(2.0,2.0,1.0);
        this.m_selectColorGrid.setXY(startX, startY + rn * size);
        //pgrid.setRGB3f(1.0,0.0,0.333);
        this.addEntity(this.m_selectColorGrid);

        this.m_colors = new Array(total * total * total);
        for(let i: number = 0; i < total; ++i) {
            pr = i/(total - 1.0);
            for(let j: number = 0; j < total; ++j) {
                pg = j/(total - 1.0);
                for(let k: number = 0; k < total; ++k) {
                    pb = k/(total - 1.0);
                    this.m_colors[index] = new Color4(pr,pg,pb,1.0);
                    index ++;
                }
            }
        }
        console.log("this.m_colors: ",this.m_colors);
        index = 0;
        for(let i: number = 0; i < rn; ++i) {
            py = i * size;
            for(let j: number = 0; j < cn; ++j) {
                
                px = j * size;
                grid = new DullButton();
                grid.copyMeshFrom(srcGrid);
                grid.initialize(0,0, gridSize, gridSize);
                grid.setRGBColor(this.m_colors[index]);
                grid.setXY(startX + px, startY + py);
                this.addEntity(grid);
                grid.index = index ++;
                grid.addEventListener(MouseEvent.MOUSE_DOWN, this, this.gridMouseDown);
                //grid.addEventListener(MouseEvent.MOUSE_OVER, this, this.gridMouseOver);
            }
        }

        this.m_selectFrame = new Line3DEntity();
        this.m_selectFrame.dynColorEnabled = true;
        this.m_selectFrame.initializeRectXOY(1,1, gridSize - 2, gridSize - 2);
        this.m_selectFrame.setXYZ(0.0,0.0,0.1);
        this.addEntity(this.m_selectFrame);
        this.m_selectFrame.setVisible(false);
    }
    private gridMouseOver(evt: any): void {

    }
    private m_pv: Vector3D = new Vector3D();
    private gridMouseDown(evt: any): void {
        this.m_selectFrame.setVisible(true);
        evt.target.getPosition(this.m_pv);
        this.m_pv.z = 0.1;
        this.m_selectFrame.setPosition(this.m_pv);
        this.m_selectFrame.update();
        let color: Color4 = this.m_colors[evt.target.index];
        
        let pr: number = 1.5 * (1.0 - color.r);//, Math.abs(0.0 - color.r));
        let pg: number = 1.5 * (1.0 - color.g);//, Math.abs(0.0 - color.g));
        let pb: number = 1.5 * (1.0 - color.b);//, Math.abs(0.0 - color.b));

        (this.m_selectFrame.getMaterial() as any).setRGB3f(pr,pg,pb);
        this.m_selectColorGrid.setRGBColor(color);
        
    }
    setXY(px:number,py:number):void
    {
        super.setXYZ(px,py,this.m_posZ);
        this.update();
    }
    setXYZ(px:number,py:number,pz:number):void
    {
        this.m_posZ = pz;
        super.setXYZ(px,py,pz);
        this.update();
    }
    getWidth():number
    {
        return this.m_width;
    }
    getHeight():number
    {
        return this.m_height;
    }
    destory():void
    {
        super.destroy();
    }
    toString():string
    {
        return "[RGBColorPanel]";
    }
}