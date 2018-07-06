export class Result {
  public resultCount: number;
  public url: string;
  public id: string

  constructor(id:string,resultCount:number)
  {
    this.id= id;
    this.resultCount = resultCount;
  }
}
