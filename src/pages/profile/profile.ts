import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

import { Storage } from 'ionic/storage';

import { Http, Headers } from 'angular2/http';
import { FORM_DIRECTIVES } from 'angular2/common';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from '../../providers/auth-service';
import 'rxjs/add/operator/map'

/*
  Generated class for the Profile page.
  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
    LOGIN_URL: string = "http://lvh.me:3000/v1/users/";
    SIGNUP_URL: string = "http://localhost:3001/users";

    auth: AuthService;
    // When the page loads, we want the Login segment to be selected
    authType: string = "login";
    // We need to set the content type for the server
    contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
    error: string;
    jwtHelper: JwtHelper = new JwtHelper();
    local: Storage = new Storage(LocalStorage);
    user: string;

    constructor(private http: Http) {
        this.auth = AuthService;
        this.local.get('profile').then(profile => {
            this.user = JSON.parse(profile);
        }).catch(error => {
            console.log(error);
        });
    }

    login(credentials) {
        this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
            .map(res => res.json())
            .subscribe(
            data => this.authSuccess(data.id_token),
            err => this.error = err
            );
    }

    signup(credentials) {
        this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
            .map(res => res.json())
            .subscribe(
            data => this.authSuccess(data.id_token),
            err => this.error = err
            );
    }

    logout() {
        this.local.remove('id_token');
        this.user = null;
    }

    authSuccess(token) {
        this.error = null;
        this.local.set('id_token', token);
        this.user = this.jwtHelper.decodeToken(token).username;
    }
}