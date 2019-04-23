type JSONString = string;

interface SimpleProjectItem {
    name: string;
    type: number;
    path: string;
}
interface ItemFilter {
    types?: number[];
    name?: string | RegExp;
    path?: string;
    depth?: number;
}

type Ticks = number;
type Seconds = number;