import { Parser, ParserOptions } from '@json2csv/plainjs'

export const csvParser = (opts: ParserOptions) => {
  const parser = new Parser(opts)
  return (data: any[]) => {
    return parser.parse(data)
  }
}
