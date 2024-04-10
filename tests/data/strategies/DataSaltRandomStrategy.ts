import { StrategySaltInterface } from '@tests/data/types'

export class DataSaltRandomStrategy implements StrategySaltInterface {
  public execute() {
    return Math.round(Math.random() * 10000) + ''
  }
}
