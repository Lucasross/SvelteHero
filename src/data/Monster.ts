import { get, type Writable } from "svelte/store";
import type Guild from "./Guild";
import Sprite from "./generic/Sprite";
import type Hero from "./Hero";
import type { ISprite } from "./generic/ISprite";
import { Utility } from "../utility/Utility";
import { EffectType } from "./StatEffect";
import LootTable from "./LootTable";
import Equipment from "./Equipment";
import { LootType } from "./Loot";

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
    private readonly lootTable: LootTable;

    private currentHealth: number; //run time value

    constructor(id: string, name: string, level: number, spriteFileName: string, healthScale: number = 1, lootTable: LootTable = null) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.healthScale = healthScale;
        this.maxHealth = Math.round(Monster.getMaxHealth(level) * healthScale);
        this.lootTable = lootTable;

        this.gold = Math.round(level * (5 + (level/2)));
        this.experience = Math.round(Monster.getBaseExperience(level) * this.experienceScalerBasedOnHealthScale(healthScale));
        this.currentHealth = this.maxHealth;

        this.spriteFileName = spriteFileName + ".png";
        this.sprite = new Sprite(this.getFullPath(spriteFileName));
    }

    copy(): Monster
    {
        return new Monster(this.id, this.name, this.level, this.spriteFileName, this.healthScale, this.lootTable);
    }
    
    private getFullPath(file: string): string {
        return "pictures/monsters/" + file;
    }

    private experienceScalerBasedOnHealthScale(healthScale: number): number {
        return ((1 - healthScale) / 2) + healthScale;
    }

    getSprite() {
        return this.sprite.get();
    }

    die(guild: Writable<Guild>, heroesInvolved: Array<Writable<Hero>>)  {
        // Give gold to the guild
        let randomGold = (Math.random() * this.gold) - (this.gold / 2)
        let givenGold = this.gold + randomGold;
        let rawGoldBonus = heroesInvolved.reduce((rawGoldBonus, h) => rawGoldBonus + get(h).getStat(EffectType.GoldRaw), 0);
        let percentGoldBonus = heroesInvolved.reduce((rawGoldBonus, h) => rawGoldBonus + get(h).getStat(EffectType.GoldPercent), 0);
        let givenGoldWithBonus = (givenGold + rawGoldBonus) * (1 + percentGoldBonus);
        guild.update(g => {g.gold += Math.round(givenGoldWithBonus); return g});

        // Give experience to the heroes
        let heroTooHighLevel: boolean = heroesInvolved.map(h => get(h)).filter(h => (h.level - this.level) > 20).length > 0;
        if (!heroTooHighLevel) {
            heroesInvolved.forEach(h => h.update(h => h.giveExp(this.experience, this.level)));
        }
        
        // Try loot from table
        if(this.lootTable != null) {
            let loot = this.lootTable.TryLoot();
            if(loot != null) {
                guild.update(g => {
                    if(loot.getType() == LootType.Equipment)
                        g.addEquipmentById(loot.id);
                    else
                        g.addItem(loot);
                    return g;
                })
            }
        }

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

    static getBaseExperience(level: number): number {
        let a = 0.83;
        let b = 66;
        let c = 110;
        return Utility.Quadratic(a, b, c, level);
    }

    static getMaxHealth(level: number): number  {
        let a = 9.6;
        let b = 33;
        let c = 50;
        return Utility.Quadratic(a, b, c, level);
    }
}

//#region Level 1 - 10
Monster.monsters.push(new Monster("dummy-easy", "Wood dummy", 1, "dummy_white", 1, LootTable.normal_10))

Monster.monsters.push(new Monster("piou-easy", "Piou", 2, "piou-yellow", 1, LootTable.normal_10));

Monster.monsters.push(new Monster("chicken-easy", "Chicken", 3, "chicken-white", 1.1, LootTable.normal_10));
Monster.monsters.push(new Monster("slime-easy", "Slime", 3, "slime-blue", 1.1, LootTable.normal_10));

Monster.monsters.push(new Monster("beetle-easy", "Beetle", 4, "beetle-blue", 1, LootTable.normal_10));

Monster.monsters.push(new Monster("mushroom-easy", "Mushroom", 5, "mushroom-green", 1.15, LootTable.normal_10));
Monster.monsters.push(new Monster("wolf-easy", "Wolf", 5, "wolf-brown", 1, LootTable.normal_10));

Monster.monsters.push(new Monster("plant-easy", "Angry plant", 6, "plant-green", 1.1, LootTable.normal_10));

Monster.monsters.push(new Monster("snake-easy", "Snake", 7, "snake-pink",1, LootTable.normal_10));

Monster.monsters.push(new Monster("goblin-easy", "Goblin", 8, "goblin-yellow", 1.1, LootTable.normal_10));
Monster.monsters.push(new Monster("spirit-elite", "Fire spirit", 8, "spirit-red", 3, LootTable.elite_10));

Monster.monsters.push(new Monster("ogre-elite", "Ogre", 9, "ogre-green", 3, LootTable.elite_10));

Monster.monsters.push(new Monster("cerbere-elite", "Cerbere", 10, "cerbere-white", 4, LootTable.elite_10));

Monster.monsters.push(new Monster("sorcerer-boss", "Gohugu", 12, "sorcerer-red", 30, LootTable.boss_10));
//#endregion

//#region Level 11 - 20
Monster.monsters.push(new Monster("bat-easy", "Bat", 13, "bat_dark", 0.8, LootTable.normal_20));

Monster.monsters.push(new Monster("cloud-easy", "Cloud", 14, "cloud_purple", 1, LootTable.normal_20));
Monster.monsters.push(new Monster("slime-medium", "Corrupted Slime", 14, "slime_gray", 1.2, LootTable.normal_20));

Monster.monsters.push(new Monster("soldier-easy", "Soldier", 15, "soldier_gray", 1.5, LootTable.normal_20));
Monster.monsters.push(new Monster("zombie-easy", "Zombie", 15, "zombie_green", 1, LootTable.normal_20));

Monster.monsters.push(new Monster("spirit-medium", "Phantom Spirit", 16, "spirit_purple", 0.9, LootTable.normal_20));

Monster.monsters.push(new Monster("reaper-easy", "Reaper", 17, "reaper_purple", 1.2, LootTable.normal_20));

Monster.monsters.push(new Monster("feline-easy", "Feline", 18, "feline_brown", 1, LootTable.normal_20));
Monster.monsters.push(new Monster("boxcat-easy", "Boxing cat", 18, "boxcat_blue", 1, LootTable.normal_20));

Monster.monsters.push(new Monster("rat-elite-easy", "Chief rat", 19, "mouse_gray", 5, LootTable.elite_20));
Monster.monsters.push(new Monster("rat-elite-medium", "Commander rat", 20, "mouse_brown", 6, LootTable.elite_20));

Monster.monsters.push(new Monster("rat-boss", "Ratto Kingu", 22, "mouse_purple", 35, LootTable.boss_20));
//#endregion

Monster.monsters.push(new Monster("demon-lord", "Demon Lord", 100, "demon-lord", 50));
