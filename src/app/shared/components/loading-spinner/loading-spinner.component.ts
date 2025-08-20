import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  standalone: false,
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}