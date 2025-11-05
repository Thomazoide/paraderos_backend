import { createHmac, timingSafeEqual } from "crypto";
import { sign, SignOptions } from "jsonwebtoken";

export class Encrypter {

    private Secret: string;
    private Pepper: string;
    
    constructor(
        secret: string,
        pepper: string
    ){
        this.Secret = secret;
        this.Pepper = pepper;
    };

    EncryptPassword(password: string): string {
        return createHmac("sha256", this.Secret).update(password + this.Pepper).digest("hex");
    }

    VerifyPassword(password: string, encryptedPassword: string): boolean {
        const reEncryptedPassword = this.EncryptPassword(password);
        const bufferA = Buffer.from(reEncryptedPassword, "hex");
        const bufferB = Buffer.from(encryptedPassword, "hex");
        if(bufferA.length !== bufferB.length) return false;
        return timingSafeEqual(bufferA, bufferB);
    }

    CreateJWT(payload: Record<string, any>): string {
        const opts: SignOptions = {
            algorithm: "HS256",
            expiresIn: "3h"
        };
        return sign(payload, this.Secret, opts);
    }
};