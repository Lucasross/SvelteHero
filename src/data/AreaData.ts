import type { Writable } from "svelte/store";
import { get } from "svelte/store";
import type Hero from "./Hero";
import Monster from "./Monster";
import type Guild from "./Guild";

export default class AreaData {
    public static areas: AreaData[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly background: string;
    public readonly encounters: Monster[];
    public readonly timePerMonster: number | null;
    public readonly iconPath: string;

    public area: AreaController;

    constructor(name: string, background: string, encounters: string[], timePerMonster: number | null = null, iconPath: string = "compass.png") {
        this.id = name;
        this.name = name;
        this.background = background;
        this.encounters = encounters.map(id => Monster.getById(id).copy());
        this.timePerMonster = timePerMonster;
        this.iconPath = iconPath;

        this.area = new AreaController(this);
    }

    // #region Data
    getPicture(): string {
        return "pictures/areas/" + this.background;
    }

    levelRange(): string {
        const levels = this.encounters.map(m => m.level);
        const min = Math.min(...levels);
        const max = Math.max(...levels);
        if (min == max)
            return `Monsters level : ${min}`
        else
            return `Monsters levels : ${min} - ${max}`
    }

    isTimedArea(): boolean {
        return this.timePerMonster != null
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

        if(area.isTimedArea())
            this.currentTimer = area.timePerMonster;
    }

    update(guild: Writable<Guild>) {
        let damages = this.getAreaDps();

        this.monster.currentHealth -= damages;

        if (this.monster.currentHealth <= 0) {
            this.monster.die(guild);
            this.heroes.forEach(h => h.update(h => h.giveExp(this.monster.experience, this.monster.level)));
            this.setMonster(this.area.encounters[Math.floor(Math.random() * this.area.encounters.length)]);
        }
    }

    updateTimer(deltaTime: number) {
        this.currentTimer -= deltaTime;
        if(this.currentTimer <= 0) {
            this.monster.currentHealth = this.monster.maxHealth;
            this.currentTimer = this.area.timePerMonster;
        }
    }

    getAreaDps(): number {
        return this.heroes.reduce((damages, h) => damages + get(h).attack, 0)
    }

    enter(hero: Writable<Hero>) {
        this.heroes.push(hero);
    }

    leave(hero: Writable<Hero>) {
        const index = this.heroes.indexOf(hero, 0);
        if (index > -1) {
            this.heroes.splice(index, 1);
        }
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

AreaData.areas.push(new AreaData("Plains of Koloh", "plains.jpg", ["piou-easy", "chicken-easy", "slime-easy"]));
AreaData.areas.push(new AreaData("Snowy mountains", "mountains.jpg", ["beetle-easy", "slime-easy", "mushroom-easy"]));
AreaData.areas.push(new AreaData("Dark forest", "forest.jpg", ["mushroom-easy", "wolf-easy", "snake-easy"]));

AreaData.areas.push(new AreaData("Demon's castle", "darkcastle.jpg", ["demon-lord"], 60, "boss-skull.png"));