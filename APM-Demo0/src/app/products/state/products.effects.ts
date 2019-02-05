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
        map(
          (updatedProduct: Product) =>
            new fromProductActions.UpdateProductSuccess(updatedProduct)
        ),
        catchError(err => of(new fromProductActions.UpdateProductFail(err)))
      )
    )
  );

  @Effect()
  createProduct: Observable<Action> = this.actions.pipe(
    ofType(fromProductActions.ProductActionTypes.CreateProduct),
    map((action: fromProductActions.CreateProduct) => action.payload),
    mergeMap((product: Product) =>
      this.productService.createProduct(product).pipe(
        map(
          (newProduct: Product) =>
            new fromProductActions.CreateProductSuccess(newProduct)
        ),
        catchError(err => of(new fromProductActions.CreateProductFail(err)))
      )
    )
  );

  @Effect()
  deleteProduct$: Observable<Action> = this.actions.pipe(
    ofType(fromProductActions.ProductActionTypes.DeleteProduct),
    map((action: fromProductActions.DeleteProduct) => action.payload),
    mergeMap((productId: number) =>
      this.productService.deleteProduct(productId).pipe(
        map(() => (new fromProductActions.DeleteProductSuccess(productId))),
        catchError(err => of(new fromProductActions.DeleteProductFail(err)))
      )
    )
  );
}

