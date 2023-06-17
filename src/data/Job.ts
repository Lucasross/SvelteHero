export enum Jobs {
    Warrior,
    Ranger,
    Wizard,
    Priest,
}

export default class Job {
    public static readonly jobs: Job[] = [
        new Job(Jobs.Warrior, "Warrior", "warlord-helmet.png"),
        new Job(Jobs.Ranger, "Ranger", "pocket-bow.png"),
        new Job(Jobs.Wizard, "Wizard" ,"wizard-staff.png"),
        new Job(Jobs.Priest, "Priest", "winged-scepter.png"),
    ]
    
    public readonly jobType: Jobs;
    public readonly name: string;
    public readonly pathIcon: string;

    private constructor(jobType: Jobs, name: string, pathIcon: string, ) {
        this.jobType = jobType;
        this.name = name;
        this.pathIcon = pathIcon;
    }

    public getPicture() {
        return "pictures/classes/" + this.pathIcon;
    }

    public static getById(target: Jobs) : Job {
        let filtered = this.jobs.filter(m => m.jobType == target);

        if (filtered.length == 0)
            throw new Error("The following job type '" + target + "' has no match in the job database.");

        return filtered[0];
    }
}