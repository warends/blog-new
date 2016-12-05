app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
app.post('/api/users', users.createUser);
app.put('/api/users', users.updateUser);
