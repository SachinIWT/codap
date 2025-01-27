import { Active, useDroppable } from "@dnd-kit/core"
import React, { CSSProperties, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { IMoveAttributeOptions } from "../../models/data/data-set"
import { useDataSetContext } from "../../hooks/use-data-set-context"
import { useInstanceIdContext } from "../../hooks/use-instance-id-context"
import { kIndexColumnKey } from "./case-table-types"

interface IProps {
  columnKey: string
  cellElt: HTMLElement | null
}
export const ColumnHeaderDivider = ({ columnKey, cellElt }: IProps) => {
  const instanceId = useInstanceIdContext()
  const data = useDataSetContext()
  const [tableElt, setTableElt] = useState<HTMLElement | null>(null)
  const tableBounds = tableElt?.getBoundingClientRect()
  const cellBounds = cellElt?.getBoundingClientRect()

  const handleDrop = (active: Active) => {
    const dragAttrId = active.data?.current?.attributeId
    const options: IMoveAttributeOptions = columnKey === kIndexColumnKey
                                            ? { before: data?.attributes[0].id }
                                            : { after: columnKey }
    dragAttrId && data?.moveAttribute(dragAttrId, options)
  }

  const dropData: any = { accepts: ["attribute"], onDrop: handleDrop }
  const id = `${instanceId}-attribute:${columnKey}-drop`
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id, data: dropData })

  // find the `case-table` DOM element; divider must be drawn relative
  // to the `case-table` (via React portal) so it isn't clipped by the cell
  useEffect(() => {
    if (cellElt && !tableElt) {
      let parent: HTMLElement | null
      for (parent = cellElt; parent; parent = parent.parentElement) {
        if (parent.classList.contains("case-table")) {
          setTableElt(parent)
          break
        }
      }
    }
  }, [cellElt, tableElt])

  // compute the divider position relative to the `case-table` element
  const kDividerWidth = 7
  const kDividerOffset = Math.floor(kDividerWidth / 2)
  const style: CSSProperties = tableBounds && cellBounds
                  ? {
                      top: cellBounds.top - tableBounds.top,
                      height: cellBounds.height,
                      left: cellBounds.right - tableBounds.left - kDividerOffset - 1,
                      width: kDividerWidth
                    }
                  : {}

  return tableElt && tableBounds && cellBounds && (cellBounds?.right < tableBounds?.right)
          ? createPortal((
              <div ref={setDropRef} className={`codap-column-header-divider ${isOver ? "over" : ""}`} style={style}/>
            ), tableElt)
          : null
}
