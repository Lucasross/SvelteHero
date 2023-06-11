export default class Hero {
    public name: string;
    public level: number;
    public attack: number; // note that it's damage per seconds (dps)

    constructor(name: string, level: number) {
        this.name = name;
        this.level = level;
        this.attack = level * 5;
    }
}