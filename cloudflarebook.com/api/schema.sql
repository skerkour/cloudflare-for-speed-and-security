CREATE TABLE users (
    id TEXT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL
);
CREATE UNIQUE INDEX index_users_on_email ON users (email);

CREATE TABLE blogs (
    id TEXT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    navigation JSONB NOT NULL,
    description_html TEXT NOT NULL
);
CREATE UNIQUE INDEX index_blogs_on_slug ON blogs (slug);


CREATE TABLE pages (
    id TEXT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content_html TEXT NOT NULL,

    blog_id TEXT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,

    UNIQUE(slug, blog_id)
);
CREATE INDEX index_pages_on_blog_id ON pages (blog_id);
CREATE INDEX index_pages_on_slug ON pages (slug);
CREATE INDEX index_pages_on_type ON pages (type);


CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    blog_id TEXT NOT NULL REFERENCES blogs(id)
);
