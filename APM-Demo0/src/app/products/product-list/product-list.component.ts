import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state/product.reducer';
import * as fromProductActions from '../state/product.actions';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage: Observable<string>;

  displayCode: boolean;

  products: Observable<Product[]>;

  // Used to highlight the selected product in the list
  selectedProduct: Product | null;
  componentActive = true;

  constructor(
    private store: Store<fromProduct.State>,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    /* this.store
      .pipe(select(fromProduct.getCurrentProduct))
      .subscribe(currentProduct => (this.selectedProduct = currentProduct)); */

    this.products = this.store.pipe(
      select(fromProduct.getProducts)
    ) as Observable<Product[]>;

    this.errorMessage = this.store.pipe(select(fromProduct.getError));
    this.store.dispatch(new fromProductActions.Load());
    this.products = this.store.pipe(select(fromProduct.getProducts));

    this.store
      .pipe(select(fromProduct.getShowProductCode))
      .subscribe(showProductCode => (this.displayCode = showProductCode));
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }

  checkChanged(value: boolean): void {
    this.store.dispatch(new fromProductActions.ToggleProductCode(value));
  }

  newProduct(): void {
    this.store.dispatch(new fromProductActions.InitializeCurrentProduct());
  }

  productSelected(product: Product): void {
    this.store.dispatch(new fromProductActions.SetCurrentProduct(product));
  }
}
