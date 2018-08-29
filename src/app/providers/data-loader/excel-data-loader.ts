import { Injectable } from '@angular/core';
import { DataLoader } from './data-loader';
import { FileService } from '../file/file.service';
import { MergeableRowDataModel } from './mergeableRowDataModel';
import { Observable } from 'rxjs';

@Injectable()
export class ExcelDataLoader extends DataLoader {

    constructor(private _fileService: FileService) {
        super();
    }

    load(fileName: string): Observable<MergeableRowDataModel[]> {
        return null;
    }

}
