app.get('/api/posts', posts.getPosts);
app.post('/api/posts', posts.createPost);
app.put('/api/posts', posts.updatePost);
app.delete('/api/posts', posts.deletePost);
app.get('/api/posts/:slug', posts.getPostBySlug);
