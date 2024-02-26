import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie, VideoInfo, VideoResult } from '../../core/interfaces/types';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface ResolvedMovie {
  info: Movie;
  trailer: VideoResult;
}

@Component({
  selector: 'app-movie-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './movie-info.component.html',
  styleUrl: './movie-info.component.scss',
})
export class MovieInfoComponent {
  movie!: Movie;
  trailer!: VideoInfo | undefined;

  //intercettare i dati passati dalla navigazione
  //navigazione da home.component -> app.routes -> Resolver per recuperare dati -> Qui
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    route.data.subscribe({
      next: (routeData) => {
        let resolvedMovie: ResolvedMovie = routeData['movieInfo'];
        console.log(resolvedMovie.trailer);
        this.movie = resolvedMovie.info;
        this.trailer = resolvedMovie.trailer.results.find(
          (video) =>
            video.site == 'YouTube' &&
            video.type == 'Trailer' &&
            video.official == true &&
            !video.name.toLowerCase().includes('teaser')
        );
      },
    });
  }

  openTrailer() {
    this.dialog.open(TrailerDialog, {
      data: {
        trailerUrl: this.trailer?.key
      }
    })
  }
}

@Component({
  selector: 'trailer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  template: `
    @if(trailerUrl){
      <iframe [src]="trailerUrl" width="560" height="315" frameborder="0" allowfullscreen></iframe>
    }
  `
})
export class TrailerDialog implements OnInit {

  trailerUrl!: SafeResourceUrl;
  
  constructor(public dialogRef: MatDialogRef<TrailerDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.trailerUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.data.trailerUrl}`)
  }
}
