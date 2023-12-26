import { Blog, BlogValidator } from "@cloudflarebook.com/core/entities";

export function parseBlogFromDB(blog: any): Blog {
  blog.navigation = JSON.parse(blog.navigation);
  return BlogValidator.parse(blog);
}
