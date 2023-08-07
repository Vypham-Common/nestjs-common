export function calculatePercent<T = any>(input: T[], key: RecursiveKeyOf<T>) {
  let total = 0
  input.forEach((value: any) => {
    let recursValue: any = null
    key.split('.').forEach(k => {
      recursValue = value[k]
    })
    total += recursValue
  })
  const output = input.map((value: any) => {
    let recursValue: any = null
    key.split('.').forEach(k => {
      recursValue = value[k]
    })

    return {
      ...value,
      percent: recursValue / total * 100
    }
  })

  return output
}
