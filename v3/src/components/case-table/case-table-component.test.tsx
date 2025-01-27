import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import React from "react"
import { DataBroker } from "../../models/data/data-broker"
import { DataSet, toCanonical } from "../../models/data/data-set"
import { useKeyStates } from "../../hooks/use-key-states"
import { CaseTableComponent } from "./case-table-component"

jest.mock("./case-table-shared.scss", () => ({
  headerRowHeight: "30",
  bodyRowHeight: "18"
}))

// used by case table
jest.mock("../../hooks/use-measure-text", () => ({
  measureText: (text: string) => text.length * 6
}))

const UseKeyStatesWrapper = () => {
  useKeyStates()
  return null
}

describe("Case Table", () => {
  let broker: DataBroker
  beforeEach(() => {
    broker = new DataBroker()
  })

  it("renders nothing with no broker", () => {
    render(<CaseTableComponent />)
    expect(screen.queryByTestId("case-table")).not.toBeInTheDocument()
  })

  it("renders nothing with empty broker", () => {
    render(<CaseTableComponent broker={broker} />)
    expect(screen.queryByTestId("case-table")).not.toBeInTheDocument()
  })

  it("renders table with data", () => {
    const data = DataSet.create()
    data.addAttribute({ name: "a"} )
    data.addAttribute({ name: "b" })
    data.addCases(toCanonical(data, [{ a: 1, b: 2 }, { a: 3, b: 4 }]))
    broker.addDataSet(data)
    render(<CaseTableComponent broker={broker} />)
    expect(screen.getByTestId("case-table")).toBeInTheDocument()
  })

  it("selects rows when index cell is clicked", async () => {
    const user = userEvent.setup()
    const data = DataSet.create()
    data.addAttribute({ name: "a"} )
    data.addAttribute({ name: "b" })
    data.addCases(toCanonical(data, [{ a: 1, b: 2 }, { a: 3, b: 4 }]))
    broker.addDataSet(data)
    const { rerender } = render((
      <>
        <UseKeyStatesWrapper/>
        <CaseTableComponent broker={broker} />
      </>
    ))
    expect(screen.getByTestId("case-table")).toBeInTheDocument()
    const indexCells = screen.getAllByRole("rowheader")
    expect(indexCells.length).toBe(2)
    const indexContents = screen.getAllByTestId("codap-index-content-button")
    expect(indexContents.length).toBe(2)
    expect(data.selection.size).toBe(0)
    await user.click(indexContents[0])
    rerender((
      <>
        <UseKeyStatesWrapper/>
        <CaseTableComponent broker={broker} />
      </>
    ))
    expect(data.selection.size).toBe(1)
    await user.keyboard('[ShiftLeft>]') // Press Shift (without releasing it)
    await user.click(indexContents[1])
    expect(data.selection.size).toBe(2)
  })
})
