import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import { invalidValuesOfRegister, validValuesOfRegister } from './mocks/register.mocks';

import Register from '../pages/Register';


const { email: invalidEmail, password: invalidPassword, name: invalidName } = invalidValuesOfRegister;
const { email: validEmail, password: validPassword, name: validName  } = validValuesOfRegister;


const dataTestIdNameInput = 'common_register__input-name';
const dataTestIdEmailInput = 'common_register__input-email';
const dataTestIdPasswordInput = 'common_register__input-password';
const dataTestIdRegisterBtn = 'common_register__button-register';

describe('Test register page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should be not possible to register', () => {
    it('should be all elements in screen', () => {
      renderWithRouter(<Register />);

      const nameInput = screen.getByTestId(dataTestIdNameInput);
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const registerBtn = screen.getByTestId(dataTestIdRegisterBtn);

      expect(nameInput).toBeDefined();
      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
      expect(registerBtn).toBeDefined();
      expect(registerBtn).toBeDisabled();
    });

    it('should be not possible to register with invalid name', () => {
      renderWithRouter(<Register />);

      const nameInput = screen.getByTestId(dataTestIdNameInput);
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const registerBtn = screen.getByTestId(dataTestIdRegisterBtn);

      userEvent.type(nameInput, invalidName);
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);


      expect(registerBtn).toBeDisabled();
    });

    it('should be not possible to register with invalid password', () => {
      renderWithRouter(<Register />);

      const nameInput = screen.getByTestId(dataTestIdNameInput);
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const registerBtn = screen.getByTestId(dataTestIdRegisterBtn);

      userEvent.type(nameInput, validName);
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, invalidPassword);


      expect(registerBtn).toBeDisabled();
    });

    it('should be not possible to register with invalid email', () => {
      renderWithRouter(<Register />);

      const nameInput = screen.getByTestId(dataTestIdNameInput);
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const registerBtn = screen.getByTestId(dataTestIdRegisterBtn);

      userEvent.type(nameInput, validName);
      userEvent.type(emailInput, invalidEmail);
      userEvent.type(passwordInput, validPassword);


      expect(registerBtn).toBeDisabled();
    });

    it('should be not possible to register with user data already exist', async () => {
      jest.spyOn(api, 'post')
      .mockRejectedValue({ response: { statusText: 'error' }});

      renderWithRouter(<Register />);

      const nameInput = screen.getByTestId(dataTestIdNameInput);
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const registerBtn = screen.getByTestId(dataTestIdRegisterBtn);

      userEvent.type(nameInput, validName);
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.click(registerBtn);

      await waitFor(() => {
        const errorMessage = screen.getByTestId('common_register__element-invalid_register');

        expect(errorMessage).toBeDefined();
      });
    });
  });

  describe('should be possible to register', () => {
    it('should be possible to register with valid data', async () => {
      jest.spyOn(api, 'post')
      .mockResolvedValueOnce({ data: {
          email: 'test@test.com',
          id: 4,
          name: 'Login Test Name',
          role: 'customer',
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
            XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFRRgLmD
            OWoU6GRwNokcce1mCydeSs`,
        }});

        const { history} = renderWithRouter(<Register />);

        const nameInput = screen.getByTestId(dataTestIdNameInput);
        const emailInput = screen.getByTestId(dataTestIdEmailInput);
        const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
        const registerBtn = screen.getByTestId(dataTestIdRegisterBtn);
  
        userEvent.type(nameInput, validName);
        userEvent.type(emailInput, validEmail);
        userEvent.type(passwordInput, validPassword);
        userEvent.click(registerBtn);

        await waitFor(() => {
          expect(history.location.pathname).toBe('/customer/products')
        });
    });
  });
});