import { parse } from "csv-parse/sync"
import fs from 'fs'
import path from 'path'

export class TestDataHelper {
    users: any

    constructor() {
        this.users = parse(fs.readFileSync(path.join(__dirname,'/test-data/test-users.csv')), {
            columns: true,
            skip_empty_lines: true,
        })
    }
}
