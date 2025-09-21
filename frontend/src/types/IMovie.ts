export interface IMovie {
  id: string | number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage?: number;
  genres?: string[]; // basit tut
  runtime?: number;
}
