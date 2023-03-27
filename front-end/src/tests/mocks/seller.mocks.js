const store = {
  id: 2,
  email: 'test@test.com',
  name: 'Test valid name',
  role: 'seller',
  token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
          XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFR
          OWoU6GRwNokcce1mCydeSs`,
};

const orders = [{
  id: 1,
  saleDate: new Date(Date.now()).toISOString(),
  status: 'Pendente',
  totalPrice: '7,50',
  deliveryAddress: 'AAAA, BBB',
  deliveryNumber: '999',
}];

const sale = {
  id: 1,
  seller: { name: 'Seller Name ' },
  totalPrice: '7.50',
  saleDate: new Date(Date.now()).toISOString(),
  status: 'Pendente',
  products: [{
    id: 2,
    name: 'Heineken 600ml',
    price: '7.50',
    urlImage: 'http://algumaimagem.com.br',
    SalesProducts: { quantity: 1 },
  }],
};

export { store, orders, sale };
