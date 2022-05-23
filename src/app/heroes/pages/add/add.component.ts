import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";

import { Hero, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmComponent } from '../../components/confirm/confirm.component';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [`
    img{
      width: 100%;
      border-radius: 5px;
    }
  `
  ]
})
export class AddComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  hero: Hero = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.MarvelComics,
    alt_img: ''
  }

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) {
      return
    }

    this.activatedRoute.params.pipe(
        switchMap(
          ({id}) => this.heroesService.getHeroById(id)
        )
      ).subscribe(
        hero => this.hero = hero
      )

  }

  save() {
    if (this.hero.superhero.trim().length === 0) {
      return;
    } 

    if(this.hero.id) {
      // update
      this.heroesService.updateHero(this.hero).subscribe(
        hero => {
          this.showSnackBar('Héroe actualizado');
        }
      )
    } else {
      this.heroesService.addHero(this.hero).subscribe(
        hero => {
          this.router.navigate(['/heroes/edit', hero.id]);
          this.showSnackBar('Héroe creado');
        }
      )
    }

  }

  delete() {

    const dialog = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {...this.hero} // para evitar modificaciones en el objeto original
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if (result) {
          this.heroesService.deleteHero(this.hero.id!).subscribe(
            resp => {
              this.router.navigate(['/heroes']);
          })
        }

      }
    )
    
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 2500
    })
  }

}
