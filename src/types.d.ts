interface Picture {
  fileName: string;
  invert: boolean;
}

interface Brand {
  slug: string;
  name: string;
  description: string;
  subscribers: number;
  picture: Picture;
  sites: { name: string; url: string }[];
  attributes: { [key: string]: string };
}

interface Category {
  slug: string;
  name: string;
}

interface EntryComment {
  username: string;
  body: string;
  likes: number;
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
  comments: EntryComment[];
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
