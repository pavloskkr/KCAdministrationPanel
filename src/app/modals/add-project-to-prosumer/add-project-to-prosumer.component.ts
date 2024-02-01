import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";

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

  constructor(private http: HttpClient) {
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
          this.projects = data.map(item => ({id: item[0], name: item[1]}));
        },
        (error) => {
          console.error('Error fetching projects:', error);
        }
      );
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
      // Handle case where either a prosumer or project is not selected
      console.error('Both prosumer and project must be selected');
    }
  }


}
