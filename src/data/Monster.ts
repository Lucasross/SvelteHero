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
        return 1.3 * healthScale;
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

        // Try special action when monster die
        this.TrySpecialAction(guild);

        // Reset
        this.currentHealth = this.maxHealth;
    }

    private TrySpecialAction(guild: Writable<Guild>) {
        switch (this.id) {
            case "shaanah-past":
                guild.update(g => g.SetShaanahPastFlag(true));
                break;
            case "shaanah-present":
                guild.update(g => g.SetShaanahPresentFlag(true));
                break;
        }
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

Monster.monsters.push(new Monster("snake-easy", "Snake", 7, "snake_green",1, LootTable.normal_10));

Monster.monsters.push(new Monster("goblin-easy", "Goblin", 8, "goblin_yellow", 1.1, LootTable.normal_10));
Monster.monsters.push(new Monster("spirit-elite", "Fire spirit", 8, "spirit_red", 3, LootTable.elite_10));

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

//#region 21 - 30
Monster.monsters.push(new Monster("goblin-aqua", "Aqua goblin", 22, "goblin_blue", 1, LootTable.normal_30_aqua));
Monster.monsters.push(new Monster("jellyfish-easy", "Jellyfish", 23, "jellyfish_cyan", 0.9, LootTable.normal_30_aqua));
Monster.monsters.push(new Monster("eyed-easy", "Eyed terror", 24, "oneeyed_blue", 1.2, LootTable.normal_30_aqua));

Monster.monsters.push(new Monster("jellyfish-corrupted", "Corrupted Jellyfish", 25, "jellyfish_purple", 6, LootTable.elite_30_aqua));
Monster.monsters.push(new Monster("mimic-aqua", "Aqua mimic", 26, "mimic_blue", 7, LootTable.elite_30_aqua));
Monster.monsters.push(new Monster("spirit-aqua", "Aqua spirit", 26, "spirit_blue", 5, LootTable.elite_30_aqua));

Monster.monsters.push(new Monster("chicken-medium", "Explosive Chicken", 24, "chicken_red", 1, LootTable.normal_30_pyro));
Monster.monsters.push(new Monster("piou-pyro", "Explosive Piou", 24, "piou_red", 1, LootTable.normal_30_pyro));
Monster.monsters.push(new Monster("boxcat_medium", "Boxing cat", 26, "boxcat_red", 1.3, LootTable.normal_30_pyro));

Monster.monsters.push(new Monster("egg-easy", "Hatching Dragon", 27, "egg_red", 0.8, LootTable.normal_30_pyro));
Monster.monsters.push(new Monster("spirit-pyro", "Spirit of flames", 29, "spirit_red", 0.9, LootTable.normal_30_pyro));
Monster.monsters.push(new Monster("cerbere-pyro", "Pyro-Cerbere", 30, "cerbere_red", 2.5, LootTable.normal_30_pyro));

Monster.monsters.push(new Monster("griffin-boss", "Grigama", 32, "griffin_red", 30, LootTable.boss_30_pyro));
//#endregion

//#region 31 - 40
Monster.monsters.push(new Monster("dummy-medium", "Enchanted Dummy", 32, "dummy_blue", 0.5, LootTable.normal_40));
Monster.monsters.push(new Monster("cloud-medium", "Dark Cloud", 33, "cloud_gray", 1, LootTable.normal_40));
Monster.monsters.push(new Monster("ghost-medium", "Enchanted Ghost", 34, "ghost_blue", 1, LootTable.normal_40));
Monster.monsters.push(new Monster("bat-medium", "Dark Bat", 35, "bat_dark", 0.8, LootTable.normal_40));
Monster.monsters.push(new Monster("feline-medium", "Chief Feline", 36, "feline_white", 1, LootTable.normal_40));
Monster.monsters.push(new Monster("highghost-easy", "High Ghost", 37, "highghost_white", 1.2, LootTable.normal_40));
Monster.monsters.push(new Monster("zombie-medium", "Zombie", 38, "zombie_green", 1, LootTable.normal_40));
Monster.monsters.push(new Monster("eyed-medium", "Enchanted Eyed Terror", 38, "oneeyed_blue_white", 1.2, LootTable.normal_40));
Monster.monsters.push(new Monster("goblin-hard", "Enchanted Goblin", 39, "goblin_blue", 1.3, LootTable.normal_40));
Monster.monsters.push(new Monster("oni-easy", "Oni", 40, "oni_blue", 2, LootTable.normal_40));

Monster.monsters.push(new Monster("enchanter-boss", "Gavin, The Enchanter", 42, "sorcerer_black", 30, LootTable.boss_40));
Monster.monsters.push(new Monster("green-dragon-boss", "Rayse, The Guardian", 42, "dragon_green", 30, LootTable.boss_40));
//#endregion

//#region 41 - 50
Monster.monsters.push(new Monster("spirit-ice", "Ice Spirit", 41, "spirit_blue", 0.8, LootTable.normal_40));
Monster.monsters.push(new Monster("scorpio-easy", "Cavernal Scorpio", 42, "scorpion_blue", 1.1,  LootTable.normal_40_plus));
Monster.monsters.push(new Monster("oni-easy-2", "Captain Oni", 43, "oni_blue", 1.8, LootTable.normal_40_plus));
Monster.monsters.push(new Monster("bear-easy", "Artic Bear", 44, "bear_white", 1.5, LootTable.normal_40_plus));

Monster.monsters.push(new Monster("aspect-risk", "Risk's Aspect", 45, "ent_white", 40, LootTable.island_boss_50));
Monster.monsters.push(new Monster("aspect-savagery", "Savagery's Aspect", 45, "ent_green", 40, LootTable.island_boss_50));
Monster.monsters.push(new Monster("aspect-dispair", "Dispair's Aspect", 45, "ent_orange", 40, LootTable.island_boss_50));

Monster.monsters.push(new Monster("shaanah-past", "Past's Shaanah", 55, "demon-lord", 100, LootTable.shaanah_boss_50));
//#endregion

//#region 51 - 60
Monster.monsters.push(new Monster("dummy-pirate", "Pirate dummy", 50, "dummy_white", 1, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-mushrooms", "mushrooms_orange", 51, "mushrooms_orange", 1, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-harvester", "Harvester", 52, "pumpkin_red", 1.2, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-worm", "Worm", 53, "worm_orange", 1.3, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-lizard", "Lizard", 54, "lizard_orange", 1.2, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-skelet", "Renforced Skeleton", 55, "skeleton_white", 0.9, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-beetle", "Sunny Bettle", 56, "beetle_gold", 1.2, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-scorpion", "Scorpio", 57, "scorpion_red", 1.3, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-golem", "Golem", 58, "golem_yellow", 1.5, LootTable.desert_60))
Monster.monsters.push(new Monster("desert-griffin", "Griffin", 59, "griffin_brown", 1.4, LootTable.desert_60))

Monster.monsters.push(new Monster("insectoid-beetle-a", "Enhanced Beetle", 59, "beetle_green", 5, LootTable.insectoid_60))
Monster.monsters.push(new Monster("insectoid-beetle-b", "Powerfull Beetle", 60, "beetle_gold", 4, LootTable.insectoid_60))
Monster.monsters.push(new Monster("insectoid-beetle-c", "Resistant Beetle", 61, "beetle-blue", 7, LootTable.insectoid_60))
//#endregion

//#region 61 - 70
Monster.monsters.push(new Monster("astral-bat", "Astral Bat", 60, "bat_dark", 1, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-rat", "Strong Rat", 61, "mouse_gray", 0.9, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-boxcat", "Depressed Boxcat", 62, "boxcat_gray", 1.3, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-feline", "Depressed Feline", 63, "feline_white", 1.2, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-cloud", "Polluted Cloud", 64, "cloud_gray", 1, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-guard", "North Guard", 65, "soldier_black", 1.5, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-feline-north", "North Feline", 66, "feline_blue", 1.2, LootTable.astral_70))
Monster.monsters.push(new Monster("astral-boxcat-north", "North Boxcat", 67, "boxcat_blue", 1.2, LootTable.astral_70))

Monster.monsters.push(new Monster("etheral-spirit", "Ancient Spirit", 63, "spirit_blue", 1.2, LootTable.astral_70))
Monster.monsters.push(new Monster("etheral-ghost", "Etheral Ghost", 64, "ghost_blue", 1, LootTable.astral_70))
Monster.monsters.push(new Monster("etheral-neko", "Torturer", 65, "bakeneko_blue", 1.4, LootTable.astral_70))
Monster.monsters.push(new Monster("etheral-eyed", "Psychic Eyed Terror", 66, "oneeyed_blue_white", 1.5, LootTable.astral_70))

Monster.monsters.push(new Monster("lava-zombie", "Flaming Zombie", 65, "zombie_red", 0.8, LootTable.lava_70))
Monster.monsters.push(new Monster("lava-oni", "Enraged Oni", 66, "oni_red", 1.3, LootTable.lava_70))
Monster.monsters.push(new Monster("lava-cerbere", "Lava Cerbere", 67, "cerbere_red", 1.6, LootTable.lava_70))
Monster.monsters.push(new Monster("lava-demon", "Red Demon", 68, "demon_red", 1.2, LootTable.lava_70))
Monster.monsters.push(new Monster("lava-highghost", "Fire Ghost", 69, "highghost_red", 1, LootTable.lava_70))

Monster.monsters.push(new Monster("boss-highdragon", "Elder Dragon", 72, "highdragon_red", 1.5, LootTable.lava_boss_70))
//#endregion

//#region 71 - 80
Monster.monsters.push(new Monster("ice-egg", "Hatching Ice Egg", 69, "egg_blue", 0.8, LootTable.snow_80))
Monster.monsters.push(new Monster("ice-plant", "Ice Plant", 70, "plant_blue", 1, LootTable.snow_80))
Monster.monsters.push(new Monster("ice-mimic", "Enhanced Mimic", 71, "mimic_blue", 1.2, LootTable.snow_80))
Monster.monsters.push(new Monster("ice-golem", "Ice Golem", 72, "golem_blue", 1.5, LootTable.snow_80))

Monster.monsters.push(new Monster("ice-jabu", "Jabu", 72, "jabu_green", 6, LootTable.snow_elite_80))
Monster.monsters.push(new Monster("ice-jelly", "Magic Jellyfish", 73, "jellyfish_cyan", 5, LootTable.snow_elite_80))
Monster.monsters.push(new Monster("ice-goblin", "Ice Goblin", 74, "goblin_blue", 6, LootTable.snow_elite_80))
Monster.monsters.push(new Monster("ice-ent", "Possessed Ent", 75, "ent_white", 8, LootTable.snow_elite_80))

Monster.monsters.push(new Monster("ice-river-plant", "Overgrown Plant", 73, "plant_white", 1.2, LootTable.snow_80))
Monster.monsters.push(new Monster("ice-river-goblin", "Civilized Goblin", 74, "goblin_blue", 1.2, LootTable.snow_80))
Monster.monsters.push(new Monster("ice-oni", "Civilized Oni", 75, "oni_blue", 1.5, LootTable.snow_80))

Monster.monsters.push(new Monster("ice-spirit", "Antinomian Spirit", 75, "spirit_purple", 1, LootTable.snow_80))
Monster.monsters.push(new Monster("desert-spirit", "Antinomian Spirit", 76, "spirit_red", 1.1, LootTable.desert_80))
Monster.monsters.push(new Monster("ice-antinomian-golem", "Antinomian Golem", 76, "golem_blue", 1.5, LootTable.snow_80))
Monster.monsters.push(new Monster("desert-antinomian-golem", "Antinomian Golem", 77, "golem_yellow", 1.6, LootTable.desert_80))

Monster.monsters.push(new Monster("desert-sand-pig", "Desert Pig", 76, "pig_gold", 1, LootTable.desert_80))
Monster.monsters.push(new Monster("desert-sand-skeleton", "Sand Skeleton", 77, "skeleton_yellow", 1, LootTable.desert_80))
Monster.monsters.push(new Monster("desert-sand-sorcerer", "Necromancian", 78, "sorcerer_yellow", 1.3, LootTable.desert_80))
Monster.monsters.push(new Monster("desert-sand-worm", "Giant Worm", 79, "worm_orange", 2, LootTable.desert_80))

Monster.monsters.push(new Monster("desert-sand-zombie", "Zombie", 78, "zombie_red", 5.5, LootTable.desert_elite_80))
Monster.monsters.push(new Monster("desert-sand-elite-skeleton", "Renforced Skeleton", 79, "skeleton_red", 6, LootTable.desert_elite_80))
Monster.monsters.push(new Monster("desert-sand-ent", "Dryed Ent", 80, "ent_orange", 8, LootTable.desert_elite_80))

Monster.monsters.push(new Monster("desert-sand-lezard", "Oasis Lizard", 79, "lizard_green", 1.3, LootTable.desert_80))
Monster.monsters.push(new Monster("desert-sand-snake", "Sand Snake", 80, "snake-pink", 1.2, LootTable.desert_80))
Monster.monsters.push(new Monster("desert-sand-pumpkin", "Oasis Frightener", 81, "pumpkin_green", 1, LootTable.desert_80))
//#endregion

//#region 81 - 90
Monster.monsters.push(new Monster("fairyforest-worm", "Grass Eater", 80, "worm_green", 1.3, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-ent", "Ent Walker", 81, "ent_green", 1.5, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-imp", "Imp", 82, "imp_green", 1, LootTable.fairy_90))

Monster.monsters.push(new Monster("fairyforest-plant", "Plant Green", 81, "plant-green", 1, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-bear", "Powerfull Bear", 82, "bear_brown", 1.2, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-neko", "Nightmare", 83, "bakeneko_black", 1, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-dragon", "Ancient Dragon", 84, "dragon_green", 1.5, LootTable.fairy_90))

Monster.monsters.push(new Monster("fairyforest-sorcerer", "Time Sorcerer", 84, "sorcerer_black", 0.8, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-knight", "Time guardian", 85, "knight_black", 1.2, LootTable.fairy_90))
Monster.monsters.push(new Monster("fairyforest-demon", "Summoned Demon", 86, "demon_gray", 1, LootTable.fairy_90))

Monster.monsters.push(new Monster("fairyforest-spider", "Big Spider", 85, "spider_gray", 4, LootTable.fairy_elite_90))
Monster.monsters.push(new Monster("fairyforest-tree", "Infused Tree", 86, "tree_green", 7, LootTable.fairy_elite_90))
Monster.monsters.push(new Monster("fairyforest-highdragon", "Yggdrasil Protector", 88, "highdragon_green", 8, LootTable.fairy_elite_90))

Monster.monsters.push(new Monster("worldend-tree", "Angry Tree", 85, "tree_dark", 1.2, LootTable.devastated_90))
Monster.monsters.push(new Monster("worldend-knight", "Land Destroyer", 86, "knight_red", 1.3, LootTable.devastated_90))
Monster.monsters.push(new Monster("worldend-highghost", "Living Memory", 87, "highghost_black", 0.8, LootTable.devastated_90))

Monster.monsters.push(new Monster("worldend-worm", "Gems Eater", 86, "worm_white", 1.5, LootTable.devastated_90))
Monster.monsters.push(new Monster("worldend-oni", "Treasure Hunter", 87, "oni_dark", 1.5, LootTable.devastated_90))
Monster.monsters.push(new Monster("worldend-mimic", "Malignant Mimic", 88, "mimic_black", 1, LootTable.devastated_90))

Monster.monsters.push(new Monster("worldend-egg", "Chaotic Egg", 86, "egg_dark", 0.8, LootTable.devastated_90))
Monster.monsters.push(new Monster("worldend-beach-reaper", "Soul Claimer", 87, "reaper_gold", 1.2, LootTable.devastated_90))
Monster.monsters.push(new Monster("worldend-lezard", "Evil Lizard", 89, "lizard_dark", 1, LootTable.devastated_90))

Monster.monsters.push(new Monster("worldend-dark-reaper", "Death's lord", 90, "reaper_purple", 3, LootTable.worldedge_90))
Monster.monsters.push(new Monster("worldend-cerbere", "Cerberus Of Power", 90, "cerbere_purple", 3, LootTable.worldedge_90))
Monster.monsters.push(new Monster("worldend-dragon", "Dominant dragon", 90, "dragon_dark", 3.5, LootTable.worldedge_90))
Monster.monsters.push(new Monster("worldend-griffin", "Void Griffin", 90, "griffin_purple", 3.5, LootTable.worldedge_90))

Monster.monsters.push(new Monster("observatory-bakene", "Clever Bakene", 83, "bakeneko_red", 5.6, LootTable.observatory_90))
Monster.monsters.push(new Monster("observatory-eyed", "Scientist Eyed", 84, "oneeyed_purple", 5, LootTable.observatory_90))
Monster.monsters.push(new Monster("observatory-demon", "Infused Demon", 85, "demon_red", 6, LootTable.observatory_90))

Monster.monsters.push(new Monster("cosmic-golem", "Bridge Protector", 89, "golem_red", 2.5, LootTable.devastated_90))
Monster.monsters.push(new Monster("cosmic-knight", "Bridge Guardian", 90, "knight_white", 2.3, LootTable.devastated_90))

Monster.monsters.push(new Monster("cosmic-zombie", "Cosmic Peon", 92, "zombie_purple", 6, LootTable.stronghold_90))
Monster.monsters.push(new Monster("cosmic-dragon", "Cosmic Dragon", 92, "highdragon_purple", 10, LootTable.stronghold_90))
Monster.monsters.push(new Monster("cosmic-imp", "Cosmic Imp", 92, "imp_dark", 7.5, LootTable.stronghold_90))
Monster.monsters.push(new Monster("cosmic-demon", "Cosmic Demon", 92, "demon_purple", 9, LootTable.stronghold_90))

Monster.monsters.push(new Monster("shaanah-present", "Shaanah", 95, "demon-lord", 100, LootTable.shaanah_boss_90))

Monster.monsters.push(new Monster("vortex-shalkols", "Shal'kols, the world's vortex", 92, "highdragon_cyan", 70, LootTable.shalkols_boss_90))
//#endregion

//#region 100 - Kaelin
Monster.monsters.push(new Monster("desert-kaelin-mage", "Mage Guardian", 100, "egypt_mage", 40, null))
Monster.monsters.push(new Monster("desert-kaelin-knight", "Knight Guardian", 100, "egypt_knight", 50, null))
Monster.monsters.push(new Monster("desert-kaelin-mummy", "Resurrected Mummy", 100, "egypt_mummy", 35, null))
Monster.monsters.push(new Monster("desert-kaelin-axe", "Warrior Guardian", 100, "egypt_axe", 55, null))

Monster.monsters.push(new Monster("desert-kaelin-dragon", "Roshe, the after life", 100, "egypt_boss_dragonoriental", 450, LootTable.kaelin_roshe))
Monster.monsters.push(new Monster("desert-kaelin-sphinx", "Saki, the judge", 100, "egypt_boss_hieracosphinx", 320, LootTable.kaelin_saki))
Monster.monsters.push(new Monster("desert-kaelin-trex", "Kaani, the punisher", 100, "egypt_boss_trex", 280, LootTable.kaelin_kaani))
//#endregion