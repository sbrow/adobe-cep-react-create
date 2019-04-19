import { Session } from "../../session/Session";

declare global {
    interface Window {
        session: Session
    }
}