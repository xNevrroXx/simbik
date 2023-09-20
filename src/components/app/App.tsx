import {useEffect, useRef} from "react";
import dataJson from "../../data.json";
// modules
import otherTasks from "../../otherTasks.ts";
import Select from "../select/Select.tsx";
// types
import {TAnimal} from "../../models/IAnimals.ts";
// styles
import "./app.scss";

const data = dataJson as TAnimal[];

function App() {
    const isOnceUseEffectRef = useRef<boolean>(false);

    useEffect(() => {
        if (isOnceUseEffectRef.current) {
            return;
        }

        otherTasks();
        isOnceUseEffectRef.current = true;
    }, [])

  return (
      <div className="app">
        <Select
            label="Name"
            options={data.map(el => el.name)}
        />
      </div>
  )
}

export default App
