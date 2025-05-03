/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         postId:
 *           type: integer
 *         userId:
 *           type: integer
 *         user:
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
 */

/**
 * @swagger
 * /comments/{id}:
 *   post:
 *     summary: Create a comment
 *     description: Create a new comment on a specific post.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to comment on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a comment.
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get comments for a post
 *     description: Retrieve all comments for a specific post.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to retrieve comments for.
 *     responses:
 *       200:
 *         description: Comments fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a comment
 *     description: Update the content of an existing comment.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a comment.
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       403:
 *         description: Unauthorized to update this comment.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a specific comment by ID.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       403:
 *         description: Unauthorized to delete this comment.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Internal server error
 */
