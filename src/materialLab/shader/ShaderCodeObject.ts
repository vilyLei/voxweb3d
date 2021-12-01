import IShaderCodeObject from "../../vox/material/IShaderCodeObject";

class ShaderCodeObject implements IShaderCodeObject{

    vert: string = "";
    vert_head: string = "";
    vert_body: string = "";
    frag: string = "";
    frag_head: string = "";
    frag_body: string = "";
    
    uuid: string = "";

    constructor() { }
}
export { ShaderCodeObject };