DROP TABLE IF EXISTS comics;

CREATE TABLE comics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    comic_url VARCHAR(255),
    description TEXT,
    notes TEXT,
    cat_url VARCHAR(255),
    favorite_count INT DEFAULT 0,
    progress VARCHAR(255) 
)