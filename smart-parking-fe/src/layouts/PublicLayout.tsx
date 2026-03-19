import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const PublicLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Thanh Header của khách */}
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#1677ff', /* Màu xanh chủ đạo */
        padding: '0 50px' 
      }}>
        <CarOutlined style={{ fontSize: '24px', color: 'white', marginRight: '12px' }} />
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Hệ Thống Bãi Đỗ Xe Thông Minh
        </Title>
      </Header>

      {/* Khu vực hiển thị sơ đồ (Outlet) */}
      <Content style={{ padding: '24px 50px', background: '#f5f5f5' }}>
        <div style={{ 
          background: '#fff', 
          padding: 24, 
          minHeight: '75vh', 
          borderRadius: 8 
        }}>
          <Outlet />
        </div>
      </Content>

      {/* Chân trang */}
      <Footer style={{ textAlign: 'center', color: '#888' }}>
        PTIT Smart Parking ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default PublicLayout;