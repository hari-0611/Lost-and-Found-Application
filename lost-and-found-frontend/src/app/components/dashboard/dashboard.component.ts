import { Component, OnInit } from '@angular/core';
import { FoundItem } from 'src/app/models/foundItem';
import { Item } from 'src/app/models/item';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  lostCount = 0;
  foundCount = 0;
  recentLost: Item[] = [];
  recentFound: FoundItem[] = [];
  username: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
      console.log("Username in dashboard:", this.username);
    }
    this.fetchDashboardData();
  }
  fetchDashboardData(): void {
    // this.apiService.getLostItems().subscribe(lostItems => {
    //   this.lostCount = lostItems.length;
    //   this.recentLost = lostItems.slice(-5);
    //   console.log('Recent Lost Items:', this.recentLost);
    // });

    // this.apiService.getLostItems().subscribe({
    //   next: (data: Item[]) => {
    //     // 🔁 Update imageUrl to include backend path
    //     this.recentLost = data.map(item => ({
    //       ...item,
    //     }));
    //     this.lostCount = this.recentLost.length;
    //   },
    //   error: (error) => {
    //     console.error('API Error:', error);
    //   }
    // });

    this.apiService.getLostItemsByUsername(this.username).subscribe({
      next: (data: Item[]) => {
        this.recentLost = data.map((item) => ({
          ...item,
        }));
        this.lostCount = this.recentLost.length;
        console.log("Hii");
      },
      error: (error) => {
        console.error('API Error:', error);
      },
    });

    // this.apiService.getFoundItems().subscribe(foundItems => {
    //   this.foundCount = foundItems.length;
    //   this.recentFound = foundItems.slice(-5).reverse(); // Last 5 found
    // });

    this.apiService.getFoundItems().subscribe({
      next: (data: FoundItem[]) => {
        // 🔁 Update imageUrl to include backend path
        this.recentFound = data.map(item => ({
          ...item,
        }));
        this.foundCount = this.recentFound.length;
      },
      error: (error) => {
        console.error('API Error:', error);
      }
    });

  }
}
