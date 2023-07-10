import { Prisma, TaskStatus } from "@prisma/client";
export default class TaskController {
    static upsertTask: ({ user, task, filter, }: {
        user: {
            company_id: string;
        };
        task: Partial<Prisma.TaskCreateInput>;
        filter?: Partial<Prisma.TaskWhereUniqueInput> | undefined;
    }) => Promise<(import("@prisma/client/runtime").GetResult<{
        task_id: string;
        company_id: string;
        status: TaskStatus;
        title: string;
        description: string;
        try: number;
        created_at: Date;
        updated_at: Date;
    }, {
        [x: string]: () => unknown;
    }, never> & {}) | undefined>;
}
