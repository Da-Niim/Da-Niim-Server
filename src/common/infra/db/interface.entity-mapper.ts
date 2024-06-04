export interface BaseEntityMapper<DB, D> {
  toDBEntity(domain: D): DB
  toDomainEntity(dbEntity: DB): D
}
