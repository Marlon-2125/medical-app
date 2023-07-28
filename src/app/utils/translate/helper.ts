import { Injectable } from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';

@Injectable({
    providedIn: 'root'
})

export class TranslateHelper {

    translateTableMaterial(paginator: MatPaginator) {
        let dataSource:any = {};
        dataSource = paginator;
        dataSource.paginator._intl.itemsPerPageLabel = 'Items por página';
        dataSource.paginator._intl.nextPageLabel = 'Siguiente';
        dataSource.paginator._intl.previousPageLabel = 'Anterior';
        dataSource.paginator._intl.firstPageLabel = "Primera Página";
        dataSource.paginator._intl.lastPageLabel = "Última Página";
        dataSource.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length == 0 || pageSize == 0) {
                return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            // If the start index exceeds the list length, do not try and fix the end index to the end.
            const endIndex = startIndex < length ?
                Math.min(startIndex + pageSize, length) :
                startIndex + pageSize;
            return `${startIndex + 1} – ${endIndex} de ${length}`;
        }
        return dataSource;
    }
}