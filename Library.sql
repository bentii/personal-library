CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    rating INT,
    notes VARCHAR(300),
    imgUrl VARCHAR(300)
)