import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedMaterialModule } from './shared-material/shared-material.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, SharedMaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
