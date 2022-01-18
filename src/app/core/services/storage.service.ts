import { Injectable } from '@angular/core';
import { StorageRefService } from './storage-ref.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _localStorage: Storage;

  constructor(private storageRefService: StorageRefService) {
    this._localStorage = storageRefService.localStorage
  }

  public set(key: string, value: any) {
    const jsonData = JSON.stringify(value)
    this._localStorage.setItem(key, jsonData);
  }

  public get(key: string): any {
    return this._localStorage.getItem(key);
  }
  public delete(key: string) {
    this._localStorage.removeItem(key);
  }

  public clear(): void {
    this._localStorage.clear();
  }
}
