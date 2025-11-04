export interface IBook {
  id: number;
  title: string;
  author?: string;
  description?: string;
  publish_date?: number;
  genre?: string;
  image?: string;
  Page_Count?: number;
  is_read?: boolean;
};
