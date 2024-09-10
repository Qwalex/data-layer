import { Card, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'

export const DataLayerItem = () => {
  return <Card title="sdfsdf" bordered  actions={[
    <EditOutlined key="edit" />,
  ]}><Input.TextArea autoSize /></Card>
}
