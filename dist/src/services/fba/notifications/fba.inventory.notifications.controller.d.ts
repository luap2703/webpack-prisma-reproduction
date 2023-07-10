import { FBAInventoryAvailabilityChangeNotification } from "./types/src";
export default class FbaInventoryNotificationsController {
    static updateInventory: (data: FBAInventoryAvailabilityChangeNotification) => Promise<void>;
    static updateReports: (user: {
        company_id: string;
    }) => Promise<void>;
}
