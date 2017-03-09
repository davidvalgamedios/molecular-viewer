import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'msg-helper',
    template: `
        <div class="explanation flxCntr">
            <div class="big">{{getMsgData('big')}}</div>
            <div class="med">{{getMsgData('med')}}</div>
            <div class="action">
                <div class="btn" (click)="sendCommandSignal(getMsgData('actionSignal'))">
                     {{getMsgData('actionText')}} <i class="fa fa-plus-circle"></i>
                </div>
            </div>
            <div class="small">{{getMsgData('small')}}</div>
        </div>
    `
})
export class EditorMessageHelperComponent{
    msgData:any;

    @Input() msgId:string;
    @Output() editorCommands: EventEmitter<string> = new EventEmitter<string>();

    constructor(){
        this.msgData = {
            emptyProject:{
                big: 'Parece que este proyecto está vacio.',
                med: '¿Que te parece si empezamos por añadir un fondo?',
                actionText: 'Añadir fondo',
                actionSignal: 'editBackground',
                small: '(Podrás cambiarlo más tarde si no te gusta)'
            },
            noMolecules:{
                big: '¡Genial!',
                med: 'Ahora que ya tienes un fondo ¿Añadimos algunas moléculas?',
                actionText: 'Añadir moléculas',
                actionSignal: 'addMolecule',
                small: 'Psst. Todos tus cambios se guardarán automáticamente en tu ordenador. Solo recuerda guardar antes de irte.'
            }
        };
    }

    getMsgData(dataId){
        if(this.msgId &&
            this.msgData.hasOwnProperty(this.msgId) &&
            this.msgData[this.msgId].hasOwnProperty(dataId)){
            return this.msgData[this.msgId][dataId];
        }
    }

    sendCommandSignal(signal){
        this.editorCommands.emit(signal);
    }
}