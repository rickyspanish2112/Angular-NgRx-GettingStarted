import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductService } from '../product.service';

import * as fromProductActions from './product.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Product } from '../product';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

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
          (products: Product[]) => new fromProductActions.LoadSuccess(products)
        ),
        catchError(err => of(new fromProductActions.LoadFail(err)))
      )
    )
  );

  @Effect()
  updateProduct: Observable<Action> = this.actions.pipe(
    ofType(fromProductActions.ProductActionTypes.UpdateProduct),
    map((action: fromProductActions.UpdateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.updateProduct(product).pipe(
        map((updatedProduct: Product) => (new fromProductActions.UpdateProductSuccess(updatedProduct))),
         catchError(err => of(new fromProductActions.UpdateProductFail(err)))
      )
    )
  );
}
