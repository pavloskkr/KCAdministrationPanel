import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {HttpClientModule} from "@angular/common/http";
import { FilterPipe } from './pipes/filter.pipe';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import { UserModalComponent } from './modals/user-modal/user-modal.component';
import { CountryModalComponent } from './modals/country-modal/country-modal.component';
import { ZoneModalComponent } from './modals/zone-modal/zone-modal.component';
import { ProsumerToProjectComponent } from './pages/prosumer-to-project/prosumer-to-project.component';
import {MultiSortPipe} from "./pipes/multiSort.pipe";
import {SearchPipe} from "./pipes/search.pipe";
import { AddProjectToProsumerComponent } from './modals/add-project-to-prosumer/add-project-to-prosumer.component';
import { DropdownFilterPipe } from './pipes/dropdown-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    FilterPipe,
    SearchPipe,
    MultiSortPipe,
    UserModalComponent,
    CountryModalComponent,
    ZoneModalComponent,
    ProsumerToProjectComponent,
    AddProjectToProsumerComponent,
    DropdownFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
