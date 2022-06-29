
class TaskCodeModuleParam {
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
    constructor(url: string, name: string, type: string = "js_text"){
        this.url = url;
        this.name = name;
        this.type = type;
    }

}

export { TaskCodeModuleParam };
