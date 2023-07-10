"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const io_1 = require("src/services/socket/io");
const main_controller_1 = require("./main.controller");
class TaskController {
    static upsertTask = async ({ user, task, filter, }) => {
        try {
            const upsertedTask = await main_controller_1.prisma.task.upsert({
                where: {
                    ...filter,
                    ...(task.task_id
                        ? { task_id: task.task_id }
                        : {
                            company_id_title: {
                                company_id: user.company_id,
                                title: task.title,
                            },
                        }),
                },
                create: {
                    ...Object.fromEntries(Object.entries(task).filter(([key]) => key !== "company_id" && key !== "task_id" && key !== "company")),
                    status: task.status || client_1.TaskStatus.RUNNING,
                    title: task.title || "Untitled",
                    description: task.description || "",
                    company_id: user.company_id,
                },
                update: {
                    ...Object.fromEntries(Object.entries(task).filter(([key]) => key !== "company_id" && key !== "task_id" && key !== "company")),
                },
            });
            if (!upsertedTask)
                return;
            io_1.io.to(user.company_id).emit("task", upsertedTask);
            return upsertedTask;
        }
        catch (error) {
            return;
        }
    };
}
exports.default = TaskController;
//# sourceMappingURL=tasks.controller.js.map