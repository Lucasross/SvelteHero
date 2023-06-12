import type Monster from "./Monster";

export default class AreaData {
    public static areas: AreaData[] = [];

    public readonly name: string;
    public readonly background: string;
    public readonly encounters: Monster[];

    constructor(name: string, background: string, encounters: Monster[]) {
        this.name = name;
        this.background = background;
        this.encounters = encounters;
    }

    getPicture(): string {
        return "pictures/areas/" + this.background;
    }
}

AreaData.areas.push(new AreaData("Plains of Koloh", "plains.jpg", null));
AreaData.areas.push(new AreaData("Snowy mountains path", "mountains.jpg", null));