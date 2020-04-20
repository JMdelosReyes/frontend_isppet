import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from 'src/app/services/admin/admin.service';
import { ConfigService } from '../../../services/config/config.service';
import { VetService } from 'src/app/services/vet/vet.service';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.css']
})
export class AdFormComponent implements OnInit {
  @Input() editAd: any;

  @ViewChild('topBanner', { static: false }) animalPhoto: ElementRef;
  @ViewChild('LaterBanner', { static: false }) vaccinePassaport: ElementRef;
  isValid: boolean;
  isValidAdType: boolean;
  isValidRedirectTo: boolean;
  isValidTopBanner: boolean;
  isValidLateralBanner: boolean;
  isValidActive: boolean;
  create = false;
  // user data
  userlogged = this.configService.getUserLogged();
  vets: any;
  topBannerUrl: string; // Para la preview
  topBanner: any;
  lateralBannerUrl: string; // Para la preview
  lateralBanner: any;

  showError = false;
  errorMessage = '';
  registerSuccess = false;
  successMessage = '';
  registerForm: any;
  isValidVet: boolean;

  constructor(private vetService: VetService, private adminService: AdminService, private router: Router,
    public configService: ConfigService, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.vets = await this.vetService.getAllVets();
    this.editAd = await this.adminService.gettAdbyId(this.route.snapshot.params.id).catch(error => console.log(error));
    if (!this.editAd) {
      console.log('create');
      this.editAd = {};
      this.create = true;
    }
    this.initializeForm();

    this.isValid = false;
    this.isValidAdType = true;
    this.isValidRedirectTo = true;
    this.isValidTopBanner = true;
    this.isValidLateralBanner = true;
    this.isValidVet = true;
    this.isValidActive = true;
  }
  initializeForm() {
    this.registerForm = new FormGroup({
      ad_type: new FormControl(this.editAd.ad_type || '', [Validators.required, Validators.minLength(6)]),
      redirect_to: new FormControl(this.editAd.redirect_to || '', [Validators.required, Validators.minLength(10)]),
      top_banner: new FormControl('', [Validators.required]),
      lateral_banner: new FormControl('', [Validators.required]),
      vet_id: new FormControl('', []),
      active: new FormControl('', []),
    });
  }

  onSubmit() {
    this.cleanSuccess();
    this.cleanError();
    this.isValid = true;

    this.validationFields();

    if (this.isValid) {
      const formData: FormData = new FormData();
      formData.append('ad_type', this.registerForm.value.ad_type);
      if (this.registerForm.value.ad_type === 'CPM') {
        formData.append('price', '9.99');
      } else {
        formData.append('price', '0.99');
      }
      formData.append('redirect_to', this.registerForm.value.redirect_to);
      formData.append('top_banner', this.topBanner);
      formData.append('lateral_banner', this.lateralBanner);
      formData.append('vet_id', this.registerForm.value.vet_id);
      formData.append('active', this.registerForm.value.active);
      if (!this.create) {
        this.adminService
          .editAd(formData, this.route.snapshot.params.id)
          .then(res => {
            this.registerSuccess = true;
            this.successMessage = 'Edición exitosa';
            alert('Edición exitosa!');
            this.router.navigate(['/adsList']);
            setTimeout(() => {
              this.cleanData();
            }, 2000);
          })
          .catch(error => {
            this.errorMessage = (error.error.error && typeof error.error.error === 'string') ? error.error.error : 'Something went wrong';
            this.showError = true;
          });
      } else {
        this.adminService
          .createAd(formData)
          .then(res => {
            this.registerSuccess = true;
            this.successMessage = 'Creación exitosa';
            alert('Creación exitosa!');
            this.router.navigate(['/adsList']);
            setTimeout(() => {
              this.cleanData();
            }, 2000);
          })
          .catch(error => {
            this.errorMessage = (error.error.error && typeof error.error.error === 'string') ? error.error.error : 'Something went wrong';
            this.showError = true;
          });
      }
    }
  }

  validateAdType() {
    this.isValidAdType = ['CPM', 'DXC'].includes(this.registerForm.get('ad_type').value);
    if (!this.isValidAdType) {
      this.isValid = false;
    }
  }



  validateRedirect_to() {
    this.isValidRedirectTo = this.registerForm.get('redirect_to').valid;
    if (!this.isValidRedirectTo) {
      this.isValid = false;
    }
  }

  validateTop() {
    this.isValidTopBanner = this.registerForm.get('top_banner').valid;
    if (!this.isValidTopBanner) {
      this.isValid = false;

    }
  }
  validateLateral() {
    this.isValidLateralBanner = this.registerForm.get('lateral_banner').valid;
    if (!this.isValidLateralBanner) {
      this.isValid = false;
    }
  }
  validateVet() {
    this.isValidVet = (this.create && this.registerForm.get('vet_id')) || !this.create;
    if (!this.isValidVet) {
      this.isValid = false;
    }
  }
  validateActivo() {
    this.isValidActive = (this.create && this.registerForm.get('active')) || !this.create;
    if (!this.isValidActive) {
      this.isValid = false;
    }
  }
  validationFields() {
    this.validateAdType();
    this.validateRedirect_to();
    this.validateTop();
    this.validateLateral();
    this.validateVet();
    this.validateActivo();
  }


  checkExtension(filename: string) {
    const validExtensions = ['jpg', 'png', 'jpeg'];
    const fileExtension = filename.split('.').pop().toLowerCase();
    return validExtensions.includes(fileExtension);
  }

  cleanError() {
    this.showError = false;
    this.errorMessage = '';
  }

  cleanSuccess() {
    this.registerSuccess = false;
    this.successMessage = '';
  }

  cleanData() {
    this.cleanError();
    this.cleanSuccess();
    this.initializeForm();
    this.topBannerUrl = '';
    this.lateralBannerUrl = '';
  }

  showPreviewTop(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.topBannerUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  showPreviewLateral(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.lateralBannerUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getTopBannerValidate($event: Event) {
    this.isValidTopBanner = true;
    this.topBannerUrl = '';
    Array.from($event.target['files']).forEach(element => {
      const fileName = element['name'];
      if (this.checkExtension(fileName)) {
        this.topBanner = element;
        this.showPreviewTop(element);
      } else {
        this.isValidTopBanner = false;
      }
    });
  }
  getLateralBannerValidate($event: Event) {
    this.isValidLateralBanner = true;
    this.lateralBannerUrl = '';
    Array.from($event.target['files']).forEach(element => {
      const fileName = element['name'];
      if (this.checkExtension(fileName)) {
        this.lateralBanner = element;
        this.showPreviewLateral(element);
      } else {
        this.isValidLateralBanner = false;
      }
    });
  }

}
