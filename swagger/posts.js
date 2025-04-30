/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         authorId:
 *           type: integer
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *             image:
 *               type: string
 *               nullable: true
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieve a list of all posts.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new post
 *     description: Create a new post with the provided details.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreatePost'
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieve a specific post by its ID.
 *     tags:
 *       - Posts
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to retrieve.
 *     responses:
 *       200:
 *         description: Post retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a post
 *     description: Update the details of an existing post.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePost'
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Unauthorized to update this post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a post
 *     description: Delete a specific post by ID.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       403:
 *         description: Unauthorized to delete this post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error
 */
