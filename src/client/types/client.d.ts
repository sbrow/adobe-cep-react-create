import { Session } from "../../session/session";

declare global {
    interface Window {
        session: Session
    }
}