import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as XLSX from 'xlsx';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-zone-modal',
  templateUrl: './zone-modal.component.html',
  styleUrls: ['./zone-modal.component.scss']
})
export class ZoneModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  private headings: string[] = []; // Declare headings as a property
  zonesData: any[] = [];
  successCount = 0;
  errorCount = 0;
  isProcessing = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();

    // Check if dataTransfer is not null
    if (event.dataTransfer) {
      this.handleFile(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.handleFile(inputElement.files);
    }
  }

  private handleFile(files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0];
      // Process the file (e.g., read content, parse Excel, etc.)
      this.readExcelContent(file);
    }
  }

  private readExcelContent(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (data) {
        const workbook: XLSX.WorkBook = XLSX.read(data, {type: 'binary'});
        const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
        const excelData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});

        // Assuming the first row contains headings
        this.headings = excelData[0];
        const zonesData = excelData.slice(1); // Exclude the headings row

        // Process each row under the headings
        this.addZones(zonesData);
      }
    };

    reader.readAsBinaryString(file);
  }

  addZones(zonesData: any[]): void {
    // Assign the zonesData parameter to the class property
    this.zonesData = zonesData;
    this.isProcessing = true;

    zonesData.forEach(row => {
      const zoneName = row[this.headings.indexOf('Zone Name')];
      const prosumerName = row[this.headings.indexOf('ProsumerName')];
      const country = row[this.headings.indexOf('Country')];
      const zoneType = row[this.headings.indexOf('Zone Type')];

      // Create the payload for each record
      const payload = {
        name: zoneName,
        prosumer: prosumerName,
        country: {
          countryId: country // Set the appropriate countryId based on the country name or code
        },
        prosumerType: {
          prosumerTypeId: zoneType // Set the appropriate prosumerTypeId
        }
      };

      // Call the API or perform the desired action with the payload
      this.postZoneData(payload);
    });
    this.isProcessing = false;
  }

  postZoneData(payload: any): void {
    // Make the API call to add a zone with the provided payload
    // Example API call using HttpClient
    // Modify the API endpoint based on your server configuration
    const apiUrl = 'https://services.energylabs-ht.eu/imlDataCollector/services/tools/spaces';

    this.http.post(apiUrl, payload).subscribe(
      (response: any) => {
        if (response && (response.status === 200 || response.status === 201)) {
          console.log('Zone added successfully:', response);
          this.successCount++;
        } else {
          console.error('Failed to add zone. Unexpected response:', response);
          this.errorCount++;
        }
      },
      (error) => {
        if (error && (error.status === 200 || error.status === 201)) {
          // Check for 200 or 201 status within the error callback
          console.log('Zone added successfully:', error);
          this.successCount++;
        } else {
          console.error('Failed to add zone:', error);
          this.errorCount++;
        }
      },
      () => {
        // Display alert after each request is processed
        this.displayAlert();
      }
    );
  }

  displayAlert(): void {
    // Display alert only when all requests are processed
    if (this.successCount + this.errorCount === this.zonesData.length) {
      window.alert(`Successful insertions: ${this.successCount}\nAlready exist: ${this.errorCount}`);

      // Reset counts for the next upload
      this.successCount = 0;
      this.errorCount = 0;
      this.closeModal.emit()
    }
  }

}
