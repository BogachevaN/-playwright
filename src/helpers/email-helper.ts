import { Message } from "mailosaur/lib/models"
import Mailosaur from 'mailosaur';
import { envVars } from '@/helpers/environment-variables-helper'

export function getConfirmationCode(letter: Message) {
    const codeRegexp = /\s[0-9]{6}/gm
    const body = letter.text!.body!
    const myArray = codeRegexp.exec(body)
    let code = ''
    if ( myArray !== null) {
        code = myArray[0].trim()
    }
    return code
}

export async function getLastLetter(mailClient: Mailosaur, email: string) {
    return await mailClient.messages.get(envVars.mailosaurServerId, {
        sentTo: email,
    });
}

export async function sendEmailFromMailosaur(mailClient: Mailosaur,to:string, subject:string) {
    await mailClient.messages.create(envVars.mailosaurServerId, {
        to,
        subject,
        html: '<p>I have a bug.</p>',
        send: true,
    });
}
