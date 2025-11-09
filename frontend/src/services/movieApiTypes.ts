export interface IMovieApiResponse {
  id: number;
  title: string;
  description: string;
  image: string;
  imdb_point: number;
  types: string[];
  release_year: number;
  director: string;
  duration: string;
  is_watched: boolean;
  Like_Count: number;
  is_liked: boolean;
}
