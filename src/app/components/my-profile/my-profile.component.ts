import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  particular: any;
  env = environment.endpoint;
  reviews: any;
  pets: any;
  numReviews = 0;
  numPets = 0;

  constructor(private profileService: ProfileService,
              private router: Router, private route: ActivatedRoute, public configService: ConfigService) { }

  ngOnInit(): void {
    this.profileService.getParticularLogged().then(res => {
      this.particular = res;
      console.log(this.particular);
      this.profileService.getReviewsByParticularId(this.particular.particular.id).then(element =>{
        this.reviews=element;
        this.numReviews = this.reviews.length;
      } );
      this.profileService.getPetsByParticularId(this.particular.particular.id).then(element =>{
        this.pets=element;
        this.numPets = this.pets.length;
      } );
    });
  }

}