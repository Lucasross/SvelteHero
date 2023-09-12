import type { Writable } from "svelte/store";
import { get } from "svelte/store";
import type Hero from "./Hero";
import Monster from "./Monster";
import type Guild from "./Guild";
import Sprite from "./generic/Sprite";
import type { ISprite } from "./generic/ISprite";
import { Utility } from "../utility/Utility";

export default class AreaData implements ISprite {
    public static areas: AreaData[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly background: Sprite;
    public readonly encounters: Monster[];
    public readonly timePerMonster: number | null;
    public readonly iconPath: string;
    public readonly xPos: number;
    public readonly yPos: number;

    public area: AreaController;

    constructor(name: string, background: string, encounters: string[], xPos: number, yPos: number, timePerMonster: number | null = null, iconPath: string = "compass.png") {
        this.id = name;
        this.name = name;
        this.background = new Sprite(this.getFullPath(background));
        this.encounters = encounters.map(id => Monster.getById(id).copy());
        this.timePerMonster = timePerMonster;
        this.iconPath = iconPath;
        this.xPos = xPos;
        this.yPos = yPos;

        this.area = new AreaController(this);
    }

    // #region Data
    getFullPath(path: string): string {
        return "pictures/areas/" + path;
    }

    getSprite(): Promise<any> {
        return this.background.get();
    }

    levelRange(): string {
        const levels = this.encounters.map(m => m.level);
        const min = Math.min(...levels);
        const max = Math.max(...levels);
        if (min == max)
            return `Monsters level : ${min}`
        else
            return `Levels : ${min} - ${max}`
    }

    expRange(): string {
        const exps = this.encounters.map(m => m.experience);
        const sum = exps.reduce((sum, current) => sum + current, 0);
        const average = (sum / exps.length) || 0;

        return `Experience: ~${Utility.toLocalFixed(average)}/monster`
    }

    isTimedArea(): boolean {
        return this.timePerMonster != null
    }

    tooltip(isPlayerHere: boolean = false) {
        return `<b>${this.name}</b>${isPlayerHere ? "<i> (you are here)</i>" : ""}<br>` +
            this.levelRange() + "<br>" +
            this.expRange();
    }
    // #endregion

    // #region Update
    update(guild: Writable<Guild>) {
        this.area.update(guild);
    }

    updateTimer(deltaTime: number) {
        this.area.updateTimer(deltaTime);
    }

    enter(hero: Writable<Hero>) {
        this.area.enter(hero);
    }

    leave(hero: Writable<Hero>) {
        this.area.leave(hero);
    }

    getHeroes(): Writable<Hero>[] {
        return this.area.getHeroes();
    }

    setMonster(monster: Monster) {
        this.area.setMonster(monster);
    }

    getMonster(): Monster {
        return this.area.getMonster();
    }

    getAreaDps(): number {
        return this.area.getAreaDps();
    }

    getNormalizedTimer() {
        return this.area.currentTimer / this.timePerMonster;
    }

    needUpdate(): boolean {
        return this.area.needUpdate();
    }
    // #endregion

    // #region Static
    static getById(id: string): AreaData {
        let filtered = this.areas.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the area database.");

        return filtered[0];
    }
    // #endregion
}

// this class purpose is for runtime activity
class AreaController {
    private readonly area: AreaData;

    private monster: Monster = undefined;
    private heroes: Writable<Hero>[] = [];
    public currentTimer: number;

    constructor(area: AreaData) {
        this.area = area;
        this.monster = area.encounters[Math.floor(Math.random() * area.encounters.length)];

        if (area.isTimedArea())
            this.currentTimer = area.timePerMonster;
    }

    update(guild: Writable<Guild>) {
        let damages = this.getAreaDps();

        this.monster.damage(damages);

        if (this.monster.isDead()) {
            if(this.area.isTimedArea())
                this.currentTimer = this.area.timePerMonster;

            this.monster.die(guild, this.heroes);
            this.setMonster(this.area.encounters[Math.floor(Math.random() * this.area.encounters.length)]);
        }
    }

    updateTimer(deltaTime: number) {
        if (!this.area.isTimedArea())
            return;

        this.currentTimer -= deltaTime;

        if (this.currentTimer <= 0) {
            this.monster.reset();
            this.currentTimer = this.area.timePerMonster;
        }
    }

    getAreaDps(): number {
        return this.heroes.reduce((damages, h) => damages + get(h).getAttack(), 0)
    }

    enter(hero: Writable<Hero>) {
        this.heroes.push(hero);
    }

    leave(hero: Writable<Hero>) {
        const index = this.heroes.indexOf(hero, 0);
        if (index > -1) {
            this.heroes.splice(index, 1);
        }
        if (this.heroes.length == 0) {
            this.currentTimer = this.area.timePerMonster;
            this.getMonster().reset();
        }
    }

    getHeroes(): Writable<Hero>[] {
        return this.heroes;
    }

    setMonster(monster: Monster) {
        this.monster = monster;
    }

    getMonster(): Monster {
        return this.monster;
    }

    needUpdate(): boolean {
        return this.heroes.length > 0;
    }
}

//#region 1 - 10
AreaData.areas.push(new AreaData("Training center", "training_camp.jpg",
    [
        "dummy-easy",
    ], 24, 30));

AreaData.areas.push(new AreaData("Koloh's plains", "plains.jpg",
    [
        "piou-easy",
        "chicken-easy",
        "slime-easy",
        "beetle-easy",
        "mushroom-easy",
    ], 20, 16));

AreaData.areas.push(new AreaData("Dark forest", "forest.jpg",
    [
        "wolf-easy",
        "plant-easy",
        "snake-easy",
        "goblin-easy",
    ], 9, 32));

AreaData.areas.push(new AreaData("Keyn's village", "desert_hood.jpg",
    [
        "spirit-elite",
        "ogre-elite",
        "cerbere-elite"
    ], 33, 56,
    30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Keyn's lair", "desert_capital.jpg",
    [
        "sorcerer-boss",
    ], 24, 62,
    60, "boss_skull.png"));
//#endregion

//#region 11 - 20
AreaData.areas.push(new AreaData("Walker Bridge", "neon_bridge.jpg",
    [
        "bat-easy",
        "cloud-easy",
        "slime-medium",
        "soldier-easy",
    ], 55, 46));

AreaData.areas.push(new AreaData("Neon City", "neon_city.jpg",
    [
        "zombie-easy",
        "soldier-easy",
        "spirit-medium",
        "reaper-easy",
    ], 67, 57));

AreaData.areas.push(new AreaData("Neon Harbour", "neon_harbour.jpg",
    [
        "reaper-easy",
        "feline-easy",
        "boxcat-easy",
    ], 58, 70));

AreaData.areas.push(new AreaData("The Undergrounds", "neon_underground.jpg",
    [
        "rat-elite-easy",
        "rat-elite-medium",
    ], 76, 64,
    30, "elite_helm.png"));

AreaData.areas.push(new AreaData("The pit", "neon_pit.jpg",
    [
        "rat-boss",
    ], 71, 76,
    60, "boss_skull.png"));
    //#endregion

//#region 21 - 30
AreaData.areas.push(new AreaData("Wrecker Sea", "aqua_sea.jpg",
[
    "goblin-aqua",
    "jellyfish-easy",
    "eyed-easy",
], 36, 79));

AreaData.areas.push(new AreaData("Hall of Corals", "aqua_capital.jpg",
[
    "jellyfish-corrupted",
    "mimic-aqua",
    "spirit-aqua",
], 28, 82,
30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Moppei's village", "volcano_village.jpg",
[
    "chicken-medium",
    "piou-pyro",
    "boxcat_medium",
], 71, 34));

AreaData.areas.push(new AreaData("Fire's path", "volcano_fireplace.jpg",
[
    "egg-easy",
    "spirit-pyro",
    "cerbere-pyro",
], 78, 28));

AreaData.areas.push(new AreaData("Implosion Point", "volcano.jpg",
[
    "griffin-boss",
], 72, 18,
60, "boss_skull.png"));
//#endregion

//#region 31 - 40
AreaData.areas.push(new AreaData("Toori's passage", "fog_torii.jpg",
[
    "dummy-medium",
    "cloud-medium",
    "ghost-medium",
], 46, 23));

AreaData.areas.push(new AreaData("Disillusion city", "fog_city.jpg",
[
    "bat-medium",
    "feline-medium",
    "highghost-easy",
], 40, 13));

AreaData.areas.push(new AreaData("Tower of contemplations", "fog_capital.jpg",
[
    "enchanter-boss",
    "green-dragon-boss",
], 36, 0,
60, "boss_skull.png"));

AreaData.areas.push(new AreaData("Ice's path", "mountains_ice.jpg",
[
    "eyed-medium",
    "goblin-hard",
    "oni-easy",
], 50, 8));
//#endregion

//#region 41 - 50
AreaData.areas.push(new AreaData("Valley of ice", "ice_valley.jpg",
[
    "spirit-ice",
    "scorpio-easy",
    "oni-easy-2",
    "bear-easy",
], 65, 4));
AreaData.areas.push(new AreaData("Island of risk", "ice_island.jpg",
[
    "aspect-risk",
], 82, 0,
60, "boss_skull.png"));
AreaData.areas.push(new AreaData("Island of savagery", "forest_island.jpg",
[
    "aspect-savagery",
], 8, 17,
60, "boss_skull.png"));

AreaData.areas.push(new AreaData("Island of dispair", "desert_island.jpg",
[
    "aspect-dispair",
], 6, 69,
60, "boss_skull.png"));
AreaData.areas.push(new AreaData("Meteor site", "crater.jpg",
[
    "shaanah-past",
], 44, 38,
60, "boss_skull.png"));
//#endregion

//#region 51 - 60
AreaData.areas.push(new AreaData("Pirate Bay", "pirate_bay.jpg",
[
    "dummy-pirate",
], 9, 66.5));

AreaData.areas.push(new AreaData("Desert Labyrinth", "desert_labyrinth.jpg",
[
    "desert-lizard",
    "desert-skelet",
    "desert-beetle",
    
], 18, 43));

AreaData.areas.push(new AreaData("Desertic lands", "desert_lands.jpg",
[
    "desert-mushrooms",
    "desert-harvester",
    "desert-worm",
], 4, 48));

AreaData.areas.push(new AreaData("Dry rivers", "desert_rivers.jpg",
[
    "desert-scorpion",
    "desert-golem",
    "desert-griffin",
], 32, 48));

AreaData.areas.push(new AreaData("Insectoid Tower", "insectoid_tower.jpg",
[
    "insectoid-beetle-a",
    "insectoid-beetle-b",
    "insectoid-beetle-c",
], 7, 33,
30, "elite_helm.png"));
//#endregion

//#region 61 - 70
AreaData.areas.push(new AreaData("Astral South Side", "astral_south.jpg",
[
    "astral-bat",
    "astral-rat",
    "astral-boxcat",
    "astral-feline",
], 34, 34));

AreaData.areas.push(new AreaData("Astral North Side", "astral_north.jpg",
[
    "astral-cloud",
    "astral-guard",
    "astral-feline-north",
    "astral-boxcat-north",
], 36, 22));

AreaData.areas.push(new AreaData("Etheral lands", "ethereal_lands.jpg",
[
    "etheral-spirit",
    "etheral-ghost",
    "etheral-neko",
    "etheral-eyed",
], 16, 22));

AreaData.areas.push(new AreaData("Lava rivers", "volcano_lands.jpg",
[
    "lava-zombie",
    "lava-cerbere",
    "lava-demon",
    "lava-highghost",
], 27, 15));

AreaData.areas.push(new AreaData("Dragon's Lands", "volcano.jpg",
[
    "boss-highdragon",
], 21, 0,
60, "boss_skull.png"));

AreaData.areas.push(new AreaData("Cavernal path", "cavern_01.jpg",
[
    "ice-egg",
    "ice-plant",
    "ice-mimic",
    "ice-golem",
], 42, 10));
//#endregion

//#region 71 - 80
AreaData.areas.push(new AreaData("Snows's den", "cavern_snow.jpg",
[
    "ice-jabu",
    "ice-jelly",
    "ice-goblin",
    "ice-ent",
], 48, 1,
30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Frozen river", "snow_lands.jpg",
[
    "ice-river-plant",
    "ice-river-goblin",
    "ice-oni",
], 50, 18));

AreaData.areas.push(new AreaData("Antinomian Tunnel", "cavern_02.jpg",
[
    "ice-spirit",
    "desert-spirit",
    "ice-antinomian-golem",
    "desert-antinomian-golem",
], 58, 10));

AreaData.areas.push(new AreaData("Buried village", "desert_buried.jpg",
[
    "desert-sand-pig",
    "desert-sand-skeleton",
    "desert-sand-sorcerer",
    "desert-sand-worm",
], 68, 8));

AreaData.areas.push(new AreaData("Newborn oasis", "desert_oasis.jpg",
[
    "desert-sand-lezard",
    "desert-sand-snake",
    "desert-sand-pumpkin",
], 77, 10));

AreaData.areas.push(new AreaData("Azoktun's sepulchre", "desert_pyramid.jpg",
[
    "desert-sand-zombie",
    "desert-sand-elite-skeleton",
    "desert-sand-ent",
], 73, 0,
30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Extinct volcano", "plains_volcano.jpg",
[
    "fairyforest-worm",
    "fairyforest-ent",
    "fairyforest-imp",
], 80, 20));

AreaData.areas.push(new AreaData("Fairies dream", "plains_village.jpg",
[
    "fairyforest-plant",
    "fairyforest-bear",
    "fairyforest-neko",
    "fairyforest-dragon",
], 72, 26));
//#endregion

//#region 81 - 90
AreaData.areas.push(new AreaData("Waterfall of time", "plains_waterfall.jpg",
[
    "fairyforest-sorcerer",
    "fairyforest-knight",
    "fairyforest-demon",
], 63, 35));

AreaData.areas.push(new AreaData("Yggdrasil sprout", "plains_yggdrasil.jpg",
[
    "fairyforest-spider",
    "fairyforest-tree",
    "fairyforest-highdragon",
], 85, 35,
30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Devastated plains", "devastated_lands.jpg",
[
    "worldend-tree",
    "worldend-knight",
    "worldend-highghost",
], 76, 52));

AreaData.areas.push(new AreaData("Open-pit mines", "devastated_mountains.jpg",
[
    "worldend-worm",
    "worldend-oni",
    "worldend-mimic",
], 80, 64));

AreaData.areas.push(new AreaData("World's edge", "devastated_edge.jpg",
[
    "worldend-dark-reaper",
    "worldend-cerbere",
    "worldend-dragon",
    "worldend-griffin",
], 86, 56));

AreaData.areas.push(new AreaData("Arid beach", "devastated_beach.jpg",
[
    "worldend-egg",
    "worldend-beach-reaper",
    "worldend-lezard",
], 65, 59));

AreaData.areas.push(new AreaData("The Observatory", "observatory.jpg",
[
    "observatory-bakene",
    "observatory-eyed",
    "observatory-demon",
], 56, 50,
30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Cosmic Bridge", "cosmic_bridge.jpg",
[
    "cosmic-golem",
    "cosmic-knight",
], 58, 63));

AreaData.areas.push(new AreaData("Shaanah's stronghold", "cosmic_fortress.jpg",
[
    "cosmic-zombie",
    "cosmic-dragon",
    "cosmic-imp",
    "cosmic-demon",
], 48, 57,
30, "elite_helm.png"));

AreaData.areas.push(new AreaData("Whirlwind Typhoon", "typhoon.jpg",
[
    "vortex-shalkols",
], 46, 46,
60, "boss_skull.png"));

AreaData.areas.push(new AreaData("Hot Spring", "hot_spring.jpg",
[
    "shaanah-present",
], 40, 69,
60, "boss_skull.png"));
//#endregion

//#region 100 - Kaelin
AreaData.areas.push(new AreaData("Death's Gate", "desert_kaelin.jpg",
[
    "desert-kaelin-mage", //trash
    "desert-kaelin-knight", //trash
    "desert-kaelin-mummy", //trash
    "desert-kaelin-axe", //trash

    "desert-kaelin-trex", //boss
    "desert-kaelin-sphinx", //boss
    "desert-kaelin-dragon", //boss
], 42, 74,
180, "boss_skull.png"));

AreaData.areas.push(new AreaData("Eternity Palace", "ice_kaelin.jpg",
[
    "ice-kaelin-avian", //trash
    "ice-kaelin-destroyer", //trash
    "ice-kaelin-bull", //trash
    "ice-kaelin-lion", //trash
    "ice-kaelin-demon", //trash
    "ice-kaelin-turtle", //trash

    "ice-kaelin-titan", //boss
    "ice-kaelin-golem", //boss
    "ice-kaelin-goddess", //boss
    "ice-kaelin-demeres", //boss
], 77, 67,
180, "boss_skull.png"));

AreaData.areas.push(new AreaData("Magma's Chambers", "kaelin_magma.jpg",
[
    "magma-kaelin-griffin", //trash
    "magma-kaelin-elemental", //trash
    "magma-kaelin-dragon", //trash
    "magma-kaelin-tamer", //trash
    "magma-kaelin-bear", //trash
    "magma-kaelin-sabertooth", //trash
    "magma-kaelin-knight", //trash
    "magma-kaelin-golem", //trash

    "magma-kaelin-slimegod", //boss
    "magma-kaelin-kitsune", //boss
    "magma-kaelin-worm", //boss
    "magma-kaelin-titan", //boss
    "magma-kaelin-tiamat", //boss
], 65.5, 14,
180, "boss_skull.png"));

AreaData.areas.push(new AreaData("Black World Clan", "kaelin_darkclan.jpg",
[
    "darkclan-kaelin-blader", //trash
    "darkclan-kaelin-bookmaster", //trash
    "darkclan-kaelin-healer", //trash
    "darkclan-kaelin-minion", //trash
    "darkclan-kaelin-moonblade", //trash
    "darkclan-kaelin-summoner", //trash

    "darkclan-kaelin-asselus", //boss
    "darkclan-kaelin-jeanne", //boss
    "darkclan-kaelin-pizarro", //boss
    "darkclan-kaelin-regulus", //boss
    "darkclan-kaelin-archwizard", //boss
], 15, 58,
120, "boss_skull.png"));

AreaData.areas.push(new AreaData("World's Cradle", "kaelin_cradle.jpg",
[
    "elves-kaelin-archer", //trash
    "elves-kaelin-assasin", //trash
    "elves-kaelin-crossbow", //trash
    "elves-kaelin-dual", //trash
    "elves-kaelin-mage", //trash
    "elves-kaelin-spear", //trash
    "elves-kaelin-rogue", //trash
    "elves-kaelin-spellcaster", //trash
    "elves-kaelin-tree", //trash
    "elves-kaelin-transporter", //trash
    "elves-kaelin-worker", //trash

    "elves-kaelin-dragon", //boss
    "elves-kaelin-secretgod", //boss
    "elves-kaelin-titan", //boss
    "elves-kaelin-queen", //boss
    "elves-kaelin-god", //boss
], 31, 14,
120, "boss_skull.png"));
//#endregion