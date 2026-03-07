const bcrypt = require('bcrypt');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password', // will be hashed in model pre-save hook
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password',
    },
]

module.exports = users;
