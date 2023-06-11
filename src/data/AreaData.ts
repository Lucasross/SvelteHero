export default class AreaData {
    public static areas: AreaData[] = [];

    public name: string;
    public background: string;

    constructor(name: string, background: string) {
        this.name = name;
        this.background = background;
    }

    getPicture(): string {
        return "pictures/areas/" + this.background;
    }
}

AreaData.areas.push(new AreaData("Plains of Koloh", "plains.jpg"));
AreaData.areas.push(new AreaData("Snowy mountains path", "mountains.jpg"));