export default class Monster {
    public name: string;
    public level: number;
    public health: number; // note that it's damage per seconds (dps)

    constructor(name: string, level: number) {
        this.name = name;
        this.level = level;
        this.health = (level * 5) + (Math.random() * 10);
    }
}