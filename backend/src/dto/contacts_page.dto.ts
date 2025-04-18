import { IsNotEmpty, IsOptional } from 'class-validator';

export class ContactsPagedDto {
    @IsOptional()
    id!: number;
    @IsNotEmpty({
        message: 'text Поле для описание страницы обязательно к заполнению',
    })
    text!: string;
    @IsNotEmpty({
        message: 'map Поле для ccылки на картк обязательно к заполнению',
    })
    map!: string;
}
