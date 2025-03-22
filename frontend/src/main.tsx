import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './globalConstants.ts';
import { addInterceptors } from './axiosApi.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';

addInterceptors(store)

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <ToastContainer />
        <SnackbarProvider maxSnack={3}>
          <App/>
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);
