import AreaData from "./AreaData";
import type Guild from "./Guild";
import type { ISprite } from "./generic/ISprite";
import Sprite from "./generic/Sprite";

export default abstract class RegionData implements ISprite {
    public static regions: RegionData[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly areas: AreaData[] = [];
    public readonly sprite: Sprite;

    public readonly leftRegion: string;
    public readonly rightRegion: string;

    constructor(id: string, leftRegion: string, rightRegion: string, areas : string[], spritePath: string) {
        this.id = id;
        this.name = id;
        this.leftRegion = leftRegion;
        this.rightRegion = rightRegion;
        this.areas = areas.map(id => AreaData.getById(id));
        this.sprite = new Sprite(this.getFullPath(spritePath));
    }

    protected abstract isUnlocked(guild: Guild);

    private getFullPath(spriteName: string) {
        return "pictures/regions/" + spriteName + ".png";
    }

    public hasLeftRegion() {
        return this.leftRegion != null;
    }

    public hasRightRegion() {
        return this.rightRegion != null;
    }

    public leftRegionUnlocked(guild : Guild) : boolean {
        return this.hasLeftRegion() && RegionData.getById(this.leftRegion).isUnlocked(guild);
    }

    public rightRegionUnlocked(guild : Guild) : boolean {
        return this.hasRightRegion() && RegionData.getById(this.rightRegion).isUnlocked(guild);
    }

    public getLeftRegion() {
        return RegionData.getById(this.leftRegion);
    }

    public getRightRegion() {
        return RegionData.getById(this.rightRegion);
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

class MeivinRegion extends RegionData {

    constructor(leftRegion: string, rightRegion: string, areas : string[], spritePath: string) {
        super("Meivin", leftRegion, rightRegion, areas, spritePath);    
    }

    protected isUnlocked(guild: Guild) {
        return true;
    }
}

class EkosmaRegion extends RegionData {

    constructor(leftRegion: string, rightRegion: string, areas : string[], spritePath: string) {
        super("Ekosma", leftRegion, rightRegion, areas, spritePath);    
    }

    protected isUnlocked(guild: Guild) {
        return guild.GetShaanahPastFlag();
    }
}

RegionData.regions.push(new MeivinRegion(null, "Ekosma",
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

RegionData.regions.push(new EkosmaRegion("Meivin", null,
[
    "Pirate Bay",
], "world_map_ekosma"))