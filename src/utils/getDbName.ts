export function getDbName(tenant?: string) {
  return `${global.GlobalConfig.MONGODB_NAME}${tenant ? `_${tenant}` : ''}`
}
