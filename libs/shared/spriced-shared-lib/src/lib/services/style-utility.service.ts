import { Injectable } from '@angular/core';

@Injectable()
export class StyleUtilityService {
  public setPrimaryColors(
    lightColor: string,
    defaultColor: string,
    darkColor: string
  ) {
    document.documentElement.style.setProperty('--primary-light', lightColor);
    document.documentElement.style.setProperty(
      '--primary-default',
      defaultColor
    );
    document.documentElement.style.setProperty('--primary-dark', darkColor);
  }

  public setSecondaryColors(
    lightColor: string,
    defaultColor: string,
    darkColor: string
  ) {
    document.documentElement.style.setProperty('--secondary-light', lightColor);
    document.documentElement.style.setProperty(
      '--secondary-default',
      defaultColor
    );
    document.documentElement.style.setProperty('--secondary-dark', darkColor);
  }

  public setWarnColors(
    lightColor: string,
    defaultColor: string,
    darkColor: string
  ) {
    document.documentElement.style.setProperty('--warn-light', lightColor);
    document.documentElement.style.setProperty('--warn-default', defaultColor);
    document.documentElement.style.setProperty('--warn-dark', darkColor);
  }
}
