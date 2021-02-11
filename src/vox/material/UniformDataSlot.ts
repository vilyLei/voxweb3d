
export namespace vox
{
    export namespace material
    {
        export class UniformDataSlot
        {
            constructor()
            {
            }
            static SlotList:UniformDataSlot[] = [new UniformDataSlot(), new UniformDataSlot(), new UniformDataSlot(), new UniformDataSlot()];
            private m_total:number = 256;
            index:number = 0;
            dataList:Float32Array[] = [];
            flagList:Uint16Array = null;
            static GetSlotAt(i:number):UniformDataSlot
            {
                return UniformDataSlot.SlotList[i];
            }
            static Initialize(rcuid:number):void
            {
                var slot:UniformDataSlot = UniformDataSlot.SlotList[rcuid];
                if(slot.flagList == null)
                {
                    //console.log("UniformDataSlot::Initialize()...");
                    var i:number = 0;
                    for(var k:number = 0; k < UniformDataSlot.SlotList.length; ++k)
                    {
                        slot = UniformDataSlot.SlotList[k];
                        slot.flagList = new Uint16Array(slot.m_total);
                        for(i = 0; i < slot.m_total; ++i)
                        {
                            slot.dataList.push(null);
                            slot.flagList[i] = 0;
                        }
                    }
                }
            }
        }
    }
}
