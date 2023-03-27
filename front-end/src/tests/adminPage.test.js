import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import { store, users, user } from './mocks/admin.mocks';

import App from '../App';

describe('Test admin page', () => {
  beforeEach(() => {
    global.localStorage.setItem('user', JSON.stringify(store));

    jest.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: users });

    jest.spyOn(api, 'destroy')
      .mockResolvedValueOnce({ data: {} });
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Test if is possible to do admin acts', () => {
    it('should be possible to delete a user', async () => {
      renderWithRouter(<App />)

      await waitFor(() => {
        users.forEach((_, index) => {
          const userIndex = screen.getByTestId(`admin_manage__element-user-table-item-number-${index}`);
          const userName = screen.getByTestId(`admin_manage__element-user-table-name-${index}`);
          const userEmail = screen.getByTestId(`admin_manage__element-user-table-email-${index}`);
          const userRole = screen.getByTestId(`admin_manage__element-user-table-role-${index}`);
          const removeBtn = screen.getByTestId(`admin_manage__element-user-table-remove-${index}`);


          const elements = [userIndex, userName, userEmail, userRole, removeBtn];

          elements.forEach((element) => {
            expect(element).toBeDefined();
          });
        });

      });

      userEvent.click(screen.getByTestId(`admin_manage__element-user-table-remove-0`));

      await waitFor(() => {
        users.forEach((_, index) => {
          const userIndex = screen.queryByTestId(`admin_manage__element-user-table-item-number-${index}`);
          const userName = screen.queryByTestId(`admin_manage__element-user-table-name-${index}`);
          const userEmail = screen.queryByTestId(`admin_manage__element-user-table-email-${index}`);
          const userRole = screen.queryByTestId(`admin_manage__element-user-table-role-${index}`);
          const removeBtn = screen.queryByTestId(`admin_manage__element-user-table-remove-${index}`);


          const elements = [userIndex, userName, userEmail, userRole, removeBtn];
          if (index === 0) {
            elements.forEach((element) => {
              expect(element).toBeDefined();
            });
          }

          if (index === 1) {
            elements.forEach((element) => {
              expect(element).toBe(null);
            });
          }
        });
      });
    });

    it('should be possible to create a new user', async () => {
      jest.spyOn(api, 'post')
        .mockResolvedValueOnce({ data: user });

      renderWithRouter(<App />);

      await waitFor(() => {
        const nameInput = screen.getByTestId('admin_manage__input-name');
        const emailInput = screen.getByTestId('admin_manage__input-email');
        const passwordInput = screen.getByTestId('admin_manage__input-password');
        const registerBtn = screen.getByTestId('admin_manage__button-register');

        userEvent.type(nameInput, 'Name of user 4');
        userEvent.type(emailInput, 'user4@test.com');
        userEvent.type(passwordInput, '123456789');
        userEvent.click(registerBtn);
      });

      await waitFor(() => {
        const userIndex = screen.queryByTestId('admin_manage__element-user-table-item-number-2');
        const userName = screen.queryByTestId('admin_manage__element-user-table-name-2');
        const userEmail = screen.queryByTestId('admin_manage__element-user-table-email-2');
        const userRole = screen.queryByTestId('admin_manage__element-user-table-role-2');
        const removeBtn = screen.queryByTestId('admin_manage__element-user-table-remove-2');


        const elements = [userIndex, userName, userEmail, userRole, removeBtn];

        elements.forEach((element) => {
          expect(element).toBeDefined();
        });
      });
    });

    it('should be not possible to create a new user who already exist', async () => {
      jest.spyOn(api, 'post')
        .mockRejectedValue({ response: { statusText: 'error' } });

      renderWithRouter(<App />);


      const nameInput = screen.getByTestId('admin_manage__input-name');
      const emailInput = screen.getByTestId('admin_manage__input-email');
      const passwordInput = screen.getByTestId('admin_manage__input-password');
      const registerBtn = screen.getByTestId('admin_manage__button-register');

      userEvent.type(nameInput, 'Name of user 3');
      userEvent.type(emailInput, 'user3@test.com');
      userEvent.type(passwordInput, '123456789');
      userEvent.click(registerBtn);

      await waitFor(() => {
        expect(screen.getByTestId('admin_manage__element-invalid-register')).toBeDefined();
      });

    });
  });
});