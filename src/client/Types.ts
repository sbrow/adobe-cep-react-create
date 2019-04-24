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

export interface Workout {
    intro: string;
    warmup?: string;
    blocks?: BlockStore[];
    outro?: string;
}

export enum ProjectItemType {
    Clip = 1,
    Bin,
    Root,
    File,
}
export interface NumberInputProps {
    id: string;
    label: string;
    min?: number;
    max?: number;
}
