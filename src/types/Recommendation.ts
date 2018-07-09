export class Recommendation {
    public status: number; //1 : passed,2:warning,3 error
    public title: string;
    public description: string
    public meta:any;
    constructor(title:string,status:number)
    {
      this.title= title;
      this.status = status;

    }
  }
