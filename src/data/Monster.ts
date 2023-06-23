import { get, type Writable } from "svelte/store";
import type Guild from "./Guild";
import Sprite from "./generic/Sprite";
import type Hero from "./Hero";
import type { ISprite } from "./generic/ISprite";
import { Utility } from "../utility/Utility";

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
    private readonly healthScale: number;

    private currentHealth: number; //run time value

    constructor(id: string, name: string, level: number, spriteFileName: string, healthScale: number = 1) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.healthScale = healthScale;
        this.maxHealth = Math.round(Monster.getMaxHealth(level) * healthScale);

        this.gold = Math.round(level * (5 + (level/2)));
        this.experience = Math.round(level * 10 * this.experienceScalerBasedOnHealthScale(healthScale));
        this.currentHealth = this.maxHealth;

        this.spriteFileName = spriteFileName;
        this.sprite = new Sprite(this.getFullPath(spriteFileName));
    }

    copy(): Monster
    {
        return new Monster(this.id, this.name, this.level, this.spriteFileName, this.healthScale);
    }
    
    private getFullPath(file: string): string {
        return "pictures/monsters/" + file;
    }

    private experienceScalerBasedOnHealthScale(healthScale: number): number {
        return ((1 - healthScale) / 2) + healthScale;
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

    getHealth() : number {
        return this.currentHealth;
    }

    reset() {
        this.currentHealth = this.maxHealth;
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

    static getMaxHealth(level: number): number  {
        let a = 9.6;
        let b = 33;
        let c = 50;
        return Utility.Quadratic(a, b , c, level);
    }
}

Monster.monsters.push(new Monster("piou-easy", "Piou", 1, "piou-yellow.png"));
Monster.monsters.push(new Monster("chicken-easy", "Chicken", 1, "chicken-white.png", 1.1));

Monster.monsters.push(new Monster("beetle-easy", "Beetle", 2, "beetle-blue.png"));
Monster.monsters.push(new Monster("slime-easy", "Slime", 2, "slime-blue.png", 1.1));
Monster.monsters.push(new Monster("mushroom-easy", "Mushroom", 2, "mushroom-green.png", 1.15));

Monster.monsters.push(new Monster("wolf-easy", "Wolf", 3, "wolf-brown.png"));
Monster.monsters.push(new Monster("plant-easy", "Angry plant", 3, "plant-green.png", 1.1));

Monster.monsters.push(new Monster("snake-easy", "Snake", 4, "snake-pink.png"));
Monster.monsters.push(new Monster("goblin-easy", "Goblin", 4, "goblin-yellow.png", 1.1));
Monster.monsters.push(new Monster("spirit-easy", "Fire spirit", 4, "spirit-red.png", 0.9));

Monster.monsters.push(new Monster("ogre-easy", "Ogre", 5, "ogre-green.png", 1.2))

Monster.monsters.push(new Monster("cerbere-easy", "Cerbere", 6, "cerbere-white.png", 1.5));

Monster.monsters.push(new Monster("demon-lord", "Demon Lord", 100, "demon-lord.png", 5));
