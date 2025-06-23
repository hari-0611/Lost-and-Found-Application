import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LostItemFormComponent } from './components/lost-item-form/lost-item-form.component';
import { LostItemsComponent } from './components/lost-items/lost-items.component';
import { FoundItemsComponent } from './components/found-items/found-items.component';
import { FoundItemFormComponent } from './components/found-item-form/found-item-form.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Redirect to landing page
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'lost-items', component: LostItemsComponent, canActivate: [authGuard] }, // Homepage
  { path: 'lost-items/new', component: LostItemFormComponent,canActivate: [authGuard] }, // Form page
  { path: 'found-items', component: FoundItemsComponent,canActivate: [authGuard] },
  { path: 'found-items/new', component: FoundItemFormComponent,canActivate: [authGuard] },
  { path: 'lost-items/:id', component: ItemDetailsComponent ,canActivate: [authGuard]},
  { path: 'found-items/:id', component: ItemDetailsComponent ,canActivate: [authGuard]},
  { path: 'update-lost-items/:id', component: LostItemFormComponent ,canActivate: [authGuard]},
  { path: 'update-found-items/:id', component: FoundItemFormComponent ,canActivate: [authGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // { path: 'landing-page', component: LandingPageComponent },
  
  
  // { path: '**', redirectTo: '' } // Wildcard fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
