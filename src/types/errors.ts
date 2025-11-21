import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

export const EntityNotFoundError = new Error("entidad no encontrada");
export const ApiNotForPasswordChange = new Error("API no apta para cambiar contrasena");
export const IncorrectPasswordError = new Error("Contrasena incorrecta");
@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const client = host.switchToWs().getClient<Socket>();
        if(exception instanceof WsException) {
            client.emit("error", {
                error: exception.getError(),
                message: exception.message
            });
        } else if(exception instanceof Error) {
            client.emit("error", {
                error: "Internal server error",
                message: exception.message
            });
        } else {
            client.emit("error", {
                error: "Unknown error",
                message: "Error desconocido"
            });
        }
    }
};