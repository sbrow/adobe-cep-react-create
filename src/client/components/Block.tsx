import React from "react";
import { useContext } from "react";
import { StoreContext } from "../Stores/AppStore";
import { Dropdown } from "./Dropdown";
import NumberInput from "./NumberInput";

interface BlockProps {
    id: number;
}

export function Block(props: BlockProps) {
    const state = useContext(StoreContext)[0];
    const id = `blocks-${props.id}`;
    const exercises: string[] = state.get(`${id}-exercises`).filter((element: string): boolean => {
        return element !== "";
    });
    exercises.push("");

    return (<React.Fragment key={id}>
        <h3>Block #{props.id}</h3>
        <NumberInput id={`${id}-rounds`} label="# of rounds" min={1} max={8} />
        <Dropdown id={`${id}-intro`} label="Intro" options="availableVideos" allowEmpty={true} allowImport={true} />
        {exercises.map((_: string, i: number) => {
            return (<Dropdown
                id={`${id}-exercises-${i + 1}`}
                label={`Exercise #${i + 1}`}
                options="availableVideos"
                allowEmpty={true}
                allowImport={true}
            />);
        })}
    </React.Fragment>);
}
