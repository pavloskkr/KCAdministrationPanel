import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FilterPipe} from "../../pipes/filter.pipe";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ProjectService} from "../../services/project.service";


interface User {
  id: string;
  username: string;
  attributes: {
    prosumerUUID: string[];
    projectName: string[];
    countryCode: string[];
  };
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [FilterPipe],
})
export class DashboardComponent implements OnInit {
  accessToken: string | null;
  users: User[] = [];
  searchTerm: string = '';
  private readonly usersEndpointBase = 'https://userauth.energylabs-ht.eu/auth/admin/realms/';
  openUserModal = false;
  openCountryModal = false;
  openZonesModal= false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private projectService: ProjectService) {
    this.accessToken = authService.getAccessToken();
  }

  getUsers() {
    const selectedProject = this.projectService.getSelectedProject();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    return this.http.get<User[]>(`${this.usersEndpointBase}${selectedProject?.display}/users?max=999`, {headers});
  }

  logout() {
    this.authService.clearAccessToken();
    this.authService.clearLocalStorage();
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.getUsers().subscribe((response) => {
        this.users = response;
      },
      (error) => {
        console.error('Error:', error);
        // Handle error
      });
  }

  navigateToDashboard() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/dashboard']);
  }

  deleteUser(userId: string) {
    const selectedProject = this.projectService.getSelectedProject();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    // Find the user with the matching userId
    const userToDelete = this.users.find((user) => user.id === userId);

    // Check if the user exists before showing the confirmation
    if (userToDelete) {
      const confirmation = window.confirm(`Are you sure you want to delete the user ${userToDelete.username}?`);

      if (confirmation) {
        this.http.delete<void>(`${this.usersEndpointBase}${selectedProject?.display}/users/${userId}`, {headers})
          .subscribe(
            () => {
              // Handle success, e.g., remove the user from the local array
              this.users = this.users.filter((user) => user.id !== userId);
            },
            (error) => {
              console.error('Error deleting user:', error);
              // Handle error
            }
          );
      }
    }
  }

  shouldShowAddCountryLink(): boolean {
    const selectedProject = this.projectService.getSelectedProject();
    // Add any condition based on the selected project
    return selectedProject?.display !== 'MobileApp';
  }

}
