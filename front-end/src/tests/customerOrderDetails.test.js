import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import * as api from '../utils/api';
import renderWithRouter from './helpers/renderWithRouter';
import userEvent from '@testing-library/user-event';
import { products, store, sale } from './mocks/customer.mocks';

import App from '../App';

const dataTestIdRedirectCheckoutBtn = 'customer_products__button-cart';
const dataTestFinishShopBtn = 'customer_checkout__button-submit-order';

const dataTestId = 'customer_order_details__element-order-details-label-order-id';
const dataTestDate = 'customer_order_details__element-order-details-label-order-date';
const dataTestStatus = 'customer_order_details__element-order-details-label-delivery-status';
const dataTestSellerName = 'customer_order_details__element-order-details-label-seller-name';
const dataTestDeliveryCheckBtn = 'customer_order_details__button-delivery-check';
const dataTestTotalPrice = 'customer_order_details__element-order-total-price';

const elements = [dataTestId, dataTestStatus, dataTestDate, dataTestSellerName,
  dataTestDeliveryCheckBtn, dataTestTotalPrice];

describe('Test customer orders details page', () => {
  beforeEach(() => {
    global.localStorage.setItem('user', JSON.stringify(store));

    jest.spyOn(api, 'patch')
      .mockResolvedValueOnce({ data: {} });

    jest.spyOn(api, 'post').mockResolvedValueOnce({ data: { id: 1 } })

    jest.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: products })
      .mockResolvedValueOnce({ data: [{ name: 'Seller', id: 2 }] })
      .mockResolvedValueOnce({ data: sale });
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Test if all elements are rendering correctly', () => {
    it('should render all elements in screen', async () => {
      renderWithRouter(<App />);

      const productIncreaseBtn = await screen.findByTestId('customer_products__button-card-add-item-2');

      act(() => {
        userEvent.click(productIncreaseBtn);
      });

      await waitFor(() => {
        const redirectCheckoutBtn = screen.getByTestId(dataTestIdRedirectCheckoutBtn)

        act(() => {
          userEvent.click(redirectCheckoutBtn);
        })
      });

      const buyBtn = screen.getByTestId(dataTestFinishShopBtn);

      userEvent.click(buyBtn);

      await waitFor(() => {
        elements.forEach((element) => {
          expect(screen.getByTestId(element)).toBeDefined();
        });
      });
    });

    it('shoulb  be possible change order status', async () => {
      renderWithRouter(<App />);

      const productIncreaseBtn = await screen.findByTestId('customer_products__button-card-add-item-2');

      act(() => {
        userEvent.click(productIncreaseBtn);
      });

      await waitFor(() => {
        const redirectCheckoutBtn = screen.getByTestId(dataTestIdRedirectCheckoutBtn)

        act(() => {
          userEvent.click(redirectCheckoutBtn);
        })
      });

      const buyBtn = screen.getByTestId(dataTestFinishShopBtn);

      userEvent.click(buyBtn);

      await waitFor(() => {
        const checkBtn = screen.getByTestId(dataTestDeliveryCheckBtn);

        expect(checkBtn).not.toBeDisabled();
        userEvent.click(checkBtn);
      });

      expect((await screen.findByTestId(dataTestStatus)).innerHTML).toBe('Entregue');
    });
  });
});