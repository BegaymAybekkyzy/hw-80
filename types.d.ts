export interface ICategory {
  title: string;
  description?: string;
}

export interface IPlace {
  title: string;
  description?: string;
}

export interface IItem {
  category_id: number;
  place_id: number;
  title: string;
  description?: string;
  image?: string;
}
