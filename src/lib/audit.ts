import { db } from "./db"

interface LogParams {
  tenantId: string
  userId: string
  action: string
  entity: string
  entityId?: string
  oldValue?: any
  newValue?: any
  notes?: string
  ipAddress?: string
}

export async function recordActivity({
  tenantId,
  userId,
  action,
  entity,
  entityId,
  oldValue,
  newValue,
  notes,
  ipAddress
}: LogParams) {
  try {
    return await db.activityLog.create({
      data: {
        tenantId,
        userId,
        action,
        entity,
        entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        notes,
        ipAddress
      }
    })
  } catch (error) {
    console.error("❌ Failed to record activity log:", error)
    // We don't throw error here to avoid breaking the main operation
    // if logging fails for some reason
    return null
  }
}
