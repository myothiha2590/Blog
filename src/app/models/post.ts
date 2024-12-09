export interface Post {
  title: string | null;
  permalink: string;
  category: {
    categoryId: string;
    category: string;
  };
  postImgPath: string;
  excerpt: string;
  content: string;
}
