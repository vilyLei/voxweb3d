
export namespace vox
{
    export namespace material
    {
        export class RenderDataSlot
        {
            constructor()
            {
            }
            static SlotList:RenderDataSlot[] = [new RenderDataSlot(), new RenderDataSlot(), new RenderDataSlot(), new RenderDataSlot()];
            private m_total:number = 256;
            index:number = 0;
            dataList:Float32Array[] = [];
            flagList:Uint16Array = null;
            static GetSlotAt(i:number):RenderDataSlot
            {
                return RenderDataSlot.SlotList[i];
            }
            static Initialize():void
            {
                var slot:RenderDataSlot = RenderDataSlot.SlotList[0];
                if(slot.flagList == null)
                {
                    //console.log("RenderDataSlot::Initialize()...");
                    var i:number = 0;
                    for(var k:number = 0; k < RenderDataSlot.SlotList.length; ++k)
                    {
                        slot = RenderDataSlot.SlotList[k];
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
