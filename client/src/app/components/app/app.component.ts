import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from '../../../../../common/communication/message';
import { IndexService } from '../../services/index/index.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly title: string = 'SketchPad Clone';
    message = new BehaviorSubject<string>('');

    constructor(private basicService: IndexService,public route : Router) {
        this.basicService
            .basicGet()
            .pipe(map((message: Message) => `${message.title} ${message.body}`))
            .subscribe(this.message);
    }
}
