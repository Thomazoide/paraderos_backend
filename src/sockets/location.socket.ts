import { UseFilters } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { User } from "src/entities/user.entity";
import { UserService } from "src/services/user.service";
import { WebSocketExceptionFilter } from "src/types/errors";
import { ResponsePayload, UpdatePositionPayload } from "src/types/types";

@WebSocketGateway({namespace: "/gps"})
@UseFilters(WebSocketExceptionFilter)
export class GpsSocket {
    @WebSocketServer()
    server: Server;
    constructor(
        private readonly service: UserService
    ){};

    @SubscribeMessage("actualizar-gps")
    async UpdatePosition(
        @MessageBody()
        payload: UpdatePositionPayload
    ): Promise<ResponsePayload<User>> {
        try {
            const response: ResponsePayload<User> = {
                message: "Posición actualizada",
                data: await this.service.UpdatePosition(payload),
                error: false
            };
            this.server.emit("actualizado", response);
            return response;
        } catch (err) {
            const response: ResponsePayload<User> = {
                message: (err as Error).message,
                error: true
            };
            this.server.emit("server-error", response);
            return response;
        }
    };
};