CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL
);
CREATE UNIQUE INDEX index_users_on_email ON users (email);


CREATE TABLE blogs (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    navigation JSONB NOT NULL,
    description TEXT NOT NULL
);
CREATE INDEX index_blogs_on_user_id ON blogs (user_id);
CREATE UNIQUE INDEX index_blogs_on_slug ON blogs (user_id);


CREATE TYPE PAGE_TYPE AS ENUM ('page', 'post');

CREATE TABLE pages (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    type PAGE_TYPE NOT NULL,
    content_html TEXT NOT NULL,

    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,

    UNIQUE(slug, blog_id)
);
CREATE INDEX index_pages_on_blog_id ON pages (blog_id);
CREATE INDEX index_pages_on_slug ON pages (slug);
CREATE INDEX index_pages_on_type ON pages (type);


CREATE TABLE assets (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,


    blog_id UUID NOT NULL REFERENCES blogs(id)
);
