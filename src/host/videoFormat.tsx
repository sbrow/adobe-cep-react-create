// @include "JSON.jsx"
class VideoFormat {
    public name: string;
    public fps: number;

    constructor(name: string, fps: number) {
        this.name = name;
        this.fps = fps;
    }

    /**
     * @param {string} timebase the number of Ticks per frame.
     * @returns {string} Ticks per second
     * @memberof VideoFormat
     */
    public tps(timebase: JSONString): JSONString {
        const timebaseAsNumber = Number(timebase);
        if (isNaN(timebaseAsNumber)) {
            return "NaN";
        }
        return JSON.stringify(timebaseAsNumber * this.fps);
    }
}

