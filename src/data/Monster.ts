import type { Writable } from "svelte/store";
import type Guild from "./Guild";

export default class Monster {
    public static monsters: Monster[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly level: number;
    public readonly maxHealth: number; // note that it's damage per seconds (dps)
    public readonly sprite: string; // path towards monster sprite inside public/pictures/monsters
    public readonly experience: number;
    public readonly gold: number;

    public currentHealth: number; //run time value

    constructor(id: string, name: string, level: number, maxHealth: number, sprite: string) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.maxHealth = maxHealth;
        this.sprite = sprite;

        this.gold = Math.round(level * (5 + (level/2)));
        this.experience = level * 10;
        this.currentHealth = maxHealth;
    }

    copy(): Monster
    {
        return new Monster(this.id, this.name, this.level, this.maxHealth, this.sprite);
    }
    
    getPicture(): string {
        return "pictures/monsters/" + this.sprite;
    }

    die(guild: Writable<Guild>)  {
        let randomGold = (Math.random() * this.gold) - (this.gold / 2)
        let givenGold = this.gold + randomGold;
        guild.update(g => {g.gold += Math.round(givenGold); return g});
        this.currentHealth = this.maxHealth;
    }

    static getById(id: string): Monster {
        let filtered = this.monsters.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the monsters database.");

        return filtered[0];
    }
}

Monster.monsters.push(new Monster("piou-easy", "Piou", 1, 80, "piou-yellow.png"));
Monster.monsters.push(new Monster("chicken-easy", "Chicken", 1, 90, "chicken-white.png"));

Monster.monsters.push(new Monster("beetle-easy", "Beetle", 2, 100, "beetle-blue.png"));
Monster.monsters.push(new Monster("slime-easy", "Slime", 2, 120, "slime-blue.png"));
Monster.monsters.push(new Monster("mushroom-easy", "Mushroom", 2, 120, "mushroom-green.png"));

Monster.monsters.push(new Monster("wolf-easy", "Wolf", 3, 150, "wolf-brown.png"));

Monster.monsters.push(new Monster("snake-easy", "Snake", 4, 200, "snake-pink.png"));

Monster.monsters.push(new Monster("demon-lord", "Demon Lord", 100, 456835, "demon-lord.png"));

