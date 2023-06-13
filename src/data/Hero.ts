import AreaData from "./AreaData";

export default class Hero {
    public readonly saveIndex: number;
    
    public name: string;
    public level: number;
    public experience: number;
    public attack: number; // note that it's damage per seconds (dps)
    public area_id: string | null; // reference to the area database

    constructor(saveIndex: number, name: string, level: number, experience: number) {
        this.saveIndex = saveIndex;
        this.name = name;
        this.level = level;
        this.experience = experience;
        this.attack = level * 30;
        this.area_id = null;
    }

    // Act as a constructor
    Init(area_id: string): Hero {
        this.area_id = area_id;
        if (this.isInLocation()) {
            this.sendToArea(AreaData.getById(this.area_id));
        } else {
            this.area_id = null;
        }
        return this;
    }

    setName(name: string) : Hero {
        this.name = name;
        return this;
    }

    getLocation(): string {
        return this.isInLocation() ? this.area_id : "Guild hall";
    }

    isInLocation(): boolean {
        return this.area_id != null;
    }

    sendToArea(area: AreaData) {
        this.area_id = area.id;
        area.enter(this);
        return this;
    }

    sendToGuild() {
        AreaData.getById(this.area_id).leave(this);
        this.area_id = null;
    }

    giveExp(exp: number) {
        this.experience += exp;
    }

    experienceToNextLevel(): number {
        return this.level * (100 * this.level);
    }
}