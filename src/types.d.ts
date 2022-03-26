interface Picture {
  fileName: string;
  invert: boolean;
}

interface Brand {
  slug: string;
  name: string;
  subscribers: number;
  picture: Picture;
}

interface Category {
  slug: string;
  name: string;
}

interface Entry {
  title: string;
  slug: string;
  brandSlug: string;
  categorySlugs: string[];
  stats: {
    uploadTime: string;
    views: number;
    likes: number;
    dislikes: number;
    favorites: number;
  };
  picture: Picture;
}

interface Section {
  title: string;
  entries: string[];
}

interface Data {
  brands: { [key: string]: Brand };
  categories: { [key: string]: Category };
  entries: { [key: string]: Entry };
  sections: Section[];
}
