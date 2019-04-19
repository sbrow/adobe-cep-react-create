export interface Action {
    type: string;
}
export interface IFormState {
    level: string;
    numBlocks: number;
    [key: string]: any;
    blocks: any[];
    bins?: string[];
    availableVideos?: string[];
}
export interface SetAction extends Action {
    type: "set";
    source: string;
    payload: {
        key: string,
        value: any,
    };
}

export interface Block {
    intro: string;
    warmup?: string;
    exercises: string[];
}

export interface Workout {
    intro: string;
    warmup?: string;
    blocks?: Block[];
    outro?: string;
}

export enum ProjectItemType {
    Clip = 1,
    Bin,
    Root,
    File,
}
