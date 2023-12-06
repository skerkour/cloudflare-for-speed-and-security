import { Blog, BlogValidator } from "@phoenix/core/entities";

export function parseBlogFromDB(blog: any): Blog {
  blog.navigation = JSON.parse(blog.navigation);
  return BlogValidator.parse(blog);
}
