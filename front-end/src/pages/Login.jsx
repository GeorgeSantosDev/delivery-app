import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { post } from '../utils/api';
import { setLocalStorage } from '../utils/storage';
import '../styles/pages/LoginRegister.css';
import Logotipo from '../assets/images/logotipo1.svg';

const MINIMUM_PASSWORD_LENGTH = 6;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const history = useHistory();

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const isDisabled = password.length < MINIMUM_PASSWORD_LENGTH
  || !emailRegex.test(email);

  const login = async () => {
    let userLogin;

    try {
      const response = await post('login', { email, password });
      userLogin = response;
    } catch (error) {
      userLogin = error;
    }

    if (userLogin.response) {
      return setErrorMessage(userLogin.response.statusText);
    }

    const { token, name, email: userEmail, role, id } = userLogin.data;

    setLocalStorage('user', { token, name, email: userEmail, role, id });

    if (role === 'administrator') history.push('admin/manage');
    if (role === 'seller') history.push('seller/orders');

    history.push('customer/products');
  };

  return (
    <div className="container-login-register">
      <div className="div-logotipo-login-register">
        <img className="logotipo-login-register" src={ Logotipo } alt="logotipo" />
      </div>
      <h1 className="title-login-register">Bora tomar uma?</h1>
      <form className="form-login-register">
        <label className="label-login-register" htmlFor="email">
          Email
          <input
            className="input-login-register"
            type="email"
            id="email"
            placeholder="E-mail"
            data-testid="common_login__input-email"
            onChange={ ({ target }) => setEmail(target.value) }
          />
        </label>

        <label className="label-login-register" htmlFor="password">
          Password
          <input
            className="input-login-register"
            type="password"
            id="password"
            placeholder="Senha"
            data-testid="common_login__input-password"
            onChange={ ({ target }) => setPassword(target.value) }
          />
        </label>

        <button
          className="button-login"
          type="button"
          data-testid="common_login__button-login"
          disabled={ isDisabled }
          onClick={ login }
        >
          Login
        </button>

        <button
          className="button-login-register"
          type="button"
          data-testid="common_login__button-register"
          onClick={ () => history.push('register') }
        >
          Ainda não tem conta
        </button>
      </form>

      {
        errorMessage && (
          <span
            data-testid="common_login__element-invalid-email"
            className="span-login-register"
          >
            Email ou senha incorreta
          </span>
        )
      }
    </div>
  );
}

export default Login;
