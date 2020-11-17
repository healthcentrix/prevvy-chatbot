import { RedisClient } from "redis";

export class RedisHelper {
    private client: RedisClient;

    constructor(
        host: string,
        port: number = 6379,
        password: string = undefined,
        tls: boolean = false
    ) {
        this.client = new RedisClient({
            host: host,
            port: port,
            password: password,
            tls: tls,
        });
    }

    public async setString(
        key: string,
        value: string,
        expiration: number = undefined
    ): Promise<void> {
        const setStringPromise = () => {
            return new Promise((resolve, reject) => {
                if (expiration) {
                    this.client.set(
                        key,
                        value,
                        "ex",
                        expiration,
                        (err, data) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve(data);
                        }
                    );
                } else {
                    this.client.set(key, value, (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(data);
                    });
                }
            });
        };

        await setStringPromise();
    }

    public async getString(key: string): Promise<string> {
        const getStringPromise = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                this.client.get(key, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });
        };

        const response = await getStringPromise();
        return response;
    }

    public async removeKey(key: string): Promise<void> {
        const removeKeyPromise = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                this.client.del(key, (err) => {
                    if (err) {
                        return reject(err);
                    }
                });
            });
        };

        await removeKeyPromise();
    }
}
