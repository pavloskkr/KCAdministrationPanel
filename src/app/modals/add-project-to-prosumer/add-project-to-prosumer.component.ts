import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-project-to-prosumer',
  templateUrl: './add-project-to-prosumer.component.html',
  styleUrls: ['./add-project-to-prosumer.component.scss']
})
export class AddProjectToProsumerComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  prosumerSearchText: string = '';
  prosumers: { id: number, name: string }[] = [];
  projects: { id: number, name: string }[] = [];
  selectedProsumer: number | null = null;
  selectedProject: number | null = null;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchProsumers();
    this.fetchProjects();
  }

  fetchProsumers() {
    this.http.get<any[]>('https://services.energylabs-ht.eu/imlDataCollector/services/tools/prosumers')
      .subscribe(
        (data: any[]) => {
          this.prosumers = data.map(item => ({id: item[0], name: item[1]}));

          this.prosumers.sort((a, b) => {
            // Convert names to lowercase for case-insensitive sorting
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            // Compare the names
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0; // Names are equal
          });
        },
        (error) => {
          console.error('Error fetching prosumers:', error);
        }
      );
  }

  fetchProjects() {
    this.http.get<any[]>('https://services.energylabs-ht.eu/imlDataCollector/services/tools/availableprojects')
      .subscribe(
        (data: any[]) => {
          // Map the data to objects with id and name properties
          this.projects = data.map(item => ({ id: item[0], name: item[1] }));

          // Sort the projects array by name
          this.projects.sort((a, b) => {
            // Convert names to lowercase for case-insensitive sorting
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            // Compare the names
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0; // Names are equal
          });
        },
        (error) => {
          console.error('Error fetching projects:', error);
        }
      );
  }


  navigateToProsumerHasProject() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/project_to_prosumer']);
  }

  matchPtoP() {
    // Check if both a prosumer and project are selected
    if (this.selectedProsumer && this.selectedProject) {
      // Set the query parameters for the request
      let params = new HttpParams()
        .set('prosumerId', this.selectedProsumer)
        .set('projectId', this.selectedProject);

      // Send the HTTP request with the query parameters
      this.http.post('https://services.energylabs-ht.eu/imlDataCollector/services/tools/updateprojecttoprosumer', {}, {
        params,
        responseType: 'text' // Set the response type to prevent JSON parsing
      })
        .subscribe(
          (response: any) => {
            if (response && (response.status === 200 || response.status === 201)) {
              console.log('Request successful:', response);
              this.closeModal.emit();
              this.navigateToProsumerHasProject();
              // Handle success here
            } else {
              console.error('Unexpected response:', response);
              this.closeModal.emit();
              this.navigateToProsumerHasProject();
              // Handle unexpected response here
            }
          },
          error => {
            console.error('Request failed:', error);
            // Handle error here
          }
        );
    } else {
      // Handle case where either a prosumer or project is not selected
      console.error('Both prosumer and project must be selected');
    }
  }


}
