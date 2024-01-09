import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  selectedProject: string = ''; // Property to store the selected token
  projectOptions: { display: string, value: string }[] = [
    { display: 'MobileApp', value: '0ed10a94-b099-49d3-b380-d33b3036f7eb' },
    { display: 'iml-projects', value: 'c24eb7da-9692-4cbc-91af-e28fd291e718' },
  ];

  private readonly usersEndpointBase = 'https://userauth.energylabs-ht.eu/auth/realms/';
  private authEndpoint = 'https://userauth.energylabs-ht.eu/auth/realms/MobileApp/protocol/openid-connect/token';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private projectService: ProjectService) {
  }

  ngOnInit(): void {
  }

  login() {
    const selectedOption = this.projectOptions.find(option => option.value === this.selectedProject);

    if (!selectedOption) {
      // Handle the case where no project is selected
      alert('Please select a project');
      return;
    }

    this.projectService.setSelectedProject(selectedOption);

    const body = new URLSearchParams();
    body.set('client_id', 'admin-cli');
    body.set('client_secret', selectedOption.value);
    body.set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post(`${this.usersEndpointBase}${selectedOption.display}/protocol/openid-connect/token`, body.toString(), {headers}).subscribe(
      (response: any) => {
        const accessToken = response.access_token;

        console.log("THIS IS IT: ", accessToken)
        this.authService.setAccessToken(accessToken);
        // Successful response, navigate to the dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Handle error, show alert for wrong token
        alert('Wrong token');
      }
    );
  }
}
