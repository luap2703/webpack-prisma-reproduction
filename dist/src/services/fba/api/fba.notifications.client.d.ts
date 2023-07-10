import { AmazonNotificationType, ApiProvider } from "@prisma/client";
export default class FbaNotificationsController {
    static setupNotifications: ({ user, notificationType, }: {
        user: {
            company_id: string;
        };
        notificationType: AmazonNotificationType;
    }) => Promise<import("@prisma/client/runtime").GetResult<{
        subscriptionId: string;
        notificationType: AmazonNotificationType;
        destinationId: string;
        company_id: string;
        api_provider: ApiProvider;
        created_at: Date;
        updated_at: Date;
    }, {
        [x: string]: () => unknown;
    }, never> & {}>;
}
