const store = {
  id: 1,
  email: 'test@test.com',
  name: 'Test valid name',
  role: 'administrator',
  token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
          XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFR
          OWoU6GRwNokcce1mCydeSs`,
};

const users = [
  {
    id: 2,
    email: 'user2@test.com',
    name: 'Name of user 2',
    role: 'seller',
  },
  {
    id: 3,
    email: 'user3@test.com',
    name: 'Name of user 3',
    role: 'customer',
  },
];

const user = {
  id: 4,
  email: 'user4@test.com',
  name: 'Name of user 4',
  role: 'seller',
};

export { store, users, user };
