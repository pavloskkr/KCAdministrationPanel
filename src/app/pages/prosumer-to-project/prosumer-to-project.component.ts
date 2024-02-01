import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-prosumer-to-project',
  templateUrl: './prosumer-to-project.component.html',
  styleUrls: ['./prosumer-to-project.component.scss']
})
export class ProsumerToProjectComponent implements OnInit {
  accessToken: string | null;
  prosumers_has_projects: Object[] = [];
  searchTerm: string = '';
  private readonly baseUrl = 'https://services.energylabs-ht.eu/imlDataCollector/services/tools/';
  openPtoPModal = false;
  openUserModal = false;
  openCountryModal = false;
  openZonesModal = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private projectService: ProjectService) {
    this.accessToken = authService.getAccessToken();
  }

  getProsumersHasProjects() {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<Object[]>(`${this.baseUrl}/prosumerhasproject`, {headers});
  }

  logout() {
    this.authService.clearAccessToken();
    this.authService.clearLocalStorage();
    this.router.navigate(['']);
  }

  navigateToDashboard() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/dashboard']);
  }

  navigateToProsumerHasProject() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/project_to_prosumer']);
  }

  deleteAssociation(prosumerId: number, projectId: number): void {
    if (prosumerId && projectId) {
      let params = new HttpParams()
        .set('prosumerId', prosumerId.toString())
        .set('projectId', projectId.toString());

      this.http.post<any>('https://services.energylabs-ht.eu/imlDataCollector/services/tools/deleteprojecttoprosumerassociation', {}, { params })
        .subscribe(
          (response: HttpResponse<any>) => {
            if (response && (response.status === 200 || response.status === 201)) {
              console.log('Request successful:', response);
              // Handle success here
            } else {
              console.error('Unexpected response:', response);
              // Handle unexpected response here
            }
          },
          error => {
            console.error('Request failed:', error);
            // Handle error here
          }
        );
    } else {
      alert('This prosumer does not have a project.');
    }
  }

  shouldShowAddCountryLink(): boolean {
    const selectedProject = this.projectService.getSelectedProject();
    // Add any condition based on the selected project
    return selectedProject?.display !== 'MobileApp';
  }


  ngOnInit(): void {
    this.getProsumersHasProjects().subscribe((response) => {
        this.prosumers_has_projects = response;
      },
      (error) => {
        console.error('Error:', error);
        // Handle error
      });
  }

}
