

export default class MeshBufferLoader
{
    private m_info:string = "";
    private m_buffer:ArrayBuffer = null;
    private m_loadStatus:number = 0;
    paramSuffix: string = ".pmd"
    constructor()
    {
    }
    load(purl:string, callback: (buf: ArrayBuffer, param:string) => void):void
    {
        let selfT:MeshBufferLoader = this;
        //let si:number = purl.lastIndexOf("/");
        let si:number = purl.lastIndexOf(".");
        let infoUrl:string = purl.slice(0,si) + this.paramSuffix;
        //console.log("infoUrl: "+infoUrl);
        this.loadParam(infoUrl, callback);
        const reader = new FileReader();
        reader.onload = e => {
            ++selfT.m_loadStatus;
            selfT.m_buffer = <ArrayBuffer>reader.result;
            if(selfT.m_loadStatus > 1)
            {
                callback(selfT.m_buffer, selfT.m_info);
            }
        };
        const request = new XMLHttpRequest();
        request.open("GET", purl, true);
        request.responseType = "blob";
        request.onload = () => {
            reader.readAsArrayBuffer(request.response);
        };
        request.send();
    }
    private loadParam(purl:string, callback: (buf: ArrayBuffer, param:string) => void):void
    {
        let selfT:MeshBufferLoader = this;
        let pr:any = new XMLHttpRequest();
        pr.open('GET', purl);
        pr.onload = function(p:any):void
        {
            ++selfT.m_loadStatus;
            selfT.m_info = pr.responseText;
            if(selfT.m_loadStatus > 1)
            {
                callback(selfT.m_buffer, selfT.m_info);
            }
        }
        pr.send();
    }
}