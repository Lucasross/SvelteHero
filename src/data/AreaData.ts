import type { Writable } from "svelte/store";
import { get } from "svelte/store";
import type Hero from "./Hero";
import Monster from "./Monster";
import type Guild from "./Guild";
import Sprite from "./generic/Sprite";
import type { ISprite } from "./generic/ISprite";

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

        return `Experience: ~${average.toFixed(2)}/monster`
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
//#endregion