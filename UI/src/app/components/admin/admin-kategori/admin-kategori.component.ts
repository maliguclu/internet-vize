import { ConfirmDialogComponent } from './../../dialogs/confirm-dialog/confirm-dialog.component';
import { Sonuc } from './../../../models/Sonuc';
import { KategoriDialogComponent } from './../../dialogs/kategori-dialog/kategori-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAlertService } from './../../../services/myAlert.service';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Kategori } from 'src/app/models/Kategori';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-kategori',
  templateUrl: './admin-kategori.component.html',
  styleUrls: ['./admin-kategori.component.css'],
})
export class AdminKategoriComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatSort;

  kategoriler: Kategori[];
  dataSource: any;

  dialogRef: MatDialogRef<KategoriDialogComponent>;
  displayedColumns = ['KategoriAdi', 'islemler'];
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    public apiServis: ApiService,
    public matDialog: MatDialog,
    public alert: MyAlertService
  ) {}

  ngOnInit() {
    this.KategoriListele();
  }

  KategoriOlustur() {
    var yeniKayit: Kategori = new Kategori();
    this.dialogRef = this.matDialog.open(KategoriDialogComponent, {
      width: '600px',
      data: { kayit: yeniKayit, islem: 'ekle' },
    });
    this.dialogRef.afterClosed().subscribe((katAdi) => {
      if (katAdi) {
        this.apiServis.KategoriEkle(katAdi).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) this.KategoriListele();
        });
      }
    });
  }

  KategoriListele() {
    this.apiServis.KategoriListe().subscribe((d: Kategori[]) => {
      this.kategoriler = d;
      this.dataSource = new MatTableDataSource(this.kategoriler);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.kategoriler);
    });
  }

  KategoriSil(kayit: Kategori) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '600px',
    });
    this.dialogRefConfirm.componentInstance.dialogMesaj =
      kayit.katAdi + ' Seçili kategori silinecektir?';

    this.dialogRefConfirm.afterClosed().subscribe((d) => {
      if (d) {
        this.apiServis.KategoriSil(kayit.katId).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
            this.KategoriListele();
          }
        });
      }
    });
  }

  KategoriDuzenle(kayit: Kategori) {
    this.dialogRef = this.matDialog.open(KategoriDialogComponent, {
      width: '600px',
      data: {
        kayit: kayit,
        islem: 'duzenle',
      },
    });
    this.dialogRef.afterClosed().subscribe((d) => {
      if (d) {
        kayit.katAdi = d.katAdi;
        this.apiServis.KategoriDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
            this.KategoriListele();
          }
        });
      }
    });
  }
}
