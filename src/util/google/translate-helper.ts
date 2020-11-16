import { Translate } from "@google-cloud/translate/build/src/v2";

export class GoogleTranslateHelper {
    private client: Translate;

    constructor(projectiId: string) {
        this.client = new Translate({
            projectId: projectiId,
        });
    }

    public async translate(text: string, lang: string): Promise<string> {
        const [response] = await this.client.translate(text, lang);
        return response;
    }
}
