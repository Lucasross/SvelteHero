import type { ISprite } from "./generic/ISprite";
import Sprite from "./generic/Sprite";

export default class Equipment implements ISprite {

    public static equipments: Equipment[] = []; 
    
    public readonly id: string;
    public readonly name: string;
    public readonly spriteName: string;
    public readonly sprite: Sprite;

    constructor(name: string, spriteName: string) {
        this.id = name;
        this.name = name;
        this.spriteName = spriteName;
        this.sprite = new Sprite(this.getFullPath(spriteName));
    }

    getSprite(): Promise<any> {
        return this.sprite.sprite;
    }

    static getById(id: string): Equipment {
        let filtered = this.equipments.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the equipment database.");

        return filtered[0];
    }

    private getFullPath(file: string): string {
        return "pictures/equipments/" + file + ".png";
    }
}

Equipment.equipments.push(new Equipment("Helmet", "close_helmet"));
Equipment.equipments.push(new Equipment("Robe", "cloth_robe"));
Equipment.equipments.push(new Equipment("Necklace", "necklace_losange"));
Equipment.equipments.push(new Equipment("Tower Shield", "tower_shield"));