import React from 'react';
import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import * as api from '../utils/api';
import renderWithRouter from './helpers/renderWithRouter';
import userEvent from '@testing-library/user-event';
import { products, store } from './mocks/customer.mocks';

import App from '../App';

import customerContext from '../context/CustomerContext';
import CustomerProducts from '../pages/CustomerProducts';

const dataTestIdLinkProducts = 'customer_products__element-navbar-link-products';
const dataTestIdLinkOrders = 'customer_products__element-navbar-link-orders';
const dataTestIdName = 'customer_products__element-navbar-user-full-name';
const dataTestIdLogOutBtn = 'customer_products__element-navbar-link-logout';
const dataTestIdRedirectCheckoutBtn = 'customer_products__button-cart';
const dataTestIdTotalPriceElement = 'customer_products__checkout-bottom-value';

describe('Test customer products page', () => {
  beforeEach(() => {
    global.localStorage.setItem('user', JSON.stringify(store));

    jest.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: products })
      .mockResolvedValueOnce({ data: [{ name: 'Seller', id: 2 }] });

  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Test if all elements are in the screen', () => {
    it('should render all navbar elements, checkout btn and total price element', async () => {
      renderWithRouter(<App />);

      const linkProducts = screen.getByTestId(dataTestIdLinkProducts);
      const linkOrders = screen.getByTestId(dataTestIdLinkOrders)
      const name = screen.getByTestId(dataTestIdName)
      const logOutBtn = screen.getByTestId(dataTestIdLogOutBtn)
      const redirectCheckoutBtn = screen.getByTestId(dataTestIdRedirectCheckoutBtn)
      const totalPriceElement = screen.getByTestId(dataTestIdTotalPriceElement)

      const elements = [linkProducts, linkOrders, name, logOutBtn, redirectCheckoutBtn, totalPriceElement];

      elements.forEach((element) => {
        expect(element).toBeDefined();
      });
    });

    it('should render all products', async () => {
      renderWithRouter(<App />);

      await waitFor(() => {
        products.forEach(({ id }) => {
          const productImage = screen.getByTestId(`customer_products__img-card-bg-image-${id}`);
          const productName = screen.getByTestId(`customer_products__element-card-title-${id}`);
          const productPrice = screen.getByTestId(`customer_products__element-card-price-${id}`);
          const productIncreaseBtn = screen.getByTestId(`customer_products__button-card-add-item-${id}`);
          const productDecreaseBtn = screen.getByTestId(`customer_products__button-card-rm-item-${id}`);
          const productQuantity = screen.getByTestId(`customer_products__input-card-quantity-${id}`);

          const elements = [productImage, productName, productPrice, productIncreaseBtn, productDecreaseBtn, productQuantity];


          elements.forEach((element) => {
            expect(element).toBeDefined();
          });
        });
      });
    });
  });

  describe('Test if is possible to add and remove items', () => {
    it('should be possible to add a item to a cart', async () => {
      renderWithRouter(<App />);

      await waitFor(() => {
        const productIncreaseBtn = screen.getByTestId('customer_products__button-card-add-item-2');

        act(() => {
          userEvent.click(productIncreaseBtn);
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId(dataTestIdTotalPriceElement).innerHTML).toBe('7,50');
      });
    });

    it('should be possible to remove a item to a cart', async () => {
      renderWithRouter(<App />);

      await waitFor(() => {
        const productIncreaseBtn = screen.getByTestId('customer_products__button-card-add-item-2');

        act(() => {
          userEvent.click(productIncreaseBtn);
        });
      });

      await waitFor(() => {
        const productDecreaseBtn = screen.getByTestId('customer_products__button-card-rm-item-2');

        act(() => {
          userEvent.click(productDecreaseBtn);
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId(dataTestIdTotalPriceElement).innerHTML).toBe('0');
      });
    });

    it('should be possible to add and remove more than 1 product', async () => {
      renderWithRouter(<App />);

      const productIncreaseBtn1 = await screen.findByTestId('customer_products__button-card-add-item-3');
      const productIncreaseBtn2 = await screen.findByTestId('customer_products__button-card-add-item-2');

        act(() => {
          userEvent.click(productIncreaseBtn2);
          userEvent.click(productIncreaseBtn1);
        });

      await waitFor(() => { act(() => { userEvent.click(productIncreaseBtn2) }) })

      const productDecreaseBtn = screen.getByTestId('customer_products__button-card-rm-item-2');

      await waitFor(() => {
        act(() => {
          userEvent.click(productDecreaseBtn);
        });
      });

      await waitFor(() => {
        act(() => { userEvent.click(productDecreaseBtn); });
      })

      await waitFor(() => {
        expect(screen.getByTestId(dataTestIdTotalPriceElement).innerHTML).toBe('2,49');
      });
    });

    it('should be possible to add a product by type the quantity', async () => {
      renderWithRouter(<App />);

      const quantityInput = await screen.findByTestId('customer_products__input-card-quantity-2');

        act(() => {
          userEvent.type(quantityInput, '3')
        });

      await waitFor(() => {
        expect(screen.getByTestId(dataTestIdTotalPriceElement).innerHTML).toBe('22,50');
      });
    });
  });

  describe('Test if is possble to redirect to checkout page', () => {
    it('should be in checkout page', async () => {
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

      await waitFor(() => {
        expect(history.location.pathname).toBe('/customer/checkout');
      });

    });
  });
});
