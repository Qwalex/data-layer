import { FC } from 'react'
import { prisma } from '@shared/lib'
import { TDataLayersManager } from './types'

export const DataLayerManager: FC<TDataLayersManager> = ({ dataLayers, onSaveClick, onSelectDataLayer }) => {
  const handleClick = (id: number) => {
    console.log(`get ${id}`)
  }

  return (
    <>
      {dataLayers.map((dataLayerItem) => (
        <li key={dataLayerItem.id} onClick={() => handleClick(dataLayerItem.id)}>{JSON.stringify(dataLayerItem)}</li>
      ))}
    </>
  )
}