import { BasePuppeteer } from "base-puppeteer";
export declare class AutoFollow extends BasePuppeteer {
    username: string;
    password: string;
    cookies: any[];
    login({ username, password, totpSecret }: {
        username: any;
        password: any;
        totpSecret: any;
    }): Promise<void>;
    followList({ list }: {
        list: any;
    }): Promise<void>;
}
