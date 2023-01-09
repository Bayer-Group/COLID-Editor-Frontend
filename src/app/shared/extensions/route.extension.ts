import { ActivatedRouteSnapshot } from '@angular/router';

export class RouteExtension {
    public static SetRouteInStorage(route: ActivatedRouteSnapshot) {
        console.log("Setting route in storage");

        const urlSegments = new Array<string>();
        this.getUrlSegment(urlSegments, route);
        console.log("URL Segments are", urlSegments);

        if (urlSegments.length !== 0) {
          window.localStorage.setItem('url', JSON.stringify(urlSegments));
        }

        if (route.queryParams != null) {
          window.localStorage.setItem('queryParams', JSON.stringify(route.queryParams));
        }
    }

    private static getUrlSegment(array: string[], route: ActivatedRouteSnapshot) {
        if (route.url.length > 0) {
            array.push(route.url[0].path);
        }

        if (route.children.length > 0) {
            this.getUrlSegment(array, route.children[0]);
        }
    }

}
