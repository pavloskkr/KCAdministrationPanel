import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly storageKey = 'selectedProject';
  private selectedProject: { display: string, value: string } | null = null;

  setSelectedProject(option: { display: string, value: string }) {
    this.selectedProject = option;
    localStorage.setItem(this.storageKey, JSON.stringify(option));
  }

  getSelectedProject(): { display: string, value: string } | null {
    if (!this.selectedProject) {
      const storedProject = localStorage.getItem(this.storageKey);
      this.selectedProject = storedProject ? JSON.parse(storedProject) : null;
    }
    return this.selectedProject;
  }

  constructor() { }
}
