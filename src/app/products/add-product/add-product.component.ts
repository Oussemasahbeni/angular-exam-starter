import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  submitting = false;
  submitted = false;
  errorMessage: string | null = null;
  isEditMode = false;
  productId?: number;
  pageTitle = 'Add New Product';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }
  checkEditMode(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (idParam) {
        this.isEditMode = true;
        this.productId = +idParam;
        this.pageTitle = 'Edit Product';
        this.loadProductDetails(this.productId);
      }
    });
  }

  loadProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          description: product.description,
          imageUrl: product.imageUrl || '',
          category: product.category || '',
        });
      },
      error: (err) => {
        console.error('Error loading product for edit:', err);
        this.errorMessage = 'Failed to load product details for editing.';
        this.router.navigate(['/products']);
      },
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      price: [
        null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      quantity: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      imageUrl: ['', [Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      category: [''],
    });
  }

  // Getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.productForm.invalid) {
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.productId) {
      const updatedProduct = new Product(
        this.f['name'].value,
        this.f['price'].value,
        this.f['quantity'].value,
        this.f['description'].value,
        this.f['imageUrl'].value,
        this.f['category'].value,
        this.productId
      );

      this.productService.updateProduct(updatedProduct).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/products', this.productId]);
        },
        error: (error) => {
          this.submitting = false;
          this.errorMessage = 'Failed to update product. Please try again.';
          console.error('Error updating product:', error);
        },
      });
    } else {
      const newProduct = new Product(
        this.f['name'].value,
        this.f['price'].value,
        this.f['quantity'].value,
        this.f['description'].value,
        this.f['imageUrl'].value,
        this.f['category'].value
      );

      this.productService.addProduct(newProduct).subscribe({
        next: (response) => {
          this.submitting = false;
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.submitting = false;
          this.errorMessage = 'Failed to add product. Please try again.';
          console.error('Error adding product:', error);
        },
      });
    }
  }
  resetForm(): void {
    this.submitted = false;

    if (this.isEditMode && this.productId) {
      // If in edit mode, reload the original product data
      this.loadProductDetails(this.productId);
    } else {
      // If in add mode, reset completely
      this.productForm.reset();
    }
  }
}
