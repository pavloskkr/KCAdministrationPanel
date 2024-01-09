import {Component, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  accessToken: string | null;
  prosumerUUID: string | undefined;
  usersEndpointBase = 'https://userauth.energylabs-ht.eu/auth/admin/realms/';

  constructor(private http: HttpClient, private authService: AuthService, private projectService: ProjectService) {
    this.accessToken = authService.getAccessToken();
  }

  // Add your user properties here
  user = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    projectName: '',
    country: '',
    password: '',
    temporary: false
  };
  currentStep = 1;
  projectList: string[] = ['InternalUse', 'Sender', 'Drimpac', 'Parity', 'ECF4Clim', 'Chronicle', 'Accept'].sort();
  countryList: { display: string; value: string }[] = [
    { display: 'Austria', value: 'AU' },
    { display: 'Denmark', value: 'DK' },
    { display: 'Finland', value: 'FI' },
    { display: 'Greece', value: 'GR' },
    { display: 'Ireland', value: 'IE' },
    { display: 'Portugal', value: 'PT' },
    { display: 'Spain', value: 'ES' },
    { display: 'Romania', value: 'RO' },
    { display: 'Switzerland', value: 'CH' },
  ].sort();

  nextStep() {
    const requestBody = {
      "prosumer-key": this.user.username
    };

    this.http.post('https://services.energylabs-ht.eu/imlDataCollector/services/lfmhelpers/prosumers/filter', requestBody)
      .subscribe(
        (response: any) => {
          if (response && response.length > 0) {
            this.prosumerUUID = response[0].uuid;
          } else {
            // Set a default value if the response is empty
            this.prosumerUUID = '00000000-0000-0000-0000-00000000000';
          }
          // If the request is successful, proceed to the next step
          this.currentStep++;
        },
        (error) => {
          // Handle errors
          console.error('Error:', error);
        }
      );
  }

  previousStep() {
    this.currentStep--;
  }

  addUser() {
    const selectedProject = this.projectService.getSelectedProject();

    // Prepare the payload
    const payload = {
      username: this.user.username,
      enabled: true,
      totp: false,
      emailVerified: true,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      attributes: {
        projectName: [this.user.projectName],
        countryCode: [this.user.country],
        prosumerUUID: [this.prosumerUUID],
      },
      credentials: [
        {
          type: 'password',
          value: this.user.password,
          temporary: this.user.temporary
        }
      ],
      requiredActions: ['UPDATE_PASSWORD'],
      notBefore: 0
    };


    console.log("Payload :", payload);
    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    });

    // Make the HTTP POST request
    this.http.post(`${this.usersEndpointBase}${selectedProject?.display}/users`, payload, {headers}).subscribe(
      (response) => {
        console.log('User added successfully:', response);
        // Additional logic or feedback here
        this.closeModal.emit(); // Close the modal after successful addition
      },
      (error) => {
        alert(error.error.errorMessage);
        console.error('Error adding user:', error);
        // Handle error or provide user feedback
      }
    );
  }
}
