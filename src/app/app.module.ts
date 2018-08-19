import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RequestService } from './request.service';
import { StandardContentComponent } from './standard-content.component';
import { AnimalListComponent } from './animal-list.component';

@NgModule({
  declarations: [
    AppComponent,
    StandardContentComponent,
    AnimalListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule {}
