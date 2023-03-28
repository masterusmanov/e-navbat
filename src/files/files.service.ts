import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid'

@Injectable()
export class FilesService {
    async createFile(file: any): Promise<string> {
        try {
            const fileName = uuid.v4() + file.originalname;
            const filePath = path.resolve(__dirname,'..', 'static');
            
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true});
            }
            fs.writeFileSync(path.join(filePath,fileName), file.buffer);
            console.log(fileName, 'Success');
            return fileName;
            
        } catch (error) {
            throw new HttpException(
                "Fileni yoziwda xatlik",
                HttpStatus.INTERNAL_SERVER_ERROR
            )}
        }
    }

