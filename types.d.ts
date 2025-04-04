export interface ICategory {
  id: number;
  title: string;
  description?: string;
}
export interface ICategoryMutation {
  title: string;
  description?: string;
}

export interface IPlace {
  id: number;
  title: string;
  description?: string;
}

export interface IPlaceMutation {
  title: string;
  description?: string;
}

export interface IItemMutation {
  category_id: number;
  place_id: number;
  title: string;
  description?: string;
  images?: string | null;
}

export interface IItem extends IItemMutation {
  id: number;
}
