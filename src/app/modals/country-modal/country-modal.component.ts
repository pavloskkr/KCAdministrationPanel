import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss']
})
export class CountryModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  newCountry: { countryCode: string, countryName: string } = {countryCode: '', countryName: ''};
  newCountryForm: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.newCountryForm = this.formBuilder.group({
      countryCode: ['', [Validators.required, Validators.pattern('[A-Z]{2}')]],
      countryName: ['', [Validators.required, Validators.pattern('[A-Za-z]+')]],
    });
  }

  ngOnInit(): void {
  }


  addCountry() {
    const apiUrl = 'https://services.energylabs-ht.eu/imlDataCollector/services/tools/countries';

    // Make the POST request with { responseType: 'text' }
    this.http.post(apiUrl, {
      key: this.newCountry.countryCode,
      label: this.newCountry.countryName,
      code: this.newCountry.countryCode
    }, {responseType: 'text'}).subscribe(
      (response) => {
        console.log('Country added successfully:', response);
        window.alert('Country added successfully!');
        this.closeModal.emit();
      },
      (error) => {
        console.error('Failed to add country:', error);
        // Handle error
      }
    );
  }
}
