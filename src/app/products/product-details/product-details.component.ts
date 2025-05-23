import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the product ID from the route parameter
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');

      console.log(productId);
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = 'Invalid product ID';
        this.loading = false;
      }
    });
  }

  loadProduct(id: any): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error =
          'Failed to load product details. The product may not exist.';
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  deleteProduct(): void {
    if (!this.product || !this.product.id) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Failed to delete the product. Please try again.');
        },
      });
    }
  }
}
