import type Hero from "./Hero";
import Monster from "./Monster";

export default class AreaData {
    public static areas: AreaData[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly background: string;
    public readonly encounters: Monster[];

    public area: AreaController;

    constructor(name: string, background: string, encounters: string[]) {
        this.id = name;
        this.name = name;
        this.background = background;
        this.encounters = encounters.map(id => Monster.getById(id));

        this.area = new AreaController(this);
    }

    // #region Data
    getPicture(): string {
        return "pictures/areas/" + this.background;
    }
    // #endregion

    // #region Update
    update() {
        this.area.update();
    }

    enter(hero: Hero) {
        this.area.enter(hero);
    } 

    leave(hero: Hero) {
        this.area.leave(hero);
    }

    setMonster(monster: Monster) {
        this.area.setMonster(monster);
    }

    getMonster() : Monster {
        return this.area.getMonster();
    }
    // #endregion

    // #region Static
    static getById(id: string): AreaData {
        let filtered = this.areas.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the monsters database.");

        return filtered[0];
    }
    // #endregion
}

// this class purpose is for runtime activity
class AreaController {
    private readonly area: AreaData;

    private monster: Monster = undefined;
    private heroes: Hero[] = [];

    constructor(area: AreaData) {
        this.area = area;        
        this.monster = area.encounters[Math.floor(Math.random() * area.encounters.length)];
    }

    update() {
        let damages = this.heroes.reduce((damages, h) => damages + h.attack, 0);

        this.monster.currentHealth -= damages;

        if(this.monster.currentHealth <= 0) {
            this.monster.currentHealth = this.monster.maxHealth; // reset current health
            this.setMonster(this.area.encounters[Math.floor(Math.random() * this.area.encounters.length)]);
        }
    }

    enter(hero: Hero) {
        this.heroes.push(hero);
    }

    leave(hero: Hero) {
        const index = this.heroes.indexOf(hero, 0);
        if (index > -1) {
            this.heroes.splice(index, 1);
        }
    }

    setMonster(monster: Monster) {
        this.monster = monster;
    }

    getMonster() : Monster {
        return this.monster;
    }
}

AreaData.areas.push(new AreaData("Plains of Koloh", "plains.jpg", ["slime-easy", "snake-easy"]));
AreaData.areas.push(new AreaData("Snowy mountains path", "mountains.jpg", ["slime-easy", "snake-easy"]));