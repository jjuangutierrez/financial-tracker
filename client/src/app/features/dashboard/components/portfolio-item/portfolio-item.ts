import { Component, EventEmitter, Input, Output, HostListener, ElementRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Portfolio } from '../../../../core/models/portfolio';

@Component({
  selector: 'app-portfolio-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio-item.html',
  styleUrl: './portfolio-item.css'
})
export class PortfolioItem {
  @Input() portfolio!: Portfolio;
  @Input() activeMenuId!: number | null;
  @Output() menuChange = new EventEmitter<number | null>();
  @Output() rename = new EventEmitter<{id: number, newName: string}>();
  @Output() delete = new EventEmitter<number>();
  @Output() select = new EventEmitter<Portfolio>();

  isEditing = false;
  editedName = '';

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    
    if (!clickedInside && this.activeMenuId === this.portfolio.id) {
      this.menuChange.emit(null);
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    
    if (this.activeMenuId === this.portfolio.id) {
      this.menuChange.emit(null);
    } else {
      this.menuChange.emit(this.portfolio.id);
    }
  }

  deleteItem(): void {
    this.delete.emit(this.portfolio.id);    
    this.menuChange.emit(null);
  }

  renameItem(event: Event): void {
    event.stopPropagation();
    this.isEditing = true;
    this.editedName = this.portfolio.portfolioName;
    this.menuChange.emit(null);
    
    setTimeout(() => {
      const input = document.querySelector('.rename-input') as HTMLInputElement;
      input?.focus();
      input?.select();
    }, 0);
  }

  saveRename(): void {
    if (this.editedName.trim() && this.editedName !== this.portfolio.portfolioName) {
      this.rename.emit({
        id: this.portfolio.id,
        newName: this.editedName.trim()
      });
    }
    this.isEditing = false;
  }

  cancelRename(): void {
    this.isEditing = false;
    this.editedName = '';
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveRename();
    } else if (event.key === 'Escape') {
      this.cancelRename();
    }
  }

  onSelect(): void {
    this.select.emit(this.portfolio);
  }
}