import { get, type Writable } from "svelte/store";
import type Guild from "./Guild";
import Sprite from "./generic/Sprite";
import type Hero from "./Hero";
import type { ISprite } from "./generic/ISprite";

export default class Monster implements ISprite {
    public static monsters: Monster[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly level: number;
    public readonly maxHealth: number; // note that it's damage per seconds (dps)
    public readonly experience: number;
    public readonly gold: number;
    public readonly sprite: Sprite;
    public readonly spriteFileName: string;

    public currentHealth: number; //run time value

    constructor(id: string, name: string, level: number, maxHealth: number, spriteFileName: string) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.maxHealth = maxHealth;

        this.gold = Math.round(level * (5 + (level/2)));
        this.experience = level * 10;
        this.currentHealth = maxHealth;

        this.spriteFileName = spriteFileName;
        this.sprite = new Sprite(this.getFullPath(spriteFileName));
    }

    copy(): Monster
    {
        return new Monster(this.id, this.name, this.level, this.maxHealth, this.spriteFileName);
    }
    
    private getFullPath(file: string): string {
        return "pictures/monsters/" + file;
    }

    getSprite() {
        return this.sprite.sprite;
    }

    die(guild: Writable<Guild>, heroesInvolved: Array<Writable<Hero>>)  {
        // Give gold to the guild
        let randomGold = (Math.random() * this.gold) - (this.gold / 2)
        let givenGold = this.gold + randomGold;
        guild.update(g => {g.gold += Math.round(givenGold); return g});

        // Give experience to the heroes
        let heroTooHighLevel: boolean = heroesInvolved.map(h => get(h)).filter(h => (h.level - this.level) > 20).length > 0;
        let monsterExp: number = heroTooHighLevel ? 0 : this.experience;
        heroesInvolved.forEach(h => h.update(h => h.giveExp(monsterExp, this.level)));

        this.currentHealth = this.maxHealth;
    }

    damage(damage: number) {
        this.currentHealth -= damage;
    }

    isDead(): boolean {
        return this.currentHealth <= 0;
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
Monster.monsters.push(new Monster("plant-easy", "Angry plant", 3, 160, "plant-green.png"));

Monster.monsters.push(new Monster("snake-easy", "Snake", 4, 200, "snake-pink.png"));
Monster.monsters.push(new Monster("goblin-easy", "Goblin", 4, 200, "goblin-yellow.png"));
Monster.monsters.push(new Monster("spirit-easy", "Fire spirit", 4, 180, "spirit-red.png"));

Monster.monsters.push(new Monster("ogre-easy", "Ogre", 5, 320, "ogre-green.png"))

Monster.monsters.push(new Monster("cerbere-easy", "Cerbere", 6, 450, "cerbere-white.png"));

Monster.monsters.push(new Monster("demon-lord", "Demon Lord", 100, 456835, "demon-lord.png"));
