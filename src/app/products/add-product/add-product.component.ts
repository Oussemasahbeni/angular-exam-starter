import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  submitting = false;
  submitted = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
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

    const newProduct = new Product(
      this.f['name'].value,
      this.f['price'].value,
      this.f['quantity'].value,
      this.f['description'].value,
      this.f['imageUrl'].value,
      this.f['category'].value
    );

    this.productService.addProduct(newProduct).subscribe({
      next: () => {
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

  resetForm(): void {
    this.submitted = false;
    this.productForm.reset();
  }
}
