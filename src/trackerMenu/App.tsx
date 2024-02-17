import { useEffect, useState } from "react";
import { useOwlbearStore } from "../../useOwlbearStore";
import { useOwlbearStoreSync } from "../../useOwlbearStoreSync";
import "../index.css";
import BubbleInput from "../components/BubbleInput";
import IconButton from "../components/IconButton";
import AddIcon from "../icons/AddIcon";
import AddSquareIcon from "../icons/AddSquareIcon";
import EditIcon from "../icons/EditIcon";
import VisibleIcon from "../icons/VisibleIcon";
import NotVisibleIcon from "../icons/NotVisibleIcon";
import BarInput from "../components/BarInput";
import {
  Tracker,
  TrackerVariant,
  getMetadataFromItems,
  writeTrackersHiddenToItem,
  writeTrackersToItem,
} from "../itemHelpers";
import OBR from "@owlbear-rodeo/sdk";
import { getPluginId } from "../getPluginId";
// import "./temp.css";

const randomColor = () => {
  return Math.floor(Math.random() * 6);
};

const createId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export default function App({
  initialMode,
  initialTrackers,
  initialHidden,
}: {
  initialMode: "DARK" | "LIGHT";
  initialTrackers: Tracker[];
  initialHidden: boolean;
}): JSX.Element {
  useOwlbearStoreSync();
  // Prevent flash on startup
  const setMode = useOwlbearStore((state) => state.setMode);
  useEffect(() => setMode(initialMode));
  const role = useOwlbearStore((state) => state.role);

  const mode = useOwlbearStore((state) => state.mode);

  const [trackersHidden, setTrackersHidden] = useState(initialHidden);
  const toggleHidden = () => {
    setTrackersHidden((prev) => {
      const value = !prev;
      writeTrackersHiddenToItem(value);
      return value;
    });
  };

  const [trackers, setTrackers] = useState<Tracker[]>(initialTrackers);
  const updateTrackers = (
    updateFunction: (prevTrackers: Tracker[]) => void,
  ) => {
    setTrackers((prev) => {
      const draftTrackers = [...prev];
      updateFunction(draftTrackers);
      const sortedTrackers = draftTrackers
        .filter((value) => value.variant === "value")
        .sort((a, b) => a.position - b.position);
      sortedTrackers.push(
        ...draftTrackers
          .filter((value) => value.variant === "value-max")
          .sort((a, b) => a.position - b.position),
      );
      writeTrackersToItem(sortedTrackers);
      return sortedTrackers;
    });
  };

  useEffect(
    () =>
      OBR.scene.items.onChange((items) =>
        getMetadataFromItems(items).then(([newTracker, newTrackersHidden]) => {
          setTrackers(newTracker);
          setTrackersHidden(newTrackersHidden);
        }),
      ),
    [],
  );

  let occupiedSpaces = -1;
  const checkOccupiedSpaces = () => {
    if (occupiedSpaces !== -1) return occupiedSpaces;
    let spaces = 0;
    for (const tracker of trackers) {
      if (tracker.variant === "value") {
        spaces += 1;
      } else {
        spaces += 2;
      }
    }
    occupiedSpaces = spaces;
    return spaces;
  };

  const createPosition = (variant: TrackerVariant) => {
    return trackers.filter((tracker) => tracker.variant === variant).length;
  };

  const createBubble = (): Tracker => {
    return {
      id: createId(),
      name: "",
      variant: "value",
      position: createPosition("value"),
      color: randomColor(),
      value: 0,
    };
  };

  const createBar = (): Tracker => {
    return {
      id: createId(),
      name: "",
      variant: "value-max",
      position: createPosition("value-max"),
      color: randomColor(),
      value: 0,
      max: 0,
    };
  };

  const addTrackerBubble = () => {
    if (checkOccupiedSpaces() < 8) {
      updateTrackers((prev) => prev.push(createBubble()));
    }
  };
  const addTrackerBar = () => {
    if (checkOccupiedSpaces() < 7) {
      updateTrackers((prev) => prev.push(createBar()));
    }
  };

  const updateTrackerField = (
    id: string,
    field: "value" | "max" | "name" | "color",
    content: string | number,
  ) => {
    if ((field === "value" || field === "max") && typeof content === "string") {
      content = Math.trunc(parseFloat(content));
      if (isNaN(content)) content = 0;
    }
    updateTrackers((prevTrackers) => {
      const index = prevTrackers.findIndex((item) => item.id === id);
      prevTrackers.splice(index, 1, {
        ...prevTrackers[index],
        [field]: content,
      });
    });
  };

  const generateInput = (tracker: Tracker): JSX.Element => {
    if (tracker.variant === "value") {
      return (
        <BubbleInput
          key={tracker.id}
          valueControl={tracker.value}
          color={tracker.color}
          inputProps={{
            // value: tracker.value,
            // onChange: (e) =>
            //   handleInputChange(tracker.id, "value", e.target.value),
            onBlur: (e) =>
              updateTrackerField(tracker.id, "value", e.target.value),
          }}
        ></BubbleInput>
      );
    }
    return (
      <BarInput
        key={tracker.id}
        valueControl={tracker.value}
        maxControl={tracker.max}
        color={tracker.color}
        valueInputProps={{
          onBlur: (e) =>
            updateTrackerField(tracker.id, "value", e.target.value),
        }}
        maxInputProps={{
          onBlur: (e) => updateTrackerField(tracker.id, "max", e.target.value),
        }}
      ></BarInput>
    );
  };

  return (
    // <button className="box"></button>
    <div className={mode === "DARK" ? "dark" : ""}>
      <div
        className={`flex flex-col gap-2 ${checkOccupiedSpaces() % 4 === 1 ? "px-8" : "px-4"} py-1`}
      >
        <div className="flex flex-row justify-center self-center rounded-full bg-black/25">
          <IconButton Icon={AddIcon} onClick={addTrackerBubble}></IconButton>
          <IconButton Icon={AddSquareIcon} onClick={addTrackerBar}></IconButton>
          {role === "GM" && (
            <IconButton
              Icon={trackersHidden ? NotVisibleIcon : VisibleIcon}
              onClick={toggleHidden}
            ></IconButton>
          )}
          <IconButton
            Icon={EditIcon}
            onClick={() => {
              OBR.popover.open({
                id: getPluginId("editor"),
                url: "/src/editor/editor.html",
                height: 600,
                width: 450,
              });
            }}
          ></IconButton>
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 rounded-xl bg-white/0">
          {trackers.map((tracker) => generateInput(tracker))}
        </div>
      </div>
    </div>
  );
}
