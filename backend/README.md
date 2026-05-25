# API Documentation

This document provides a detailed overview of all available API endpoints.

---

## Tags API

Handles all operations related to tags.

### Create a new tag

- **Route:** `POST /tags`
- **Description:** Creates a new tag record in the database.
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Returns:** Newly created Tag object.

### Get all tags

- **Route:** `GET /tags`
- **Description:** Retrieves a list of all existing tags.
- **Request Body:** None
- **Returns:** Array of Tag objects.

### Get a single tag

- **Route:** `GET /tags/:id`
- **Description:** Retrieves a specific tag by its unique ID.
- **Request Body:** None
- **Returns:** Corresponding Tag object.

### Update a tag

- **Route:** `PUT /tags/:id`
- **Description:** Updates the details of a specific tag.
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Returns:** Updated Tag object.

### Delete a tag

- **Route:** `DELETE /tags/:id`
- **Description:** Removes a tag from the database.
- **Request Body:** None
- **Returns:** Deleted Tag object.

---

## Posts API

Manages blog posts and articles.

### Create a new post

- **Route:** `POST /posts`
- **Description:** Creates a new post.
- **Request Body:**
  ```json
  {
    "title": "string",
    "slug": "string",
    "category_id": "number",
    "template_id": "number",
    "content_json": {},
    "content_html": "string",
    "thumbnail_url": "string",
    "external_url": "string",
    "tags": ["number"]
  }
  ```
- **Returns:** Newly created Post object.

### Get all posts

- **Route:** `GET /posts`
- **Description:** Fetches all posts.
- **Request Body:** None
- **Returns:** Array of Post objects.

### Get a single post

- **Route:** `GET /posts/:id`
- **Description:** Retrieves a post by its ID.
- **Request Body:** None
- **Returns:** Single Post object.

### Update a post

- **Route:** `PUT /posts/:id`
- **Description:** Updates an existing post.
- **Request Body:**
  ```json
  {
    "title": "string",
    "slug": "string",
    "category_id": "number",
    "template_id": "number",
    "content_json": {},
    "content_html": "string",
    "thumbnail_url": "string",
    "external_url": "string",
    "tags": ["number"]
  }
  ```
- **Returns:** Updated Post object.

### Delete a post

- **Route:** `DELETE /posts/:id`
- **Description:** Deletes a post.
- **Request Body:** None
- **Returns:** Deleted Post object.

---

## Post Templates API

Manages templates for creating posts.

### Create a new post template

- **Route:** `POST /post-templates`
- **Description:** Creates a new template for posts.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "structure": {}
  }
  ```
- **Returns:** Newly created PostTemplate object.

### Get all post templates

- **Route:** `GET /post-templates`
- **Description:** Retrieves all available post templates.
- **Request Body:** None
- **Returns:** Array of PostTemplate objects.

### Get a single post template

- **Route:** `GET /post-templates/:id`
- **Description:** Fetches a single template by its ID.
- **Request Body:** None
- **Returns:** PostTemplate object.

### Update a post template

- **Route:** `PUT /post-templates/:id`
- **Description:** Updates an existing post template.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "structure": {}
  }
  ```
- **Returns:** Updated PostTemplate object.

### Delete a post template

- **Route:** `DELETE /post-templates/:id`
- **Description:** Deletes a post template.
- **Request Body:** None
- **Returns:** Deleted PostTemplate object.

---

## Mock Tests API

Endpoints for managing mock tests.

### Create a mock test

- **Route:** `POST /mock-tests`
- **Description:** Creates a new mock test.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "duration_minutes": "number",
    "total_marks": "number",
    "is_free": "boolean",
    "series_id": "number"
  }
  ```
- **Returns:** New MockTest object.

### Get all mock tests

- **Route:** `GET /mock-tests`
- **Description:** Fetches all mock tests.
- **Request Body:** None
- **Returns:** Array of MockTest objects.

### Get a single mock test

- **Route:** `GET /mock-tests/:id`
- **Description:** Retrieves a specific mock test by ID.
- **Request Body:** None
- **Returns:** Single MockTest object.

### Update a mock test

- **Route:** `PUT /mock-tests/:id`
- **Description:** Updates an existing mock test.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "duration_minutes": "number",
    "total_marks": "number",
    "is_free": "boolean",
    "series_id": "number"
  }
  ```
- **Returns:** Updated MockTest object.

### Delete a mock test

- **Route:** `DELETE /mock-tests/:id`
- **Description:** Deletes a mock test.
- **Request Body:** None
- **Returns:** Deleted MockTest object.

---

## Mock Tags API

Manages tags specifically for mock tests.

### Create a new mock tag

- **Route:** `POST /mock-tags`
- **Description:** Creates a new tag for mock tests.
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Returns:** New MockTag object.

### Get all mock tags

- **Route:** `GET /mock-tags`
- **Description:** Retrieves all mock tags.
- **Request Body:** None
- **Returns:** Array of MockTag objects.

### Get a single mock tag

- **Route:** `GET /mock-tags/:id`
- **Description:** Fetches a mock tag by its ID.
- **Request Body:** None
- **Returns:** Single MockTag object.

### Update a mock tag

- **Route:** `PUT /mock-tags/:id`
- **Description:** Updates a mock tag.
- **Request Body:**
  ```json
  {
    "name": "string"
  }
  ```
- **Returns:** Updated MockTag object.

### Delete a mock tag

- **Route:** `DELETE /mock-tags/:id`
- **Description:** Deletes a mock tag.
- **Request Body:** None
- **Returns:** Deleted MockTag object.

---

## Mock Series API

Manages series or collections of mock tests.

### Create a new mock series

- **Route:** `POST /mock-series`
- **Description:** Creates a new mock test series.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "price": "number",
    "category_id": "number",
    "tagIds": ["number"]
  }
  ```
- **Returns:** New MockSeries object.

### Get all mock series

- **Route:** `GET /mock-series`
- **Description:** Retrieves all mock test series.
- **Request Body:** None
- **Returns:** Array of MockSeries objects.

### Get a single mock series

- **Route:** `GET /mock-series/:id`
- **Description:** Fetches a mock series by its ID.
- **Request Body:** None
- **Returns:** Single MockSeries object.

### Update a mock series

- **Route:** `PUT /mock-series/:id`
- **Description:** Updates an existing mock series.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "price": "number",
    "category_id": "number",
    "tagIds": ["number"]
  }
  ```
- **Returns:** Updated MockSeries object.

### Delete a mock series

- **Route:** `DELETE /mock-series/:id`
- **Description:** Deletes a mock series.
- **Request Body:** None
- **Returns:** Deleted MockSeries object.

---

## Mock Questions API

Handles questions within mock tests.

### Create a new mock question

- **Route:** `POST /mock-questions`
- **Description:** Adds a new question to a mock test.
- **Request Body:**
  ```json
  {
    "test_id": "number",
    "question_text": "string",
    "question_type": "mcq | true_false | fill_blank",
    "options": {},
    "correct_answer": "string",
    "marks": "number"
  }
  ```
- **Returns:** New MockQuestion object.

### Bulk upload questions via CSV

- **Route:** `POST /mock-questions/upload/csv`
- **Description:** Creates multiple mock questions from a CSV file upload.
- **Request Body:** `multipart/form-data` containing the CSV file and a `test_id`.<br>
Format of CSV:
  ```
  question_text,question_type,options,correct_answer,marks
  "What is 2+2?","mcq","{\"A\":\"3\",\"B\":\"4\",\"C\":\"5\"}","B",1
  "The sky is blue.","true_false","","true",1
  ```
- **Returns:** Confirmation message with count of created questions.

### Get all mock questions

- **Route:** `GET /mock-questions`
- **Description:** Fetches all mock questions from all tests.
- **Request Body:** None
- **Returns:** Array of MockQuestion objects.

### Get a single mock question

- **Route:** `GET /mock-questions/:id`
- **Description:** Retrieves a question by its ID.
- **Request Body:** None
- **Returns:** Single MockQuestion object.

### Update a mock question

- **Route:** `PUT /mock-questions/:id`
- **Description:** Updates a question's details.
- **Request Body:**
  ```json
  {
    "test_id": "number",
    "question_text": "string",
    "question_type": "mcq | true_false | fill_blank",
    "options": {},
    "correct_answer": "string",
    "marks": "number"
  }
  ```
- **Returns:** Updated MockQuestion object.

### Delete a mock question

- **Route:** `DELETE /mock-questions/:id`
- **Description:** Deletes a question.
- **Request Body:** None
- **Returns:** Deleted MockQuestion object.

---

## Mock Categories API

Manages categories for mock test series.

### Create a new mock category

- **Route:** `POST /mock-categories`
- **Description:** Creates a new category for mock series.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Returns:** New MockCategory object.

### Get all mock categories

- **Route:** `GET /mock-categories`
- **Description:** Retrieves all mock categories.
- **Request Body:** None
- **Returns:** Array of MockCategory objects.

### Get a single mock category

- **Route:** `GET /mock-categories/:id`
- **Description:** Fetches a mock category by ID.
- **Request Body:** None
- **Returns:** Single MockCategory object.

### Update a mock category

- **Route:** `PUT /mock-categories/:id`
- **Description:** Updates an existing mock category.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Returns:** Updated MockCategory object.

### Delete a mock category

- **Route:** `DELETE /mock-categories/:id`
- **Description:** Deletes a mock category.
- **Request Body:** None
- **Returns:** Deleted MockCategory object.

---

## Categories API

General purpose categories, e.g., for blog posts.

### Create a new category

- **Route:** `POST /categories`
- **Description:** Creates a new category.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Returns:** New Category object.

### Get all categories

- **Route:** `GET /categories`
- **Description:** Retrieves all categories.
- **Request Body:** None
- **Returns:** Array of Category objects.

### Get a single category

- **Route:** `GET /categories/:id`
- **Description:** Fetches a category by its ID.
- **Request Body:** None
- **Returns:** Single Category object.

### Update a category

- **Route:** `PUT /categories/:id`
- **Description:** Updates an existing category.
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Returns:** Updated Category object.

### Delete a category

- **Route:** `DELETE /categories/:id`
- **Description:** Deletes a category.
- **Request Body:** None
- **Returns:** Deleted Category object.

---

## Auth & Courses API

- **Routes:** `/auth`, `/courses`
- **Description:** These controllers are currently placeholders and do not contain any functional endpoints. They can be extended to include features like user authentication and course management in the future.

