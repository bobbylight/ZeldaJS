/**
 * A simple mapping of string names to boolean values.<p>
 * If a secret is transient, its value will be set back to its default if
 * <code>reset()</code> is called.
 */
export class Secrets {
    private readonly secrets: SecretsData;

    constructor() {
        this.secrets = {};
    }

    add(secretName: string, secret: Secret): Secrets {
        this.secrets[secretName] = secret;
        return this;
    }

    get(secret: string, newValue?: boolean): boolean {
        if (!this.secrets.hasOwnProperty(secret)) {
            throw new Error(`Unknown flag: ${secret}`);
        }

        const value: boolean = this.secrets[secret].value;

        if (typeof newValue === 'boolean') {
            this.secrets[secret].value = newValue;
        }

        return value;
    }

    reset() {
        for (const secretName in this.secrets) {
            const secret: Secret = this.secrets[secretName];
            if (secret.transient) {
                secret.value = secret.defaultValue;
            }
        }
    }
}

export interface SecretsData {
    [ secret: string ]: Secret;
}

export interface Secret {
    value: boolean;
    transient?: boolean;
    defaultValue: boolean;
}
