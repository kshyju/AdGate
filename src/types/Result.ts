export class Result {
  public issueCount: number;
  public url: string;
  public id: string

  constructor(id:string,issueCount:number)
  {
    this.id= id;
    this.issueCount = issueCount;
  }
}
