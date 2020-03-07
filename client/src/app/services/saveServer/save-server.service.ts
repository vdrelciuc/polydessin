import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveServerService {

  constructor() { }

  // inspired from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
  checkValidity(field :string): boolean{
    if (field === undefined || field === '') {
      return false;
    }
    for(let i = 0 ; i < field.length ; ++i ){
      let asci = field.charCodeAt(i);
      if (!(asci > 47 && asci < 58) && // numeric (0-9)
        !(asci > 64 && asci < 91) && // upper alpha (A-Z)
        !(asci > 96 && asci < 123)) { // lower alpha (a-z)
        return false;
      }
    }

    return true;
  }

  addTag(etiquette : string, data : Set<string>): boolean{
    if (this.checkValidity(etiquette)){
      data.add(etiquette);
      return true;
    }
    return false;
  }

  removeTag(etiquette : string, data : Set<string>): boolean{
    data.delete(etiquette);
    return data.size !== 0;
  }
}
