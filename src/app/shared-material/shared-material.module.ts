import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

@NgModule({
  exports: [MatSidenavModule, MatToolbarModule, MatCheckboxModule],
  declarations: []
})
export class SharedMaterialModule {}
