import React from 'react';
import { screen, waitFor, act } from '@testing-library/react';
import * as api from '../utils/api';
import renderWithRouter from './helpers/renderWithRouter';
import userEvent from '@testing-library/user-event';
import { store, sale, orders } from './mocks/seller.mocks';

import App from '../App';

const orderPageElement = 'seller_orders__element-order-id-1';

const dataTestId = 'seller_order_details__element-order-details-label-order-id';
const dataTestDate = 'seller_order_details__element-order-details-label-order-date';
const dataTestStatus = 'seller_order_details__element-order-details-label-delivery-status';
const dataTestDeliveryPreparingBtn = 'seller_order_details__button-preparing-check';
const dataTestDeliveryDispatchBtn = 'seller_order_details__button-dispatch-check';
const dataTestTotalPrice = 'seller_order_details__element-order-total-price';

const elements = [dataTestId, dataTestStatus, dataTestDate, dataTestDeliveryDispatchBtn,
  dataTestDeliveryPreparingBtn, dataTestTotalPrice];

describe('Test seller orders details page', () => {
  beforeEach(() => {
    global.localStorage.setItem('user', JSON.stringify(store));

    jest.spyOn(api, 'patch')
      .mockResolvedValueOnce({ data: {} });

    jest.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: orders })
      .mockResolvedValueOnce({ data: sale });
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Test if all elements are rendering correctly', () => {
    it('should render all elements in screen', async () => {
      renderWithRouter(<App />);

      const orderElement = await screen.findByTestId(orderPageElement);

      userEvent.click(orderElement);

      await waitFor(() => {
        elements.forEach((element) => {
          expect(screen.getByTestId(element)).toBeDefined();
        });
      });
    });

    it('should  be possible change order status', async () => {
      renderWithRouter(<App />);

      const orderElement = await screen.findByTestId(orderPageElement);

      userEvent.click(orderElement);

      await waitFor(() => {
        userEvent.click(screen.getByTestId(dataTestDeliveryPreparingBtn));
      });

      expect(screen.getByTestId(dataTestStatus).innerHTML).toBe('Preparando');

      userEvent.click(screen.getByTestId(dataTestDeliveryDispatchBtn));


      await waitFor(() => {
        expect(screen.getByTestId(dataTestStatus).innerHTML).toBe('Em Trânsito');
      });
    });
  });
});