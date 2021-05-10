
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import StraightLine from "../../vox/geom/StraightLine";
import DisplayEntity from "../../vox/entity/DisplayEntity";

export default class AxisDragController
{
    private m_axis_pv:Vector3D = new Vector3D();
    private m_axis_tv:Vector3D = new Vector3D();
    private m_initPos:Vector3D = new Vector3D();
    private m_pos:Vector3D = new Vector3D();
    private m_dv:Vector3D = new Vector3D();
    private m_outV:Vector3D = new Vector3D();
    private m_initV:Vector3D = new Vector3D();
    private m_flag:number = -1;
    private m_mat4:Matrix4 = new Matrix4();
    private m_invMat4:Matrix4 = new Matrix4();
    private m_rpv:Vector3D = new Vector3D();
    private m_rtv:Vector3D = new Vector3D();

    private m_targetEntity:DisplayEntity = null;
    constructor()
    {
    }
    bindTarget(target:DisplayEntity):void
    {
        this.m_targetEntity = target;
    }
    private calcClosePos(rpv:Vector3D,rtv:Vector3D):void
    {
        this.m_invMat4.transformVector3Self(rpv);
        this.m_invMat4.deltaTransformVectorSelf(rtv);
        StraightLine.CalcTwoSLCloseV2(rpv,rtv, this.m_axis_pv,this.m_axis_tv,this.m_outV);
        this.m_mat4.transformVector3Self(this.m_outV);
    }
    public updateDrag(rpv:Vector3D,rtv:Vector3D):void
    {
        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);
        
        this.calcClosePos(this.m_rpv,this.m_rtv);

        this.m_dv.copyFrom(this.m_outV);
        this.m_dv.subtractBy(this.m_initV);
        this.m_pos.copyFrom(this.m_initPos);
        this.m_pos.addBy(this.m_dv);
        if(this.m_targetEntity != null)
        {
            this.m_targetEntity.setPosition(this.m_pos);
            this.m_targetEntity.update();
        }
    }
    public dragBegin(lpos:Vector3D,rpv:Vector3D,rtv:Vector3D):void
    {
        let px:number = Math.abs(lpos.x);
        let py:number = Math.abs(lpos.y);
        let pz:number = Math.abs(lpos.z);
        let flag:number = -1;
        if(px > py)
        {
            if(px < pz)
            {
                // z axis
                flag = 2;
            }
            else
            {
                // x axis
                flag = 0;
            }
        }
        else
        {
            if(py < pz)
            {
                // z axis
                flag = 2;
            }
            else
            {
                // y axis
                flag = 1;
            }
        }
        this.m_flag = flag;
        if(this.m_flag > -1)
        {
            switch(this.m_flag)
            {
                case 0:
                    // x axis
                    this.m_axis_tv.setXYZ(1.0,0.0,0.0);
                    break;
                case 1:
                    // y axis
                    this.m_axis_tv.setXYZ(0.0,1.0,0.0);
                    break;
                case 2:
                    // z axis
                    this.m_axis_tv.setXYZ(0.0,0.0,1.0);        
                    break;
                default:
                    break;        
            }
        }
        // console.log("AxisCtrlObj::mouseDownListener(). this.m_flag: "+this.m_flag);
        
        this.m_mat4.copyFrom(this.m_targetEntity.getTransform().getMatrix());
        this.m_invMat4.copyFrom(this.m_targetEntity.getTransform().getInvMatrix());

        this.m_rpv.copyFrom(rpv);
        this.m_rtv.copyFrom(rtv);

        this.calcClosePos(this.m_rpv, this.m_rtv);
        this.m_initV.copyFrom( this.m_outV );
        this.m_targetEntity.getPosition(this.m_initPos);
    }
    public getPosition():Vector3D
    {
        return this.m_pos;
    }
}