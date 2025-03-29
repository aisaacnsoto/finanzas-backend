export class WhatsAppUtil {

    static getMessage(template: string, data: object) {
        return template.replace(/{{(.*?)}}/g, (match, p1) => {
            return p1 in data ? data[p1] : match;
        });
    }
    
}