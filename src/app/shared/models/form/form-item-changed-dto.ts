export class FormItemChangedDTO {
    id: string;
    value: any;

    constructor(id: string, value: any) {
        this.id = id;
        this.value = value;
    }
}
