import { Spin } from 'antd';

export default () => (
  <div
    style={{
      minHeight: 650,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Spin size="large" />
  </div>
);
