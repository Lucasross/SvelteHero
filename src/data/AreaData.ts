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

    public area: AreaController;

    constructor(name: string, background: string, encounters: string[], timePerMonster: number | null = null, iconPath: string = "compass.png") {
        this.id = name;
        this.name = name;
        this.background = new Sprite(this.getFullPath(background));
        this.encounters = encounters.map(id => Monster.getById(id).copy());
        this.timePerMonster = timePerMonster;
        this.iconPath = iconPath;

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

AreaData.areas.push(new AreaData("Plains of Koloh", "plains.jpg",
    [
        "piou-easy",
        "chicken-easy",
        "slime-easy",
    ]));
    
    AreaData.areas.push(new AreaData("Snowy mountains", "mountains.jpg",
    [
        "wolf-easy",
        "beetle-easy",
    ]));

AreaData.areas.push(new AreaData("Dark forest", "forest.jpg",
    [
        "mushroom-easy",
        "plant-easy",
        "snake-easy"
    ]));

AreaData.areas.push(new AreaData("Keyns village", "ruinedvillage.jpg",
    [
        "goblin-easy",
        "spirit-easy",
        "ogre-easy",
        "cerbere-easy"
    ]));

    AreaData.areas.push(new AreaData("Fire's plains", "volcano.jpg",
    [
        "sorcerer-boss"
    ], 
    60, "boss-skull.png"));

AreaData.areas.push(new AreaData("Demon's castle", "darkcastle.jpg",
    [
        "demon-lord"
    ], 
    60, "boss-skull.png"));