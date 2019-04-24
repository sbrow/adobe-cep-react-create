import React from "react";
import { useReducer } from "react";
import { AppStore, reducer, StoreContext } from "../Stores/AppStore";

export function AppStoreProvider({ children }: { children: any; }): JSX.Element {
    const [state, dispatch] = useReducer(reducer, new AppStore());
    return (<StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>);
}
