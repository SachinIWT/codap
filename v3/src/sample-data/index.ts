import { IDataSet } from "../models/data/data-set"
import { convertParsedCsvToDataSet, CsvParseResult, downloadCsvFile } from "../utilities/csv-import"
import abaloneCsv from "./abalone.csv"
import catsCsv from "./cats.csv"
import coastersCsv from "./roller-coasters.csv"
import mammalsCsv from "./mammals.csv"
import fourCsv from "./four.csv"

export const sampleData = ["abalone", "cats", "coasters", "mammals", "four"] as const
export type SampleType = typeof sampleData[number]

const sampleMap: Record<SampleType, string> = {
  abalone: abaloneCsv,
  cats: catsCsv,
  coasters: coastersCsv,
  four: fourCsv,
  mammals: mammalsCsv
}

export function importSample(sample: SampleType, onImportDataSet: (data: IDataSet) => void) {
  const dataUrl = sampleMap[sample]
  downloadCsvFile(dataUrl, (results: CsvParseResult) => {
    const ds = convertParsedCsvToDataSet(results, sample)
    ds && onImportDataSet(ds)
  })
}
