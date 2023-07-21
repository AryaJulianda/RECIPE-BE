-- Active: 1689696093353@@127.0.0.1@6969@recipe_app@public
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(100) NOT NULL
);

CREATE TABLE category (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL
);

CREATE TABLE recipe (
  recipe_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  ingredients TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  img VARCHAR(200) DEFAULT 'https://placehold.co/600x400',

  CONSTRAINT fk_recipe_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_recipe_category
    FOREIGN KEY (category_id)
    REFERENCES category (category_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO users (username, email, password_hash) VALUES
  ('user1', 'user1@example.com', 'hashed_password1'),
  ('user2', 'user2@example.com', 'hashed_password2'),
  ('user3', 'user3@example.com', 'hashed_password3'),
  ('user4', 'user4@example.com', 'hashed_password4'),
  ('user5', 'user5@example.com', 'hashed_password5');

INSERT INTO category (category_name) VALUES
  ('main course'),
  ('appetizer'),
  ('dessert');

INSERT INTO recipe (user_id, title, ingredients, category_id) VALUES
  -- Resep 1
  (1, 'Spaghetti Bolognese', 'Spaghetti, daging sapi cincang, saus tomat, bawang, bawang putih, minyak zaitun', 1),
  -- Resep 2
  (1, 'Chicken Caesar Salad', 'Selada romaine, ayam grill, crouton, saus Caesar, keju Parmesan', 2),
  -- Resep 3
  (1, 'Chocolate Chip Cookies', 'Tepung, mentega, gula cokelat, cokelat chip, ekstrak vanili', 3),
  -- Resep 4
  (1, 'Margarita Pizza', 'Adonan pizza, saus tomat, keju mozzarella, daun basil segar, minyak zaitun', 1),
  -- Resep 5
  (1, 'Chicken Fried Rice', 'Nasi matang, daging ayam, wortel, kacang polong, telur, saus kedelai', 1),
  -- Resep 6
  (1, 'Guacamole', 'Alpukat, air jeruk nipis, bawang, tomat, daun ketumbar, garam', 2),
  -- Resep 7
  (1, 'Beef Stir Fry', 'Daging sapi, brokoli, paprika, saus kedelai, bawang putih, jahe', 1),
  -- Resep 8
  (1, 'Tomato Bruschetta', 'Roti baguette, tomat, bawang putih, daun basil, cuka balsamik, minyak zaitun', 2),
  -- Resep 9
  (1, 'Blueberry Pancakes', 'Adonan pancake, blueberry, susu, telur, sirup maple', 3),
  -- Resep 10
  (1, 'Lemon Garlic Shrimp', 'Udang, air jeruk nipis, bawang putih, mentega, daun peterseli, garam, merica', 1),
  -- Resep 11
  (1, 'Chicken Alfredo Pasta', 'Fettuccine, chicken breast, heavy cream, butter, garlic, Parmesan cheese', 1),
  -- Resep 12
  (1, 'Caesar Salad', 'Romaine lettuce, croutons, Parmesan cheese, Caesar dressing', 2),
  -- Resep 13
  (1, 'Chocolate Brownies', 'Butter, sugar, eggs, cocoa powder, flour, vanilla extract', 3),
  -- Resep 14
  (1, 'Baked Ziti', 'Ziti pasta, marinara sauce, ricotta cheese, mozzarella cheese', 1),
  -- Resep 15
  (1, 'Bruschetta Chicken', 'Chicken breasts, tomatoes, garlic, basil, balsamic glaze', 1),
  -- Resep 16
  (1, 'Spinach Artichoke Dip', 'Spinach, artichoke hearts, cream cheese, sour cream, mozzarella cheese', 2),
  -- Resep 17
  (1, 'Beef and Broccoli', 'Beef, broccoli, oyster sauce, soy sauce, ginger, garlic', 1),
  -- Resep 18
  (1, 'Caprese Skewers', 'Cherry tomatoes, fresh mozzarella, basil leaves, balsamic glaze', 2),
  -- Resep 19
  (1, 'Pumpkin Pie', 'Pumpkin puree, sweetened condensed milk, eggs, pumpkin spice', 3),
  -- Resep 20
  (1, 'Pesto Pasta with Shrimp', 'Penne pasta, shrimp, basil pesto, cherry tomatoes, pine nuts', 1);
UPDATE recipe
SET category_id = category.category_name
FROM category
WHERE recipe.category_id = category.category_id;

SELECT category.category_name AS category FROM recipe JOIN category ON recipe.category_id = category.category_id;

SELECT recipe.*, category.category_name AS category_name
FROM recipe
JOIN category ON recipe.category_id = category.category_id;

SELECT recipe.recipe_id, recipe.title, recipe.ingredients, recipe.img, category.category_name AS category FROM recipe JOIN category ON recipe.category_id = category.category_id;