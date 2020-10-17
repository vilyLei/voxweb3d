/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MaterialConstT from "../../vox/material/MaterialConst";
import * as RenderDataSlotT from "../../vox/material/RenderDataSlot";

import MaterialConst = MaterialConstT.vox.material.MaterialConst;
import RenderDataSlot = RenderDataSlotT.vox.material.RenderDataSlot;

export namespace vox
{
    export namespace material
    {
        export class ShaderUniformProbe
        {
            constructor()
            {
            }
            private m_slot:RenderDataSlot = null;
            private m_fsList:Float32Array[] = null;
            private m_fsIndex:number = 0;
            rst:number = -1;
            uniformSlotId:number = 0;
            uniformSlotIndex:number = -1;
            uniformSlotSize:number = 0;
            // array -> [SHADER_MAT4, SHADER_VEC3]
            uniformTypes:number[] = null;
            // array -> [1, 3], the "3" is uniform Array,length is 3
            dataSizeList:number[] = null;
            getFS32At(i:number):Float32Array
            {
                return this.m_fsList[i];
            }
            setFS32At(fs32:Float32Array, i:number):void
            {
                this.m_fsList[i] = fs32;
            }
            setVec4DataAt(index:number, f0:number,f1:number,f2:number,f3:number):void
            {
                let fs:Float32Array = this.m_fsList[index];
                fs[0] = f0;
                fs[1] = f1;
                fs[2] = f2;
                fs[3] = f3;
            }
            setVec4Data(f0:number,f1:number,f2:number,f3:number):void
            {
                let fs:Float32Array = this.m_fsList[0];
                fs[0] = f0;
                fs[1] = f1;
                fs[2] = f2;
                fs[3] = f3;
            }
            setVec4DataAtWithArr4(index:number, arr4:number[]):void
            {
                this.m_fsList[index].set(arr4,0);
            }
            setVec4DataWithArr4(arr4:number[]):void
            {
                this.m_fsList[0].set(arr4,0);
            }
            addVec4Data(f32:Float32Array,vec4Total:number):void
            {
                this.m_fsList.push(f32);
                this.uniformTypes.push(MaterialConst.SHADER_VEC4);
                this.dataSizeList.push(vec4Total);
                this.m_slot.dataList[this.m_fsIndex] = f32;
                this.m_fsIndex++;
                this.uniformSlotSize++;
                this.m_slot.index ++;
            }
            addMat4Data(f32:Float32Array,mat4Total:number):void
            {
                this.m_fsList.push(f32);
                this.uniformTypes.push(MaterialConst.SHADER_MAT4);
                this.dataSizeList.push(mat4Total);
                this.m_slot.dataList[this.m_fsIndex] = f32;
                this.m_fsIndex++;
                this.uniformSlotSize++;
                this.m_slot.index ++;
            }
            isEnabled():boolean
            {
                return this.rst >= 0;
            }
            bindSlotAt(i:number):void
            {
                let slot:RenderDataSlot = RenderDataSlot.GetSlotAt(i);
                if(this.rst >= 0)
                {
                    this.reset();
                }
                if(this.m_fsList == null)
                {
                    this.m_fsList = [];
                    this.uniformTypes = [];
                    this.dataSizeList = [];
                }
                this.m_slot = slot;
                this.rst = 1;
                //
                this.uniformSlotIndex = slot.index;
                this.m_fsIndex = slot.index;
            }
            update():void
            {
                if(this.rst > 0xffffff) this.rst = Math.round(Math.random() * 1000) + 100;
                this.rst++;
                if(this.uniformSlotSize < 2)
                {
                    this.m_slot.flagList[this.uniformSlotIndex] = this.rst;
                }
                else
                {
                    for(let i:number = 0; i < this.uniformSlotSize; ++i)
                    {
                        this.m_slot.flagList[this.uniformSlotIndex + i] = this.rst;
                    }
                }
            }
            reset():void
            {
                this.rst = -1;
                this.uniformSlotId = 0;
                this.uniformSlotIndex = -1;
                this.uniformSlotSize = 0;
                this.m_fsIndex = 0;
                if(this.m_fsList != null)
                {
                    this.m_fsList = null;
                    this.uniformTypes = null;
                    this.dataSizeList = null;
                }
                this.m_slot = null;
            }
            destroy():void
            {
                this.reset();
            }
        }
    }
}
