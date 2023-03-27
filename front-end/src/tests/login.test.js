import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import * as api from '../utils/api';
import userEvent from '@testing-library/user-event';
import renderWithRouter from './helpers/renderWithRouter';
import { invalidValuesOfLogin, validValuesOfLogin } from './mocks/login.mocks';

import Login from '../pages/Login';


const { email: invalidEmail, password: invalidPassword } = invalidValuesOfLogin;
const { email: validEmail, password: validPassword  } = validValuesOfLogin;

const dataTestIdEmailInput = 'common_login__input-email';
const dataTestIdPasswordInput = 'common_login__input-password';
const dataTestIdLoginBtn = 'common_login__button-login';

const adminPath = '/admin/manage';
const customerPath = '/customer/products';
const sellerPath = '/seller/orders';

describe('Test login page', () => {
  afterEach(() => {
    jest.clearAllMocks();

    global.localStorage.clear();
  });
  describe('should be not possible to log in', () => {
    it('should login button is disabled for invalid email', () => {
      renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, invalidEmail);
      userEvent.type(passwordInput, validPassword);
  
      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
      expect(loginBtn).toBeDefined();
      expect(loginBtn).toBeDisabled();
    });
  
    it('should login button is disabled for invalid password', () => {
      renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, invalidPassword);
  
      expect(loginBtn).toBeDisabled();
    });
  
    it('should login button is not disabled for valid values', () => {
      renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
  
      expect(loginBtn).not.toBeDisabled();
    });
  
    it('should be not possible to log in with email and password non-existing in the database', async () => {
      jest.spyOn(api, 'post')
      .mockRejectedValue({ response: { statusText: 'error' }});
  
      renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.click(loginBtn);
  
      await waitFor(() => {
        const errorMessage = screen.getByTestId('common_login__element-invalid-email');
        expect(errorMessage).toBeDefined();
      });
    });
  });
  
  describe('should be possible to log in', () => {
    it('should be possible to log in for customer', async () => {
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
  
      const { history } = renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.click(loginBtn);
  
      await waitFor(() => {
        expect(history.location.pathname).toBe(customerPath);
      });
    });
  
    it('should be possible to log in for seller', async () => {
      jest.spyOn(api, 'post')
      .mockResolvedValueOnce({ data: {
          email: 'test@test.com',
          id: 4,
          name: 'Login Test Name',
          role: 'seller',
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
            XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFRRgLmD
            OWoU6GRwNokcce1mCydeSs`,
        }});
  
      const { history } = renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.click(loginBtn);
  
      await waitFor(() => {
        expect(history.location.pathname).toBe(sellerPath);
      });
    });
  
    it('should be possible to log in for admin', async () => {
      jest.spyOn(api, 'post')
      .mockResolvedValueOnce({ data: {
          email: 'test@test.com',
          id: 4,
          name: 'Login Test Name',
          role: 'administrator',
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
            XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFRRgLmD
            OWoU6GRwNokcce1mCydeSs`,
        }});
  
      const { history } = renderWithRouter(<Login />);
  
      const emailInput = screen.getByTestId(dataTestIdEmailInput);
      const passwordInput = screen.getByTestId(dataTestIdPasswordInput);
      const loginBtn = screen.getByTestId(dataTestIdLoginBtn);
  
      userEvent.type(emailInput, validEmail);
      userEvent.type(passwordInput, validPassword);
      userEvent.click(loginBtn);
  
      await waitFor(() => {
        expect(history.location.pathname).toBe(adminPath);
      });
    });
  });

  describe('should be possible to redirect user', () => {
    it('should be possible to redirect user to customer home if already have a token', async () => {
      const store = {
        email: 'test@test.com',
          id: 4,
          name: 'Login Test Name',
          role: 'customer',
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
            XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFRRgLmD
            OWoU6GRwNokcce1mCydeSs`,
      };
      global.localStorage.setItem('user', JSON.stringify(store));
  
      const { history } = renderWithRouter(<Login />);
  
      await waitFor(() => {
        expect(history.location.pathname).toBe(customerPath);
      });
    });
  
    it('should be possible to redirect user to seller home if already have a token', async () => {
      const store = {
        email: 'test@test.com',
          id: 4,
          name: 'Login Test Name',
          role: 'seller',
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
            XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFRRgLmD
            OWoU6GRwNokcce1mCydeSs`,
      };
      global.localStorage.setItem('user', JSON.stringify(store));
  
      const { history } = renderWithRouter(<Login />);
  
      await waitFor(() => {
        expect(history.location.pathname).toBe(sellerPath);
      });
    });
  
    it('should be possible to redirect user to admin home if already have a token', async () => {
      const store = {
        email: 'test@test.com',
          id: 4,
          name: 'Login Test Name',
          role: 'administrator',
          token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdlb3JnZS5zYW50b3NfdWZtZ0Bvd
            XRsb29rLmNvbSIsImlhdCI6MTY3ODMwMzAyNywiZXhwIjoxNjc4Mzg5NDI3fQ.BuQK8BWNwKo7eGFRRgLmD
            OWoU6GRwNokcce1mCydeSs`,
      };
      global.localStorage.setItem('user', JSON.stringify(store));
  
      const { history } = renderWithRouter(<Login />);
  
      await waitFor(() => {
        expect(history.location.pathname).toBe(adminPath);
      });
    });
  });

  describe('should be possible go to register page', () => {
    it('should be in register page', () => {
      const { history } = renderWithRouter(<Login />);
      const registerBtn = screen.getByTestId('common_login__button-register');

      userEvent.click(registerBtn);

      expect(history.location.pathname).toBe('/register');
    });
  });
});