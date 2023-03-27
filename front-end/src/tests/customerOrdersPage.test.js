import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import renderWithRouter from './helpers/renderWithRouter';
import { orders, store } from './mocks/customer.mocks';

import customerContext from '../context/CustomerContext';
import CustomerOrders from '../pages/CustomerOrders';

const dataTestId = 'customer_orders__element-order-id-1';
const dataTestStatus = 'customer_orders__element-delivery-status-1';
const dataTestDate = 'customer_orders__element-order-date-1';
const dataTestPrice = 'customer_orders__element-card-price-1';

describe('Test customer orders page', () => {
  beforeEach(() => {
    global.localStorage.setItem('user', JSON.stringify(store));

    jest.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: orders });
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Test if all elements exist in screen', () => {
    it('should render all elements in screen', async () => {
      const setShop = jest.fn();
      const shop = [];

      renderWithRouter(
        <customerContext.Provider value={ {setShop, shop} }>
          <CustomerOrders />
        </customerContext.Provider>
      )

      await waitFor(() => {
        const id = screen.getByTestId(dataTestId);
        const status = screen.getByTestId(dataTestStatus);
        const date = screen.getByTestId(dataTestDate);
        const price = screen.getByTestId(dataTestPrice);

        const elements = [id, status, date, price];

        elements.forEach((element) => {
          expect(element).toBeDefined();
        });
      });
    });
  });
});