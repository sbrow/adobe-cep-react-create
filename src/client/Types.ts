export interface Action {
    type: string;
}

export interface IFormState {
    level: string;
    numBlocks: number;
    [key: string]: any;
    blocks: any[];
    bins?: string[];
    availableVideos?: SimpleProjectItem[];
}

export interface SetAction extends Action {
    type: "set";
    source: string;
    payload: {
        key: string,
        value: any,
    };
}

export interface BlockStore {
    intro: string;
    rounds: number;
    warmup?: string;
    exercises: string[];
}

export enum ProjectItemType {
    CLIP = 1,
    BIN = 2,
    ROOT = 3,
    FILE = 4,
}
