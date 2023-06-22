"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoFollow = void 0;
const base_puppeteer_1 = require("base-puppeteer");
const totp_generator_1 = __importDefault(require("totp-generator"));
const timeout = async (n) => await new Promise((resolve) => setTimeout(resolve, n));
class AutoFollow extends base_puppeteer_1.BasePuppeteer {
    async login({ username, password, totpSecret }) {
        await this._page.goto('https://instagram.com');
        await this.waitForSelector({ selector: 'input[name="username"]' });
        await this.type({ selector: 'input[name="username"]', value: username });
        await this.type({ selector: 'input[name="password"]', value: password });
        await this.click({ selector: 'button[type="submit"]' });
        await this.timeout({ n: 5000 });
        if (await this.evaluate({ script: String(function () { return Boolean(document.querySelector('input[name="verificationCode"]')); }), args: [] })) {
            await this.type({ selector: 'input[name="verificationCode"]', value: (0, totp_generator_1.default)(totpSecret.replace(/\s+/g, '')) });
            await this.click({ selector: 'button[type="button"]' });
            await this.timeout({ n: 5000 });
        }
    }
    async followList({ list }) {
        const split = list.toString('utf8').split('\n').filter(Boolean);
        for (const username of split) {
            await this._page.goto('https://instagram.com/' + username);
            await this.waitForSelector({ selector: 'div#fb-root' });
            await this.timeout({ n: 2000 });
            await this._page.evaluate(async () => {
                const b = document.querySelector('button[type="button"]');
                if (b) {
                    if (b.innerText.match('Follow'))
                        b.click();
                }
                await new Promise((resolve) => setTimeout(resolve, 5000));
            });
            console.log(username);
            await this.timeout({ n: 10000 });
        }
    }
}
exports.AutoFollow = AutoFollow;
//# sourceMappingURL=autofollow.js.map