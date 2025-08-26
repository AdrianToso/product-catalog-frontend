import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {
  transform(bytes: number, decimals: number = 2): string {
    if (bytes === 0 || isNaN(bytes)) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    // Formateo correcto con decimales
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    return value + ' ' + sizes[i];
  }
}