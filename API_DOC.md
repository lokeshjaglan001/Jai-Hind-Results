# API Documentation

This document provides a complete reference for all the APIs available in the backend application.

---

## 🏠 App API

Handles the root endpoint of the application.

### Get Hello

-   **Route:** `GET /`
-   **Description:** A simple health check or welcome endpoint.
-   **Request Body:** None
-   **Returns:** A "Hello World!" string.

---

## 👥 Users API

Handles fetching user information (primarily for admin purposes).

### Get All Admin Users (Admin)

-   **Route:** `GET /users/admins`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Retrieves a list of all users who have the 'admin' role, intended for populating selection lists like course authors.
-   **Request Body:** None
-   **Returns:** An array of admin user objects, including `id`, `full_name`, `email`, and `role`.
    ```json
    [
      {
        "id": "number",
        "full_name": "string",
        "email": "string",
        "role": "admin"
      }
    ]
    ```

### Get All Users (Admin)

-   **Route:** `GET /users`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Retrieves a list of *all* registered users (both students and admins), ordered by creation date.
-   **Returns:** An array of user objects (excluding password hashes).

### Update User Details (Admin)

-   **Route:** `PUT /users/:id`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Updates details for a specific user, including their role, name, email, or password.
-   **URL Parameters:**
    -   `id` (number): The ID of the user to update.
-   **Request Body:** `application/json` (All fields are optional)
    ```json
    {
      "full_name": "New Name",
      "email": "new.email@example.com",
      "role": "student",
      "password": "a-new-strong-password"
    }
    ```
-   **Returns:** The updated user object (excluding the password hash).
-   **Errors:**
    -   `404 Not Found`: If the user ID does not exist.
    -   `409 Conflict`: If the new email is already in use by another user.

## 🔐 Auth API

Handles user authentication, including signup, login, and profile management.

### User Signup

-   **Route:** `POST /auth/signup`
-   **Description:** Registers a new user with the `student` role by default.
-   **Request Body:**
    ```json
    {
      "full_name": "string",
      "email": "string (valid email)",
      "password": "string (min 8 characters)"
    }
    ```
-   **Returns:** The newly created User object (without the password hash).

### User Login

-   **Route:** `POST /auth/login`
-   **Description:** Authenticates a user and returns a JSON Web Token (JWT).
-   **Request Body:**
    ```json
    {
      "email": "string (valid email)",
      "password": "string"
    }
    ```
-   **Returns:** An object containing the `access_token`.
    ```json
    {
      "access_token": "string"
    }
    ```

### Get User Profile

-   **Route:** `GET /auth/profile`
-   **Authentication:** **JWT Required**. The `access_token` must be provided in the `Authorization` header as a Bearer token.
-   **Description:** Retrieves the profile of the currently authenticated user, including their mock test attempts.
-   **Request Body:** None
-   **Returns:** The authenticated User object (without the password hash).

### Update User Profile

-   **Route:** `PUT /auth/profile`
-   **Authentication:** **JWT Required**. The `access_token` must be provided in the `Authorization` header as a Bearer token.
-   **Description:** Updates the profile information of the currently authenticated user. Only the provided fields will be updated.
-   **Request Body:**
    ```json
    {
      "full_name": "string (optional, min 2 characters)",
      "email": "string (optional, valid email)"
    }
    ```
-   **Returns:** The updated User object (without the password hash).
-   **Notes:** 
    - If updating email, the new email must not be already taken by another user.
    - Both fields are optional - you can update one or both.

---

## 📝 Posts API

Handles all operations related to blog posts.

### Create a new post

-   **Route:** `POST /posts`
-   **Description:** Creates a new post. If a thumbnail is included, it's uploaded automatically.
-   **Request Body:** `multipart/form-data`. This request combines the image file and all other post data.
    -   **file** (file, optional): The thumbnail image file.
    -   **title** (string): The title of the post.
    -   **slug** (string): The unique slug for the URL.
    -   **category\_id** (number): The ID of the category.
    -   **template\_id** (number): The ID of the post template.
    -   **content\_html** (string): The final HTML content of the post.
    -   **content\_json** (string, optional): A JSON string representing the structured content (e.g., `'{"key":"value"}'`).
    -   **tags** (string, optional): A comma-separated string of tag IDs (e.g., `"1,2,3"`).
    -   **description** (string, optional)
    -   **meta\_title** (string, optional)
    -   **meta\_description** (string, optional)
    -   **meta\_keywords** (string, optional)
-   **Returns:** The newly created Post object, including the `thumbnail_url` if a file was uploaded.

### Get all posts

-   **Route:** `GET /posts`
-   **Description:** Retrieves a list of all posts, ordered by creation date.
-   **Request Body:** None
-   **Returns:** An array of Post objects.

### Get a single post by ID

-   **Route:** `GET /posts/:id`
-   **Description:** Retrieves a specific post using its numerical ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the post.
-   **Request Body:** None
-   **Returns:** A single Post object.

### Get a single post by Slug

-   **Route:** `GET /posts/slug/:slug`
-   **Description:** Retrieves a specific post using its unique string slug.
-   **URL Parameters:**
    -   `slug` (string): The slug of the post.
-   **Request Body:** None
-   **Returns:** A single Post object.

### Update a post

-   **Route:** `PUT /posts/:id`
-   **Description:** Updates an existing post's details.
-   **URL Parameters:**
    -   `id` (number): The ID of the post to update.
-   **Request Body:** Same structure as the create request, but all fields are optional.
-   **Returns:** The updated Post object.

### Delete a post

-   **Route:** `DELETE /posts/:id`
-   **Description:** Deletes a post from the database.
-   **URL Parameters:**
    -   `id` (number): The ID of the post to delete.
-   **Request Body:** None
-   **Returns:** The deleted Post object.

---

## 📂 Categories API (for Posts)

Handles categories associated with blog posts.

### Create a new category

-   **Route:** `POST /categories`
-   **Description:** Creates a new post category.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The newly created Category object.

### Get all categories

-   **Route:** `GET /categories`
-   **Description:** Retrieves a list of all post categories.
-   **Request Body:** None
-   **Returns:** An array of Category objects.

### Get a single category by ID

-   **Route:** `GET /categories/:id`
-   **Description:** Retrieves a specific category by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the category.
-   **Request Body:** None
-   **Returns:** A single Category object.

### Update a category

-   **Route:** `PUT /categories/:id`
-   **Description:** Updates an existing category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to update.
-   **Request Body:**
    ```json
    {
      "name": "string (optional)",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The updated Category object.

### Delete a category

-   **Route:** `DELETE /categories/:id`
-   **Description:** Deletes a category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to delete.
-   **Request Body:** None
-   **Returns:** The deleted Category object.

---

## 🏷️ Tags API (for Posts)

Handles tags associated with blog posts.

### Create a new tag

-   **Route:** `POST /tags`
-   **Description:** Creates a new post tag.
-   **Request Body:**
    ```json
    {
      "name": "string"
    }
    ```
-   **Returns:** The newly created Tag object.

### Get all tags

-   **Route:** `GET /tags`
-   **Description:** Retrieves a list of all post tags.
-   **Request Body:** None
-   **Returns:** An array of Tag objects.

### Get a single tag by ID

-   **Route:** `GET /tags/:id`
-   **Description:** Retrieves a specific tag by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag.
-   **Request Body:** None
-   **Returns:** A single Tag object.

### Update a tag

-   **Route:** `PUT /tags/:id`
-   **Description:** Updates an existing tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to update.
-   **Request Body:**
    ```json
    {
      "name": "string (optional)"
    }
    ```
-   **Returns:** The updated Tag object.

### Delete a tag

-   **Route:** `DELETE /tags/:id`
-   **Description:** Deletes a tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to delete.
-   **Request Body:** None
-   **Returns:** The deleted Tag object.

---

## 📄 Post Templates API

Handles templates for structuring post content.

### Create a new post template

-   **Route:** `POST /post-templates`
-   **Description:** Creates a new post template.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string (optional)",
      "structure": "string"
    }
    ```
-   **Returns:** The newly created Post Template object.

### Get all post templates

-   **Route:** `GET /post-templates`
-   **Description:** Retrieves a list of all post templates.
-   **Request Body:** None
-   **Returns:** An array of Post Template objects.

### Get a single post template by ID

-   **Route:** `GET /post-templates/:id`
-   **Description:** Retrieves a specific post template by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the template.
-   **Request Body:** None
-   **Returns:** A single Post Template object.

### Update a post template

-   **Route:** `PUT /post-templates/:id`
-   **Description:** Updates an existing post template.
-   **URL Parameters:**
    -   `id` (number): The ID of the template to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Post Template object.

### Delete a post template

-   **Route:** `DELETE /post-templates/:id`
-   **Description:** Deletes a post template.
-   **URL Parameters:**
    -   `id` (number): The ID of the template to delete.
-   **Request Body:** None
-   **Returns:** The deleted Post Template object.

---

## 🧪 Mock Tests & Series API

Handles mock tests, the series they belong to, and related entities.

### Get all mock test series

-   **Route:** `GET /mock-series`
-   **Description:** Retrieves a list of all mock test series, including the count of enrolled users for each.
-   **Request Body:** None
-   **Returns:** An array of Mock Series objects, each **including an `enrolled_users_count` field**.

### Get a single mock series by Slugs

-   **Route:** `GET /mock-series/slug/:categorySlug/:seriesSlug`
-   **Description:** Retrieves a specific mock series using the category's slug and the series's own slug.
-   **URL Parameters:**
    -   `categorySlug` (string): The slug of the category.
    -   `seriesSlug` (string): The slug of the series.
-   **Request Body:** None
-   **Returns:** A single Mock Series object, including its associated tests.

### Create a new mock test series

-   **Route:** `POST /mock-series`
-   **Description:** Creates a new series to group mock tests. If a thumbnail is included, it's uploaded automatically.
-   **Request Body:** `multipart/form-data`. This request combines the image file and all other series data.
    -   **file** (file, optional): The thumbnail image file.
    -   **title** (string): The title of the series.
    -   **description** (string, optional)
    -   **price** (number): The price of the series.
    -   **category\_id** (number): The ID of the mock category.
    -   **tagIds** (string, optional): A comma-separated string of tag IDs (e.g., `"1,2,3"`).
-   **Returns:** The newly created Mock Series object, including the `thumbnail_url` if a file was uploaded.

### Get a single mock series by ID

-   **Route:** `GET /mock-series/:id`
-   **Description:** Retrieves a specific mock series and its associated tests.
-   **URL Parameters:**
    -   `id` (number): The ID of the series.
-   **Request Body:** None
-   **Returns:** A single Mock Series object.

### Update a mock series

-   **Route:** `PUT /mock-series/:id`
-   **Description:** Updates an existing mock series.
-   **URL Parameters:**
    -   `id` (number): The ID of the series to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Series object.

### Delete a mock series

-   **Route:** `DELETE /mock-series/:id`
-   **Description:** Deletes a mock series.
-   **URL Parameters:**
    -   `id` (number): The ID of the series to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Series object.

### Add a test to a series

-   **Route:** `POST /mock-series/:seriesId/tests/:testId`
-   **Description:** Associates an existing mock test with a mock series and generates the full slug.
-   **URL Parameters:**
    -   `seriesId` (number): The ID of the series.
    -   `testId` (number): The ID of the test.
-   **Request Body:** None
-   **Returns:** A `mock_series_tests` join table record.

### Remove a test from a series

-   **Route:** `DELETE /mock-series/:seriesId/tests/:testId`
-   **Description:** Removes the association between a test and a series.
-   **URL Parameters:**
    -   `seriesId` (number): The ID of the series.
    -   `testId` (number): The ID of the test.
-   **Request Body:** None
-   **Returns:** The deleted `mock_series_tests` join table record.

### Check enrollment status for a series

-   **Route:** `GET /mock-series/:id/check-enrollment`
-   **Authentication:** **JWT Required**.
-   **Description:** Checks if the authenticated user has successfully paid for and is enrolled in a mock series.
-   **URL Parameters:**
    -   `id` (number): The ID of the series.
-   **Request Body:** None
-   **Returns:** An object indicating enrollment status.
    ```json
    {
      "enrolled": "boolean"
    }
    ```

---

## 📜 Mock Tests API

### Get all mock tests

-   **Route:** `GET /mock-tests`
-   **Description:** Retrieves a list of all available mock tests.
-   **Request Body:** None
-   **Returns:** An array of Mock Test objects.

### Create a new mock test

-   **Route:** `POST /mock-tests`
-   **Description:** Creates a new standalone mock test.
-   **Request Body:**
    ```json
    {
      "title": "string",
      "description": "string (optional)",
      "duration_minutes": "number",
      "total_marks": "number",
      "is_free": "boolean (optional)"
    }
    ```
-   **Returns:** The newly created Mock Test object.

### Get a single mock test by ID

-   **Route:** `GET /mock-tests/:id`
-   **Description:** Retrieves a specific mock test and its questions by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the test.
-   **Request Body:** None
-   **Returns:** A single Mock Test object.

### Get a single mock test by full slug

-   **Route:** `GET /mock-tests/:categorySlug/:seriesSlug/:testSlug`
-   **Description:** Retrieves a specific mock test using its full, generated slug.
-   **URL Parameters:**
    -   `categorySlug` (string): The slug of the category.
    -   `seriesSlug` (string): The slug of the series.
    -   `testSlug` (string): The slug of the test.
-   **Request Body:** None
-   **Returns:** The `mock_series_tests` object containing the full test details.

### Update a mock test

-   **Route:** `PUT /mock-tests/:id`
-   **Description:** Updates an existing mock test.
-   **URL Parameters:**
    -   `id` (number): The ID of the test to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Test object.

### Delete a mock test

-   **Route:** `DELETE /mock-tests/:id`
-   **Description:** Deletes a mock test.
-   **URL Parameters:**
    -   `id` (number): The ID of the test to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Test object.

### Submit answers for a mock test

-   **Route:** `POST /mock-tests/:id/submit`
-   **Authentication:** **JWT Required**.
-   **Description:** Submits a user's answers for a mock test, calculates the score, and records the attempt.
-   **URL Parameters:**
    -   `id` (number): The ID of the test being submitted.
-   **Request Body:**
    ```json
    {
      "answers": {
        "questionId_1": "user_answer_1",
        "questionId_2": "user_answer_2"
      }
    }
    ```
-   **Returns:** The created Mock Attempt object with the final score.

### Get a single mock test attempt result

-   **Route:** `GET /mock-tests/attempts/:id`
-   **Authentication:** **JWT Required**.
-   **Description:** Retrieves detailed information about a specific mock test attempt, including all questions, correct answers, and user's answers. Users can only access their own attempts.
-   **URL Parameters:**
    -   `id` (number): The ID of the attempt.
-   **Request Body:** None
-   **Returns:** A Mock Attempt object with detailed information:
    ```json
    {
      "id": "string",
      "test_id": "string",
      "user_id": "string",
      "answers": {
        "questionId": "user_answer"
      },
      "score": "number",
      "started_at": "string (ISO date)",
      "completed_at": "string (ISO date)",
      "mock_tests": {
        "id": "string",
        "title": "string",
        "description": "string",
        "duration_minutes": "number",
        "total_marks": "number",
        "mock_questions": [
          {
            "id": "string",
            "question_text": "string",
            "question_type": "string",
            "options": {},
            "correct_answer": "string",
            "marks": "number"
          }
        ]
      },
      "users": {
        "id": "string",
        "full_name": "string",
        "email": "string"
      }
    }
    ```

---

## ❓ Mock Questions API

### Create a new mock question

-   **Route:** `POST /mock-questions`
-   **Description:** Adds a new question to a mock test.
-   **Request Body:**
    ```json
    {
      "test_id": "number",
      "question_text": "string",
      "question_type": "string ('mcq', 'true_false', 'fill_blank') (optional)",
      "options": {},
      "correct_answer": "string",
      "marks": "number (optional)"
    }
    ```
-   **Returns:** The newly created Mock Question object.

### Bulk upload questions via CSV

-   **Route:** `POST /mock-questions/upload/csv`
-   **Description:** Uploads a CSV file to create multiple questions for a specific test in one go.
-   **Request Body:** `multipart/form-data` with two fields:
    -   `file`: The CSV file.
    -   `test_id`: The ID of the mock test.
-   **Returns:** A confirmation message with the count of created questions.

### Get all mock questions

-   **Route:** `GET /mock-questions`
-   **Description:** Retrieves a list of all mock questions.
-   **Request Body:** None
-   **Returns:** An array of Mock Question objects.

### Get a single mock question by ID

-   **Route:** `GET /mock-questions/:id`
-   **Description:** Retrieves a specific mock question.
-   **URL Parameters:**
    -   `id` (number): The ID of the question.
-   **Request Body:** None
-   **Returns:** A single Mock Question object.

### Update a mock question

-   **Route:** `PUT /mock-questions/:id`
-   **Description:** Updates an existing mock question.
-   **URL Parameters:**
    -   `id` (number): The ID of the question to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Question object.

### Delete a mock question

-   **Route:** `DELETE /mock-questions/:id`
-   **Description:** Deletes a mock question.
-   **URL Parameters:**
    -   `id` (number): The ID of the question to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Question object.

---

## 📂 Mock Categories API (for Series)

### Create a new mock category

-   **Route:** `POST /mock-categories`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Creates a new category for mock test series.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The newly created Mock Category object.

### Get all mock categories

-   **Route:** `GET /mock-categories`
-   **Description:** Retrieves a list of all mock series categories.
-   **Request Body:** None
-   **Returns:** An array of Mock Category objects.

### Get a single mock category by ID

-   **Route:** `GET /mock-categories/:id`
-   **Description:** Retrieves a specific mock category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category.
-   **Request Body:** None
-   **Returns:** A single Mock Category object.

### Update a mock category

-   **Route:** `PUT /mock-categories/:id`
-   **Description:** Updates an existing mock category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Category object.

### Delete a mock category

-   **Route:** `DELETE /mock-categories/:id`
-   **Description:** Deletes a mock category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Category object.

---

## 🏷️ Mock Tags API (for Series)

### Create a new mock tag

-   **Route:** `POST /mock-tags`
-   **Description:** Creates a new tag for mock test series.
-   **Request Body:**
    ```json
    {
      "name": "string"
    }
    ```
-   **Returns:** The newly created Mock Tag object.

### Get all mock tags

-   **Route:** `GET /mock-tags`
-   **Description:** Retrieves a list of all mock series tags.
-   **Request Body:** None
-   **Returns:** An array of Mock Tag objects.

### Get a single mock tag by ID

-   **Route:** `GET /mock-tags/:id`
-   **Description:** Retrieves a specific mock tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag.
-   **Request Body:** None
-   **Returns:** A single Mock Tag object.

### Update a mock tag

-   **Route:** `PUT /mock-tags/:id`
-   **Description:** Updates an existing mock tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to update.
-   **Request Body:** Same as create, but `name` is optional.
-   **Returns:** The updated Mock Tag object.

### Delete a mock tag

-   **Route:** `DELETE /mock-tags/:id`
-   **Description:** Deletes a mock tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Tag object.

---

## 💰 Payments API

Handles payment processing via Razorpay.

### Create a payment order

-   **Route:** `POST /payments/create-order`
-   **Authentication:** **JWT Required**.
-   **Description:** Creates a Razorpay order for purchasing a mock series.
-   **Request Body:**
    ```json
    {
      "mock_series_id": "number"
    }
    ```
-   **Returns:** An object with order details for the frontend client.
    ```json
    {
        "order_id": "string",
        "amount": "number",
        "currency": "string",
        "series_title": "string"
    }
    ```

### Handle Razorpay Webhook

-   **Route:** `POST /payments/webhook/razorpay`
-   **Description:** An endpoint for Razorpay to send payment confirmation webhooks. It verifies the signature and updates the payment status in the database.
-   **Headers:**
    -   `x-razorpay-signature`: The signature provided by Razorpay for verification.
-   **Request Body:** The raw JSON payload sent by Razorpay.
-   **Returns:** A confirmation status.

---

## 🚀 Deployment API

Provides a secure, web-based interface to deploy application updates.

### Get the deployment page

-   **Route:** `GET /deployment`
-   **Description:** Returns an HTML page with a form to trigger a deployment.
-   **Request Body:** None
-   **Returns:** An HTML document.

### Trigger deployment

-   **Route:** `POST /deployment/deploy`
-   **Description:** Executes the deployment script (`git pull`, `npm run build`, `pm2 restart`) if the correct secret key is provided.
-   **Request Body:**
    ```json
    {
      "secretKey": "string"
    }
    ```
-   **Returns:** An object with the success status and the output from each command.

---

## 🎠 Carousel API

Handles the text items for the homepage carousel.

### Create a Carousel Item (Admin)

-   **Route:** `POST /carousel`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Creates a new text item for the carousel. Multiple items can be active simultaneously.
-   **Request Body:**
    ```json
    {
      "text": "string",
      "link": "string (optional, valid URL)",
      "is_active": "boolean (optional)"
    }
    ```
-   **Returns:** The newly created carousel item.

### Get Active Carousel Items (Public)

-   **Route:** `GET /carousel`
-   **Description:** Retrieves a list of all carousel items where `is_active` is `true`.
-   **Request Body:** None
-   **Returns:** An array of carousel items.

### Get All Carousel Items (Admin)

-   **Route:** `GET /carousel/all`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Retrieves a list of *all* carousel items (both active and inactive).
-   **Request Body:** None
-   **Returns:** An array of carousel items.

### Get Single Carousel Item (Admin)

-   **Route:** `GET /carousel/:id`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Retrieves a single carousel item by its ID.
-   **Request Body:** None
-   **Returns:** A single carousel item.

### Update a Carousel Item (Admin)

-   **Route:** `PUT /carousel/:id`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Updates an existing carousel item. Multiple items can be active simultaneously.
-   **URL Parameters:**
    -   `id` (number): The ID of the item to update.
-   **Request Body:**
    ```json
    {
      "text": "string (optional)",
      "is_active": "boolean (optional)"
    }
    ```
-   **Returns:** The updated carousel item.

### Delete a Carousel Item (Admin)

-   **Route:** `DELETE /carousel/:id`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Deletes a carousel item from the database.
-   **URL Parameters:**
    -   `id` (number): The ID of the item to delete.
-   **Request Body:** None
-   **Returns:** The deleted carousel item.

---

## 🎓 Courses API

Handles online courses, their structure (topics, lessons), and related data.

**Note:** Routes involving file uploads (`thumbnailFile`, `featuredImageFile`) expect `multipart/form-data`. Other `POST`, `PUT`, `PATCH` routes expect `application/json`. Admin routes require a valid JWT Bearer Token for an admin user.

### **Courses**

#### Create a Course (Admin)

-   **Route:** `POST /courses`
-   **Authentication:** Admin JWT Required.
-   **Description:** Creates a new course. Uploads thumbnail if provided.
-   **Request Body:** `multipart/form-data`
    -   `thumbnailFile` (file, optional): Course thumbnail image.
    -   `title` (string): Course title.
    -   `description` (string, optional): Course description.
    -   `intro_video_url` (string, optional): YouTube watch URL.
    -   `pricing_model` (string: `free` | `paid`): Pricing model.
    -   `regular_price` (number, optional): Required if `pricing_model` is `paid`.
    -   `sale_price` (number, optional): Must be less than `regular_price`.
    -   `category_id` (number): ID of the course category.
    -   `tagIds` (string, optional): Comma-separated string of course tag IDs (e.g., `"1,2,3"`).
    -   `authorIds` (string): Comma-separated string of admin user IDs.
    -   `total_duration_hhmm` (string, optional): Author-defined duration (e.g., `"02:30"`).
    -   `status` (string: `draft` | `published`, optional): Default is `draft`.
-   **Returns:** The newly created Course object.

#### Get All Courses (Public/Admin)

-   **Route:** `GET /courses`
-   **Authentication:** None (for published). Admin JWT Required to view drafts.
-   **Description:** Retrieves a list of courses. By default, returns only `published` courses. Admins can filter by status. Includes nested topics and lessons.
-   **Query Parameters:**
    -   `status` (string: `draft` | `published`, optional): Filters courses by status (Admin only for `draft`).
-   **Returns:** An array of Course objects, each including `category`, `authors`, `tags`, `enrolled_users_count`, `total_duration_hhmm`, `lesson_count`, and nested `course_topics` with their `lessons`.

#### Check Enrollment Status for a Course

-   **Route:** `GET /courses/:id/check-enrollment`
-   **Authentication:** **JWT Required**.
-   **Description:** Checks if the currently authenticated user is enrolled in (has active access to) the specified course.
-   **URL Parameters:**
    -   `id` (number): The ID of the course.
-   **Request Body:** None
-   **Returns:** An object indicating enrollment status.
    ```json
    {
      "enrolled": true
    }
    ```


#### Enroll in a Free Course

-   **Route:** `POST /courses/:id/enroll`
-   **Authentication:** **JWT Required**.
-   **Description:** Enrolls the currently authenticated user in a specific course, **only if the course is free**. Checks if the user is already enrolled before creating a new enrollment record.
-   **URL Parameters:**
    -   `id` (number): The ID of the free course to enroll in.
-   **Request Body:** None
-   **Returns (Success):** A confirmation message.
    ```json
    {
      "success": true,
      "message": "Successfully enrolled in the free course."
    }
    ```
-   **Returns (Error):**
    -   `404 Not Found`: If the course doesn't exist.
    -   `400 Bad Request`: If the course is not free.
    -   `409 Conflict`: If the user is already enrolled.

    
#### Get Single Course by ID (Admin)

-   **Route:** `GET /courses/id/:id`
-   **Authentication:** Admin JWT Required.
-   **Description:** Retrieves a single course by its numerical ID, including all details, topics, and lessons.
-   **URL Parameters:**
    -   `id` (number): The ID of the course.
-   **Returns:** A single Course object with full details.

#### Get Single Course by Slug (Public)

-   **Route:** `GET /courses/slug/:slug`
-   **Authentication:** None.
-   **Description:** Retrieves a single published course by its slug, including all details, topics, and lessons.
-   **URL Parameters:**
    -   `slug` (string): The URL slug of the course.
-   **Returns:** A single Course object with full details.

#### Update a Course (Admin)

-   **Route:** `PUT /courses/:id`
-   **Authentication:** Admin JWT Required.
-   **Description:** Updates an existing course. Uploads a new thumbnail if provided.
-   **URL Parameters:**
    -   `id` (number): The ID of the course to update.
-   **Request Body:** `multipart/form-data`. Include only fields to change.
    -   `thumbnailFile` (file, optional): New thumbnail image.
    -   *(Other fields from Create Course DTO, all optional)*
-   **Returns:** The updated Course object.

#### Delete a Course (Admin)

-   **Route:** `DELETE /courses/:id`
-   **Authentication:** Admin JWT Required.
-   **Description:** Deletes a course and all its associated topics and lessons.
-   **URL Parameters:**
    -   `id` (number): The ID of the course to delete.
-   **Returns:** The deleted Course object.

---

### **Topics (Sections within a Course)**

#### Create a Topic (Admin)

-   **Route:** `POST /courses/:courseId/topics`
-   **Authentication:** Admin JWT Required.
-   **Description:** Creates a new topic (section) within a specific course. The topic is automatically added to the end of the order.
-   **URL Parameters:**
    -   `courseId` (number): The ID of the course to add the topic to.
-   **Request Body:** `application/json`
    ```json
    {
      "title": "string",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The newly created Topic object.

#### Get Topics for a Course

-   **Route:** `GET /courses/:courseId/topics`
-   **Authentication:** None (publicly viewable if course is published) or Enrolled User JWT Required (depends on your access rules).
-   **Description:** Retrieves all topics (and their nested lessons) for a specific course, ordered correctly.
-   **URL Parameters:**
    -   `courseId` (number): The ID of the course.
-   **Returns:** An array of Topic objects, each including a nested array of `lessons`.

#### Update a Topic (Admin)

-   **Route:** `PUT /courses/topics/:topicId`
-   **Authentication:** Admin JWT Required.
-   **Description:** Updates an existing topic's details (title, description, order). Use the reorder endpoint for changing sequence.
-   **URL Parameters:**
    -   `topicId` (number): The ID of the topic to update.
-   **Request Body:** `application/json`
    ```json
    {
      "title": "string (optional)",
      "description": "string (optional)",
      "order": "number (optional)" // Use reorder endpoint for sequence changes
    }
    ```
-   **Returns:** The updated Topic object.

#### Delete a Topic (Admin)

-   **Route:** `DELETE /courses/topics/:topicId`
-   **Authentication:** Admin JWT Required.
-   **Description:** Deletes a topic and all its associated lessons.
-   **URL Parameters:**
    -   `topicId` (number): The ID of the topic to delete.
-   **Returns:** The deleted Topic object.

#### Reorder Topics (Admin)

-   **Route:** `PATCH /courses/:courseId/topics/reorder`
-   **Authentication:** Admin JWT Required.
-   **Description:** Updates the `order` field for all topics within a specific course based on the provided sequence of IDs.
-   **URL Parameters:**
    -   `courseId` (number): The ID of the course whose topics are being reordered.
-   **Request Body:** `application/json`
    ```json
    {
      "orderedTopicIds": [3, 1, 2] // Array of Topic IDs in the desired new order
    }
    ```
-   **Returns:** A confirmation or the updated list (depends on service implementation, currently returns result of Prisma transaction).

---

### **Lessons (within a Topic)**

#### Create a Lesson (Admin)

-   **Route:** `POST /courses/topics/:topicId/lessons`
-   **Authentication:** Admin JWT Required.
-   **Description:** Creates a new lesson within a specific topic. Uploads featured image if provided. The lesson is automatically added to the end of the order.
-   **URL Parameters:**
    -   `topicId` (number): The ID of the topic to add the lesson to.
-   **Request Body:** `multipart/form-data`
    -   `featuredImageFile` (file, optional): Lesson featured image.
    -   `title` (string): Lesson title.
    -   `description` (string, optional): Lesson description.
    -   `video_url` (string, optional): YouTube watch URL.
    -   `video_duration_sec` (number, optional): Manual input for video duration in seconds.
-   **Returns:** The newly created Lesson object.

#### Update a Lesson (Admin)

-   **Route:** `PUT /courses/lessons/:lessonId`
-   **Authentication:** Admin JWT Required.
-   **Description:** Updates an existing lesson's details. Uploads a new featured image if provided. Use the reorder endpoint for changing sequence.
-   **URL Parameters:**
    -   `lessonId` (number): The ID of the lesson to update.
-   **Request Body:** `multipart/form-data`. Include only fields to change.
    -   `featuredImageFile` (file, optional): New featured image.
    -   *(Other fields from Create Lesson DTO, all optional)*
-   **Returns:** The updated Lesson object.

#### Delete a Lesson (Admin)

-   **Route:** `DELETE /courses/lessons/:lessonId`
-   **Authentication:** Admin JWT Required.
-   **Description:** Deletes a lesson.
-   **URL Parameters:**
    -   `lessonId` (number): The ID of the lesson to delete.
-   **Returns:** The deleted Lesson object.

#### Reorder Lessons (Admin)

-   **Route:** `PATCH /courses/topics/:topicId/lessons/reorder`
-   **Authentication:** Admin JWT Required.
-   **Description:** Updates the `order` field for all lessons within a specific topic based on the provided sequence of IDs.
-   **URL Parameters:**
    -   `topicId` (number): The ID of the topic whose lessons are being reordered.
-   **Request Body:** `application/json`
    ```json
    {
      "orderedLessonIds": [5, 4, 6] // Array of Lesson IDs in the desired new order
    }
    ```
-   **Returns:** A confirmation or the updated list (depends on service implementation, currently returns result of Prisma transaction).

---

## 📂 Course Categories API

Handles categories specific to courses.

*(Self-explanatory CRUD routes similar to Post Categories/Tags)*

-   `POST /course-categories` (Admin)
-   `GET /course-categories` (Public/Admin)
-   `GET /course-categories/:id` (Public/Admin)
-   `PUT /course-categories/:id` (Admin)
-   `DELETE /course-categories/:id` (Admin)

---

## 🏷️ Course Tags API

Handles tags specific to courses.

*(Self-explanatory CRUD routes similar to Post Categories/Tags)*

-   `POST /course-tags` (Admin)
-   `GET /course-tags` (Public/Admin)
-   `GET /course-tags/:id` (Public/Admin)
-   `PUT /course-tags/:id` (Admin)
-   `DELETE /course-tags/:id` (Admin)

---