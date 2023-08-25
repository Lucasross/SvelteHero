import AreaData from "./AreaData";
import type { ISprite } from "./generic/ISprite";
import Sprite from "./generic/Sprite";

export default class RegionData implements ISprite {
    public static regions: RegionData[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly areas: AreaData[] = [];
    public readonly sprite: Sprite;

    constructor(id: string, areas : string[], spritePath: string) {
        this.id = id;
        this.name = id;
        this.areas = areas.map(id => AreaData.getById(id));
        this.sprite = new Sprite(this.getFullPath(spritePath));
    }

    private getFullPath(spriteName: string) {
        return "pictures/regions/" + spriteName + ".png";
    }

    getSprite(): Promise<any> {
        return this.sprite.get();
    }

    public static getById(id: string) {
        let filtered = this.regions.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the region database.");

        return filtered[0];
    }
}

RegionData.regions.push(new RegionData("Meivin",
[
    "Training center",
    "Koloh's plains",
    "Dark forest",
    "Keyn's village",
    "Keyn's lair",

    "Walker Bridge",
    "Neon City",
    "Neon Harbour",
    "The Undergrounds",
    "The pit",

    "Wrecker Sea",
    "Hall of Corals",
    "Moppei's village",
    "Fire's path",
    "Implosion Point",

    "Toori's passage",
    "Disillusion city",
    "Tower of contemplations",
    "Ice's path",

    "Valley of ice",
    "Island of risk",
    "Island of savagery",
    "Island of dispair",
    "Meteor site",
], "world_map"))