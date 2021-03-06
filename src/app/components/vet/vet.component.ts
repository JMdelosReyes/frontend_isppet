import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { VetService } from 'src/app/services/vet/vet.service';
import * as mapboxgl from 'mapbox-gl';
import { ConfigService } from '../../services/config/config.service';
import { Router } from '@angular/router';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-vet',
  templateUrl: './vet.component.html',
  styleUrls: ['./vet.component.css']
})

export class VetComponent implements OnInit {

  //icons
  faCrown = faCrown;
  faInfoCircle = faInfoCircle;

  itemsPerPage = 5;
  vets = new Array();
  returnedVets = new Array();
  env = environment.endpoint;
  mapkey = environment.mapbox_key;
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;

  // pagginations
  page = 1;
  pageSize = 5;

  userlogged = this.configService.getUserLogged();
  rol: string = this.userlogged ? this.userlogged.role : 'disconnected';

  constructor(@Inject(DOCUMENT) private document: any, private vetService: VetService, public configService: ConfigService, public router: Router) {
    this.mapbox.accessToken = environment.mapbox_key;

  }


  ngOnInit(): void {
    this.vets = new Array();
    this.vetService.getAllVets().then(res => {
      res.forEach(vet => {
        this.vets.push(vet);
      });
      this.returnedVets = this.vets.slice(0, this.itemsPerPage);
    });
  }

  onSubmit(id: string, lng: string, lat: string) {

    this.map = new mapboxgl.Map({
      container: 'map' + id,
      style: `mapbox://styles/mapbox/streets-v11`,
      zoom: 14,
      center: [lng, lat]
    });
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(this.map);
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.resize();


  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedVets = this.vets.slice(startItem, endItem);
  }
  onNavigate(url: string){
    this.document.location.href = url;
  }
  onPremium(id: number) {
    this.vetService.changePremium(id).then(res => {
      this.ngOnInit();
    });

  }
  onNormal(id: number) {
    this.vetService.changeNormal(id).then(res => {

      this.ngOnInit();
    });
  }
}
