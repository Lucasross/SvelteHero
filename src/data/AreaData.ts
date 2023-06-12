import Monster from "./Monster";

export default class AreaData {
    public static areas: AreaData[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly background: string;
    public readonly encounters: Monster[];

    constructor(name: string, background: string, encounters: string[]) {
        this.id = name;
        this.name = name;
        this.background = background;
        this.encounters = encounters.map(id => Monster.getById(id));
    }

    getPicture(): string {
        return "pictures/areas/" + this.background;
    }
}

AreaData.areas.push(new AreaData("Plains of Koloh", "plains.jpg", ["slime-easy", "snake-easy"]));
AreaData.areas.push(new AreaData("Snowy mountains path", "mountains.jpg", ["slime-easy", "snake-easy"]));