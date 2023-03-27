import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import renderWithRouter from './helpers/renderWithRouter';
import { store, orders  } from './mocks/seller.mocks';

import App from '../App';

const dataTestId = 'seller_orders__element-order-id-1';
const dataTestStatus = 'seller_orders__element-delivery-status-1';
const dataTestDate = 'seller_orders__element-order-date-1';
const dataTestPrice = 'seller_orders__element-card-price-1';
const dataTestAddress = 'seller_orders__element-card-address-1';

describe('Test seller orders page', () => {
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
      const { history } = renderWithRouter(<App />)

      await waitFor(() => {
        const id = screen.getByTestId(dataTestId);
        const status = screen.getByTestId(dataTestStatus);
        const date = screen.getByTestId(dataTestDate);
        const price = screen.getByTestId(dataTestPrice);
        const address =  screen.getByTestId(dataTestAddress);

        const elements = [id, status, date, price, address];

        elements.forEach((element) => {
          expect(element).toBeDefined();
        });
      });
    });
  });
});