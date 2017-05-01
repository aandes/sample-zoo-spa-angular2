import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StandardContentComponent } from './standard-content.component';
import { AnimalListComponent } from './animal-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: StandardContentComponent},
  { path: 'animals', component : AnimalListComponent},
  { path: 'aquatic', component : AnimalListComponent},
  { path: 'terrestrial', component : AnimalListComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
