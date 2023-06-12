export default class Monster {
    public static monsters: Monster[] = [];

    public readonly id: string;
    public name: string;
    public level: number;
    public health: number; // note that it's damage per seconds (dps)
    public readonly sprite: string; // path towards monster sprite inside public/pictures/monsters

    constructor(id: string, name: string, level: number, health: number, sprite: string) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.health = health;
        this.sprite = sprite;
    }

    getPicture(): string {
        return "pictures/monsters/" + this.sprite;
    }

    static getById(id: string): Monster {
        let filtered = this.monsters.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the monsters database.");

        return filtered[0];
    }
}

Monster.monsters.push(new Monster("slime-easy", "Slime", 1, 120, "slime-blue.png"));
Monster.monsters.push(new Monster("snake-easy", "Snake", 1, 140, "snake-pink.png"));