import { ThreadCodeSrcType } from "../control/ThreadCodeSrcType";
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系
 */
class TaskDependency {
    
    moduleName: string = "";
    threadCodeString?: string = "";
    threadCodeFileURL?: string = "";
    dependencyUniqueName?: string = "";
    threadCodeSrcType: ThreadCodeSrcType = ThreadCodeSrcType.JS_FILE_CODE;

    constructor() {
        
    }
    // toJSFile(): void {
    //     this.threadCodeFileURL = "";
    //     this.threadCodeSrcType = ThreadCodeSrcType.JS_FILE_CODE;
    // }
    // toDependency(): void {
    //     this.dependencyUniqueName = "";
    //     this.threadCodeSrcType = ThreadCodeSrcType.DEPENDENCY;
    // }
    // toCodeString(): void {
    //     this.threadCodeString = "";
    //     this.threadCodeSrcType = ThreadCodeSrcType.STRING_CODE;
    // }
    /**
     * @returns 如果是基于代码字符串初始化，则返回true
     */
    isCodeString(): boolean {
        return this.threadCodeSrcType == ThreadCodeSrcType.STRING_CODE;
    }
    /**
     * @returns 如果是基于外部js文件url初始化，则返回true
     */
    isJSFile(): boolean {
        return this.threadCodeSrcType == ThreadCodeSrcType.JS_FILE_CODE;
    }
    /**
     * @returns 如果是基于唯一依赖名初始化，则返回true
     */
    isDependency(): boolean {
        return this.threadCodeSrcType == ThreadCodeSrcType.DEPENDENCY;
    }
    isCodeBlob(): boolean {
        return this.threadCodeSrcType == ThreadCodeSrcType.BLOB_CODE;
    }
    clone(): TaskDependency {
        let td = new TaskDependency();
        if(this.isCodeString()) td.threadCodeString = this.threadCodeString;
        if(this.isJSFile()) td.threadCodeFileURL = this.threadCodeFileURL;
        if(this.isDependency()) td.dependencyUniqueName = this.dependencyUniqueName;
        // if(this.isCodeBlob()) 
        td.threadCodeSrcType = this.threadCodeSrcType;
        return td;
    }
}
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系: js 文件依赖形式
 */
class TaskJSFileDependency extends TaskDependency{
    
    constructor(codeFileURL: string) {
        super();
        this.threadCodeFileURL = codeFileURL;
        this.threadCodeSrcType = ThreadCodeSrcType.JS_FILE_CODE;
    }
}
/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系: 依赖的唯一名称依赖形式
 */
 class TaskUniqueNameDependency extends TaskDependency{
    
    constructor(dependencyUniqueName: string) {
        super();
        this.dependencyUniqueName = dependencyUniqueName;
        this.threadCodeSrcType = ThreadCodeSrcType.DEPENDENCY;
    }
}

/**
 * 主线程中功能逻辑任务对于子线程中对于的代码模块的依赖关系: 代码字符串依赖形式
 */
class TaskCodeStringDependency extends TaskDependency{
    
    constructor(codeString: string, moduleName: string) {
        super();
        this.threadCodeString = codeString;
        this.moduleName = moduleName;
        this.threadCodeSrcType = ThreadCodeSrcType.STRING_CODE;
    }
}

export { TaskJSFileDependency, TaskUniqueNameDependency, TaskCodeStringDependency, TaskDependency };