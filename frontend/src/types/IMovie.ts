export interface IMovie {
  id: number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
  voteAverage: number;
  director?: string;
  genres?: string[];
  runtime?: number;
  is_watched?: boolean;
};
