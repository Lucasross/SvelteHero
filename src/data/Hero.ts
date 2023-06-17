import Job, { Jobs } from "./Job";

export default class Hero {
    public readonly saveIndex: number;

    public name: string;
    public level: number;
    public experience: number;
    public attack: number; // note that it's damage per seconds (dps)
    public area_id: string | null; // reference to the area database
    private readonly job: string;

    constructor(saveIndex: number, name: string, level: number, experience: number, job: Jobs) {
        this.saveIndex = saveIndex;
        this.name = name;
        this.level = level;
        this.experience = experience;
        this.attack = Hero.baseAttackForLevel(level);
        this.area_id = null;
        this.job = Jobs[job];
    }

    // Act as a constructor
    Init(area_id: string): Hero {
        this.area_id = area_id;
        if (area_id == undefined)
            this.area_id = null;
        return this;
    }

    setName(name: string): Hero {
        this.name = name;
        return this;
    }

    getLocation(): string {
        return this.isInLocation() ? this.area_id : "Guild hall";
    }

    isInLocation(): boolean {
        return this.area_id != null;
    }

    sendToArea(areaId: string) {
        this.area_id = areaId;
        return this;
    }

    sendToGuild(): Hero {
        this.area_id = null;
        return this;
    }

    giveExp(exp: number, monsterLevel: number): Hero {
        let diff: number = this.level - monsterLevel;

        if (diff > 5 || diff < -5)
            exp = 0;
        else if (diff > 0)
            exp = exp * (1 - (diff / 5));

        this.experience += Math.round(exp);

        while (this.experience >= this.experienceToNextLevel()) {
            this.levelup();
        }
        return this;
    }

    experienceToNextLevel(): number {
        return Hero.experienceForLevel(this.level);
    }

    getJob() : Job {
        return Job.getById(Jobs[this.job]);
    }

    private levelup() {
        this.experience -= this.experienceToNextLevel();
        this.level += 1;
        this.attack = Hero.baseAttackForLevel(this.level);
    }

    static experienceForLevel(level: number): number {
        return Math.round((level * 100 * (level / 15)) + 350 * level);
    }

    static baseAttackForLevel(level: number): number {
        return level * 15;
    }

    static goldForNextHero(nbHero: number) {
        return 5000 * (Math.pow(nbHero, 3)) + 25000;
    }
}