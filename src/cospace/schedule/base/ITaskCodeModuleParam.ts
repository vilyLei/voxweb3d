
interface ITaskCodeModuleParam {
    /**
     * task module js file url
     */
    url: string;
    /**
     * task module name
     */
    name: string;
    /**
     * file data type(js text, binary data)
     */
    type: string;
    
    params?: (string | number)[];
}

export { ITaskCodeModuleParam };
