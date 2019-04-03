export interface Action {
    type: string;
}
export interface State {
    level: number;
    numBlocks: number;
    [key: string]: any;
    blocks: any[];
}
export interface SetAction extends Action {
    type: "set";
    payload: {
        key: string,
        value: any,
    };
}
