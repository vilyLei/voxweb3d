interface IShaderCodeUUID {

}
/**
 * IShaderCodeObject instance uuid
 */
enum ShaderCodeUUID {
    /**
     * nothing shader code object
     */
    None = "",
    /**
     * the default value is PBR light shader code object that it comes from the system shader lib.
     */
    Default = "pbr",
    /**
     * lambert light shader code object that it comes from the system shader lib.
     */
    Lambert = "lambert",
    /**
     * PBR light shader code object that it comes from the system shader lib.
     */
    PBR = "pbr"
}

export { ShaderCodeUUID };