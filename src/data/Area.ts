export default class Area {
    public name: string;
    public background: string;

    constructor(name: string, background: string) {
        this.name = name;
        this.background = background;
    }

    getPicture() : string {
        return "pictures/areas/" + this.background;
    }
}