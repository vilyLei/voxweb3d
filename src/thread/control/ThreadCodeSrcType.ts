/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
enum ThreadCodeSrcType {

    /**
     * the task code come from a string object
     */
    STRING_CODE = 0,
    /**
     * the task code come from a code blob object
     */
    BLOB_CODE = 1,
    /**
     * the task code come from a external js file, this is the best way
     */
    JS_FILE_CODE = 2
}

export { ThreadCodeSrcType };