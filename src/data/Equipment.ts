import Loot from "./Loot";

export default class Equipment extends Loot {
    public static equipments: Equipment[] = [];
    
    protected picturesPath(): string {
        return "equipments";
    }

    public static getById(id: string): Equipment {
        return Loot.getLootById<Equipment>(Equipment.equipments, id, "equipment");
    }
}

Equipment.equipments.push(new Equipment("Helmet", "close_helmet"));
Equipment.equipments.push(new Equipment("Robe", "cloth_robe"));
Equipment.equipments.push(new Equipment("Necklace", "necklace_losange"));
Equipment.equipments.push(new Equipment("Tower Shield", "tower_shield"));