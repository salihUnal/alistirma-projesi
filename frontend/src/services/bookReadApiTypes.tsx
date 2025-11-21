export interface bookReadApiResponse {
  Id: number;
  Book_Name: string;
  Completed: boolean;
  Author_Name: string;
  Genre: string;
  Is_liked?: boolean;
  Like_Count?: number;
  Creation_At: number;
  Updated_At: number;
  User_Id: number;
}
