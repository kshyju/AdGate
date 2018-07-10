export class Recommendation {
    public status: number; //1 : passed,2:warning,3 error
    public name: string;
    public description: string
    public meta:any;
    constructor(name:string,status:number)
    {
      this.name= name;
      this.status = status;

    }
  }
