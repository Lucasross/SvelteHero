import type AreaData from "./AreaData";

export default class Hero {
    public name: string;
    public level: number;
    public attack: number; // note that it's damage per seconds (dps)
    public area_id: string | null; // reference to the area database 

    constructor(name: string, level: number) {
        this.name = name;
        this.level = level;
        this.attack = level * 5;
        this.area_id = null;
    }

    getLocation() : string {
        return this.isInLocation() ? this.area_id : "Guild hall";
    }

    isInLocation() : boolean {
        return this.area_id != null;
    }

    sendToArea(area: AreaData) {
        this.area_id = area.id;
    }

    sendToGuild() {
        this.area_id = null;
    }
}