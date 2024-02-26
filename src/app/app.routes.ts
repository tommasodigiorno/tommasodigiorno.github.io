import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MovieInfoComponent } from './components/movie-info/movie-info.component';
import { Observable, forkJoin } from 'rxjs';
import { inject } from '@angular/core';
import { MovieService } from './core/services/movie.service';
import { ProfileComponent } from './components/profile/profile.component';

//Resolver che recupera dettagli del film e trailer
export const movieResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<any> => {
  const movieService = inject(MovieService);
  return forkJoin({
    info: movieService.getMovieInfo(route.params['id']),
    trailer: movieService.getMovieTrailer(route.params['id']),
  });
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'movie/:id',
    component: MovieInfoComponent,
    resolve: { movieInfo: movieResolver },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
