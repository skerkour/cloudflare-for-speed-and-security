export enum PageType {
  Page = 'page',
  Post = 'post',
};

export type Blog = {
  id: string;
  created_at: Date;
  updated_at: Date;

  name: string;
  slug: string;
  navigation: Record<string, string>,
  description: string,
};

export type Page = {
  id: string;
  created_at: Date;
  updated_at: Date;

  slug: string;
  type: PageType;
  title: string;
  content_html: string,

  blog_id: string;
};
