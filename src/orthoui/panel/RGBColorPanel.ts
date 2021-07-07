
import MouseEvent from "../../vox/event/MouseEvent";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import DullButton from "../button/DullButton";
import Color4 from "../../vox/material/Color4";
import Line3DEntity from "../../vox/entity/Line3DEntity";

export default class RGBColorPanel extends DisplayEntityContainer
{
    constructor()
    {
        super();
    }
    
    private m_width:number = 100.0;
    private m_height:number = 100.0;
    private m_posZ:number = 0.0;
    private m_colors: Color4[] = null;
    private m_selectColorGrid: DullButton = null;
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

        let startX: number = 2.0;
        let startY: number = 2.0;
        
        this.m_selectColorGrid = new DullButton();
        this.m_selectColorGrid.initialize(0,0, 64, 64);
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
            }
        }

        let rectLine:Line3DEntity = new Line3DEntity();
        rectLine.initializeRectXOY(0,0, cn * size + 4, rn * size + 4);
        this.addEntity(rectLine);
    }
    private gridMouseDown(evt: any): void {
        //console.log("gridMouseDown(), evt.target.index: ",evt.target.index);
        console.log("gridMouseDown(), color: ",this.m_colors[evt.target.index] );
        this.m_selectColorGrid.setRGBColor(this.m_colors[evt.target.index]);
        
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