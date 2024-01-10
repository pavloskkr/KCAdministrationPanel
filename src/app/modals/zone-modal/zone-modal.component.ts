import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-zone-modal',
  templateUrl: './zone-modal.component.html',
  styleUrls: ['./zone-modal.component.scss']
})
export class ZoneModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  addZones() {

  }
}
