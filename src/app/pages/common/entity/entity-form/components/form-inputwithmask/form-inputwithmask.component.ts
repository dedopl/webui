import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { FieldConfig } from '../../models/field-config.interface';
import { Field } from '../../models/field.interface';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

@Component({
  selector: 'form-inputwithmask',
  templateUrl: './form-inputwithmask.component.html',
  styleUrls: ['../dynamic-field/dynamic-field.css'],
})
export class FormInputWithMaskComponent implements Field {
  @ViewChild('fileInput', { static: true}) fileInput;
  config: FieldConfig;
  group: FormGroup;
  fieldShow: string;
  public fileString;
  public showPassword = false;
  public myModel = '';

  constructor(public translate: TranslateService) {}
 
  getMask() {
    switch(this.config.mask) {
      case 'email' : return { mask : emailMask };
      case 'usPhone' : return { mask : ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] };
      case 'usPhoneWithCountryCode' : return { mask : ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] };
      case 'usDate' : return {
          mask : [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
          keepCharPositions : true,
          pipe : createAutoCorrectedDatePipe('mm/dd/yyyy HH:MM')
        }
    }
  }

  changeListener($event): void {
    this.readFile($event.target);
  }

  readFile(inputValue: any) {
    var file: File = inputValue.files[0];
    var fReader: FileReader = new FileReader();

    fReader.onloadend = (e) => {
      this.fileString = fReader.result;
      this.contents(fReader.result);
    }
    if (this.config.fileType == 'binary') {
      fReader.readAsBinaryString(file);
    } else {
      fReader.readAsText(file);
    }
  }

  contents(result:any) {
    if (this.config.fileType == 'binary'){
      this.group.controls[this.config.name].setValue(btoa(result));
    } else {
      this.group.controls[this.config.name].setValue(result);
    }
  }

  blurEvent(){
    if(this.config.blurStatus){
      this.config.blurEvent(this.config.parent)
    }
  }

  togglePW() {
    let inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].placeholder.toLowerCase().includes('password') || 
      inputs[i].placeholder.toLowerCase().includes('passphrase') ||
      inputs[i].placeholder.toLowerCase().includes('secret')) {
        if (inputs[i].type === 'password') {
          inputs[i].type = 'text';
        } else {
          inputs[i].type = 'password';
        }
      }
    }
    this.showPassword = !this.showPassword;
  }
}
