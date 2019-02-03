import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductService } from '../product.service';

import * as fromProductActions from './product.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Product } from '../product';
import { of } from 'rxjs';

@Injectable()
export class ProductEffects {
  constructor(
    private actions: Actions,
    private productService: ProductService
  ) {}

  @Effect()
  loadProducts = this.actions.pipe(
    ofType(fromProductActions.ProductActionTypes.Load),
    mergeMap((action: fromProductActions.Load) =>
      this.productService.getProducts().pipe(
        map(
          (products: Product[]) => new fromProductActions.LoadSucess(products)
        ),
        catchError(err => of(new fromProductActions.LoadPFail(err)))
      )
    )
  );
}
