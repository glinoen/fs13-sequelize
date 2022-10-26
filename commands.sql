CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('hessu hermanni', 'www.com', 'how to win when losing', 99);
insert into blogs (url, title) values ('www.fi', 'first blog');