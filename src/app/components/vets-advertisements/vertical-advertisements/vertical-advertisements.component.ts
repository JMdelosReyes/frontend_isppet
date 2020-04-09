import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VetService } from 'src/app/services/vet/vet.service';
import { BreedingService } from 'src/app/services/breeding/breeding.service';

@Component({
  selector: 'app-vertical-advertisements',
  templateUrl: './vertical-advertisements.component.html',
  styleUrls: ['./vertical-advertisements.component.css']
})
export class VerticalAdvertisementsComponent implements OnInit {

  breedings = new Array();
  advertisements: any;
  env = environment.endpoint;
  nBredAds: any;


  constructor(private vetService: VetService, private breedingService: BreedingService) { }

  ngOnInit(): void {

    this.breedingService.getAllBreedings().then(res => this.breedings.push(res))
    .then(res => console.log(this.breedings));

    this.nBredAds = 2;
    /*Varía la altura de la página según el número de elementos en la lista*/

    this.vetService.getVetAdvertisements(this.nBredAds).then(res => this.advertisements = res.ads)
    .then(res => console.log(this.advertisements));

  }

  onClickAdvertisement(advertisement: any) {
    /*console.log(advertisement);
    console.log(advertisement.id);*/
    this.vetService.clickOnAdvertisement(advertisement.id);
  }

}