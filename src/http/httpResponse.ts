import { HttpHeader } from "./httpHeader";
export class HttpResponse<T> {
    public body: Uint8Array;
    public statusCode: number;
    public statusText: string;
    public headers: HttpHeader[];

    constructor() {
        this.headers = [];
    }

    public toByteArray(): Uint8Array {
        return this.body;
    }

    public toObject(): T {
        try {
            const decodedString = this.utf8ArrayToStr(this.body);
            return JSON.parse(decodedString.trim());
        }
        catch (error) {
            throw new Error(error);
        }
    }

    public toText(): string {
        const decodedString = this.utf8ArrayToStr(this.body);
        return decodedString.trim();
    }

    private utf8ArrayToStr(array): string {
        let out, i, len, c;
        let char2, char3;

        out = "";
        len = array.length;
        i = 0;

        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    }
}