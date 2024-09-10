import { TDataLayerItem } from '@shared/types'

export type TDataLayersManager = {
  dataLayers: TDataLayerItem[]
  onSelectDataLayer?: (dataLayerItem: TDataLayerItem) => void
  onSaveClick?: (props: Pick<TDataLayerItem, 'name' | 'task'>) => Promise<TDataLayerItem>
}