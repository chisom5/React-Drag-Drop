import React from "react";
import { Box } from "@mui/material";
import { useDrop, useDragDropManager } from "react-dnd";

import Grid from "./Grid";
import Module from "./Module";
import { GUTTER_SIZE } from "../constants";
import ModuleInterface from "../types/ModuleInterface";
import update from "immutability-helper";
import { moduleY2LocalY, moduleX2LocalX } from "../helpers";

const Page = () => {
  const [modules, setModules] = React.useState([
    { id: 1, coord: { x: 1, y: 80, w: 2, h: 200 } },
    { id: 2, coord: { x: 5, y: 0, w: 3, h: 100 } },
    { id: 3, coord: { x: 4, y: 310, w: 3, h: 200 } },
  ]);

  const containerRef = React.useRef<HTMLDivElement>();

  // I added this
  const dndManager = useDragDropManager();
  const monitor = dndManager.getMonitor();

  const findCard = React.useCallback(
    (id: number) => {
      const module = modules.filter((c) => c.id === id)[0];
      return {
        module,
        index: modules.indexOf(module),
      };
    },
    [modules]
  );

  const moveBox = React.useCallback(
    (index: number, left: number, top: number) => {
      setModules(
        update(modules, {
          [index]: {
            coord: {
              $merge: { x: left, y: top },
            },
          },
        })
      );
    },
    [modules]
  );

  // down to here

  // Wire the module to DnD drag system
  const [{ canDrop, isOverCurrent }, drop] = useDrop({
    accept: "module",

    canDrop: () => true,

    hover: (item: {
      id: number;
      originalIndex: number;
      left: number;
      top: number;
    }) => {
      if (!containerRef.current) {
        return;
      }
      let boundingRect = containerRef.current.getBoundingClientRect();

      // LocalY2moduleY(boundingRect.height)
      let y = moduleY2LocalY(item.top);
      let x = moduleX2LocalX(item.left);

      const dragId = item.id;
      console.log(y, x, monitor.getClientOffset(), "ewkmon");
      // Don't replace items with themselves
      // if (dragId  === hoverIndex) {
      //   return;
      // }
      // console.log(dragId , hoverIndex, "nnnn");
      // If it is dragged around other module, then move the module and set the state with position changes
      moveBox(item.originalIndex, item.left, y);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  drop(containerRef);

  // Calculate container height
  const containerHeight = React.useMemo(
    () =>
      Math.max(...modules.map(({ coord: { y, h } }) => y + h)) +
      GUTTER_SIZE * 2,
    [modules]
  );

  return (
    <Box
      ref={containerRef}
      position="relative"
      width={1024}
      height={containerHeight}
      margin="auto"
      sx={{
        overflow: "hidden",
        outline: "1px dashed #ccc",
        transition: "height 0.2s",
      }}
    >
      <Grid height={containerHeight} />
      {modules.map((module, i) => (
        <Module key={module.id} data={module} index ={i} findCard={findCard} />
      ))}
    </Box>
  );
};

export default React.memo(Page);
