import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import * as api from '../utils/api';
import renderWithRouter from './helpers/renderWithRouter';
import userEvent from '@testing-library/user-event';
import { products, store, sale } from './mocks/customer.mocks';

import App from '../App';

const dataTestIdRedirectCheckoutBtn = 'customer_products__button-cart';

const dataTestIdNumber = 'customer_checkout__element-order-table-item-number-0';
const dataTestIdName = 'customer_checkout__element-order-table-name-0';
const dataTestIdQuantity = 'customer_checkout__element-order-table-quantity-0';
const dataTestIdPrice = 'customer_checkout__element-order-table-unit-price-0';
const dataTestIdSubTotal = 'customer_checkout__element-order-table-sub-total-0';
const dataTestIdRemoveBtn = 'customer_checkout__element-order-table-remove-0';
const dataTestIdTotalPrice = 'customer_checkout__element-order-total-price';

const dataTestSelectInput = 'customer_checkout__select-seller';
const dataTestAddressInput = 'customer_checkout__input-address';
const dataTestAddressNumberInput = 'customer_checkout__input-address-number';
const dataTestFinishShopBtn = 'customer_checkout__button-submit-order';

const elements = [dataTestIdNumber, dataTestIdName, dataTestIdQuantity, dataTestIdPrice,
  dataTestIdSubTotal, dataTestIdRemoveBtn, dataTestIdTotalPrice, dataTestSelectInput,
  dataTestAddressInput, dataTestAddressNumberInput, dataTestFinishShopBtn]

describe('Test customer checkout page', () => {
  beforeEach(() => {
    global.localStorage.setItem('user', JSON.stringify(store));

    jest.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: products })
      .mockResolvedValueOnce({ data: [{ name: 'Seller', id: 2 }] })
      .mockResolvedValueOnce({ data: sale });

    jest.spyOn(api, 'post').mockResolvedValueOnce({ data: { id: 1 } })

  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Test if is possble to finish shop', () => {
    it('should render all elements correctly', async () => {
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

      await waitFor(() => {
        elements.forEach((elmt) => {
          const element = screen.getByTestId(elmt);
          expect(element).toBeDefined();
        });
      });

    });

    it('should be possible to finish shop', async () => {
      const { history } = renderWithRouter(<App />);

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


      const addressInput = screen.getByTestId(dataTestAddressInput);
      const addressNumberInput = screen.getByTestId(dataTestAddressNumberInput);
      const buyBtn = screen.getByTestId(dataTestFinishShopBtn);

      userEvent.type(addressInput, 'valid address');
      userEvent.type(addressNumberInput, '999');
      userEvent.click(buyBtn);

      await waitFor(() => {
        expect(history.location.pathname).toBe('/customer/orders/1');
      });
    });
  });
});
