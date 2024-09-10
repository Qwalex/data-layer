import { INITIAL_DATA_LAYER_OBJECT_BANK, INITIAL_DATA_LAYER_OBJECT_DENGI } from '@shared/config'
import { EProjects } from '@shared/types'
import { stringifyObjectValues } from './stringifyObjectValues'

type TGetInitialDataLayer = { stringify?: boolean; project?: EProjects } 

export const getInitialDataLayer = ({ stringify = false, project = EProjects.BANK }: TGetInitialDataLayer = {}) => {
  const getObject = () => {
    if (project === EProjects.BANK) {
      return INITIAL_DATA_LAYER_OBJECT_BANK
    }
  
    return INITIAL_DATA_LAYER_OBJECT_DENGI
  }

  return stringify ? stringifyObjectValues(getObject()) : getObject()
}