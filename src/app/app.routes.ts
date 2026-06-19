import { Routes } from '@angular/router';
import { authGuard } from './guards';
import { CartPage } from './pages/cart-page/cart-page.component';
import { CheckoutPage } from './pages/checkout-page/checkout-page.component';
import { HomePage } from './pages/home-page/home-page.component';
import { OrderConfirmationPage } from './pages/order-confirmation-page/order-confirmation-page.component';
import { ProductPage } from './pages/product-page/product-page.component';
import { ProductsPage } from './pages/products-page/products-page.component';
import { SignInPage } from './pages/sign-in-page/sign-in-page.component';
import { SignUpPage } from './pages/sign-up-page/sign-up-page.component';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'products', component: ProductsPage, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductPage, canActivate: [authGuard] },
  { path: 'cart', component: CartPage, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPage, canActivate: [authGuard] },
  { path: 'order-completed/:id', component: OrderConfirmationPage, canActivate: [authGuard] },
  { path: 'sign-in', component: SignInPage },
  { path: 'sign-up', component: SignUpPage },
  { path: 'signin', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'login', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'sign-up', pathMatch: 'full' },
  { path: 'register', redirectTo: 'sign-up', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
