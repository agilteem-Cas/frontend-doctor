import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public configSub : Subject<any> = new Subject()
  public config
  constructor(private http: HttpClient) {

   }

   getConfig() {
    return this.http.get<any>(`${environment.api}/config`).toPromise().then(config=>{
      console.log('got config', config)
      this.config = config;
      if (config.matomoUrl && config.matomoId) {
        this.initializeMatomo(config.matomoUrl, config.matomoId);
      }
        this.configSub.next(config)
    });
  }


    //Matomo
    initializeMatomo(url: string, siteId: string): void {
        // @ts-ignore
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
            var u = url;
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', siteId]);
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.async = true; g.src = u+'matomo.js'; s.parentNode.insertBefore(g, s);
        })();
    }




}
