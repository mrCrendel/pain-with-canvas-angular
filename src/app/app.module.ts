import {isDevMode, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";

import {AppStore} from "./store/app.store";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { FigurePickerComponent } from './components/figure-picker/figure-picker.component';
import { ColorButtonComponent } from './components/color-button/color-button.component';
import { FigureButtonComponent } from './components/figure-button/figure-button.component';
import { DrawedCardComponent } from './components/drawed-card/drawed-card.component';
import { DrawedListComponent } from './components/drawed-list/drawed-list.component';
import { CanvasRulerComponent } from './components/canvas-ruler/canvas-ruler.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    CanvasComponent,
    ColorPickerComponent,
    FigurePickerComponent,
    ColorButtonComponent,
    FigureButtonComponent,
    DrawedCardComponent,
    DrawedListComponent,
    CanvasRulerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(AppStore),
    StoreDevtoolsModule.instrument({ maxAge: false, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
