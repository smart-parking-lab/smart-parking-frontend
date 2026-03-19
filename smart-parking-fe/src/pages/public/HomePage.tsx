import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Badge, Statistic } from 'antd';
import { CarOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);

  // 1. Mock Data: Giả lập 10 ô đỗ xe chia làm 2 khu A và B
  const fetchMockSlots = () => {
    setLoading(true);
    setTimeout(() => {
      setSlots([
        { id: '1', slot_code: 'A01', status: 'available', zone: 'A' },
        { id: '2', slot_code: 'A02', status: 'occupied', zone: 'A' },
        { id: '3', slot_code: 'A03', status: 'available', zone: 'A' },
        { id: '4', slot_code: 'A04', status: 'maintenance', zone: 'A' },
        { id: '5', slot_code: 'A05', status: 'occupied', zone: 'A' },
        { id: '6', slot_code: 'B01', status: 'available', zone: 'B' },
        { id: '7', slot_code: 'B02', status: 'available', zone: 'B' },
        { id: '8', slot_code: 'B03', status: 'occupied', zone: 'B' },
        { id: '9', slot_code: 'B04', status: 'available', zone: 'B' },
        { id: '10', slot_code: 'B05', status: 'available', zone: 'B' },
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchMockSlots();
  }, []);

  // Tính toán số lượng chỗ trống
  const availableCount = slots.filter(s => s.status === 'available').length;
  const totalCount = slots.length;

  // Hàm render giao diện từng ô đỗ xe
  const renderSlot = (slot: any) => {
    let bgColor = '#f5f5f5'; // Mặc định là xám (Bảo trì)
    let borderColor = '#d9d9d9';
    let textColor = '#000';
    let icon = null;

    if (slot.status === 'available') {
      bgColor = '#f6ffed'; // Xanh nhạt
      borderColor = '#b7eb8f'; // Viền xanh lá
      textColor = '#389e0d';
      icon = <CheckCircleOutlined />;
    } else if (slot.status === 'occupied') {
      bgColor = '#fff1f0'; // Đỏ nhạt
      borderColor = '#ffa39e'; // Viền đỏ
      textColor = '#cf1322';
      icon = <CarOutlined />;
    }

    return (
      <Col span={4} key={slot.id} xs={12} sm={8} md={6} lg={4}>
        <div 
          style={{
            background: bgColor,
            border: `2px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '20px 0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.3s'
          }}
        >
          <Title level={4} style={{ margin: 0, color: textColor }}>
            {slot.slot_code}
          </Title>
          <div style={{ fontSize: '24px', color: textColor, marginTop: '8px' }}>
            {icon}
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div className="space-y-8">
      {/* Phần 1: Thống kê tổng quan */}
      <Row gutter={16} justify="center">
        <Col xs={24} md={8}>
          <Card bordered={false} className="shadow-md text-center" style={{ borderRadius: '12px' }}>
            <Statistic
              title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>SỐ CHỖ TRỐNG HIỆN TẠI</span>}
              value={availableCount}
              suffix={`/ ${totalCount}`}
              valueStyle={{ color: '#3f8600', fontSize: '48px', fontWeight: '900' }}
            />
            <Text type="secondary">Cập nhật theo thời gian thực</Text>
          </Card>
        </Col>
      </Row>

      {/* Phần 2: Sơ đồ Khu vực A */}
      <Card title="📍 Khu Vực A" className="shadow-sm" headStyle={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
        <Row gutter={[16, 16]}>
          {slots.filter(s => s.zone === 'A').map(renderSlot)}
        </Row>
      </Card>

      {/* Phần 3: Sơ đồ Khu vực B */}
      <Card title="📍 Khu Vực B" className="shadow-sm" headStyle={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
        <Row gutter={[16, 16]}>
          {slots.filter(s => s.zone === 'B').map(renderSlot)}
        </Row>
      </Card>

      {/* Chú thích */}
      <div className="flex justify-center gap-6 mt-4">
        <Badge color="green" text={<Text strong>Trống</Text>} />
        <Badge color="red" text={<Text strong>Có xe</Text>} />
        <Badge color="default" text={<Text strong>Bảo trì</Text>} />
      </div>
    </div>
  );
};

export default HomePage;