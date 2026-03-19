import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, Row, Col, Statistic, DatePicker } from 'antd';
import { DollarOutlined, CarOutlined, CreditCardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RevenuePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);

  // 1. Mock Data: Giả lập dữ liệu hóa đơn từ bảng invoices
  const fetchMockInvoices = () => {
    setLoading(true);
    setTimeout(() => {
      setInvoices([
        {
          id: 'INV-001',
          plate_number: '59A-123.45', // Thực tế sẽ JOIN từ bảng parking_sessions
          duration_minutes: 120,
          amount: 15000,
          payment_method: 'vnpay', // tiền mặt, vnpay, momo
          status: 'paid',
          paid_at: '2026-03-16T10:05:00Z',
        },
        {
          id: 'INV-002',
          plate_number: '30F-999.99',
          duration_minutes: 800, // Đỗ qua đêm
          amount: 50000,
          payment_method: 'cash',
          status: 'paid',
          paid_at: '2026-03-16T07:20:00Z',
        },
        {
          id: 'INV-003',
          plate_number: '43C-567.89',
          duration_minutes: 45,
          amount: 5000,
          payment_method: 'momo',
          status: 'paid',
          paid_at: '2026-03-16T11:30:00Z',
        }
      ]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchMockInvoices();
  }, []);

 // Lọc hóa đơn dựa trên khoảng thời gian được chọn
  const filteredInvoices = invoices.filter((inv) => {
    // Nếu chưa chọn ngày (dateRange là null) thì hiển thị tất cả
    if (!dateRange || !dateRange[0] || !dateRange[1]) return true;

    const paidDate = dayjs(inv.paid_at);
    const startDate = dateRange[0].startOf('day');
    const endDate = dateRange[1].endOf('day');

    // Kiểm tra xem paid_at có nằm giữa startDate và endDate không
    return paidDate.isAfter(startDate) && paidDate.isBefore(endDate);
  });

  // Đổi lại biến tính toán dựa trên filteredInvoices thay vì invoices gốc
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalInvoices = filteredInvoices.length;

  // Hàm format tiền Việt Nam (VNĐ)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // 3. Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã Hóa Đơn',
      dataIndex: 'id',
      key: 'id',
      fontWeight: 'bold',
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: 'Biển Số',
      dataIndex: 'plate_number',
      key: 'plate_number',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Thời Gian Đỗ (Phút)',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      align: 'right' as const,
      render: (mins: number) => `${mins} phút`,
    },
    {
      title: 'Số Tiền Thu',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number) => <strong className="text-green-600">{formatCurrency(amount)}</strong>,
    },
    {
      title: 'Phương Thức',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => {
        if (method === 'vnpay') return <Tag color="blue">VNPay</Tag>;
        if (method === 'momo') return <Tag color="magenta">MoMo</Tag>;
        return <Tag color="green">Tiền Mặt</Tag>;
      },
    },
    {
      title: 'Giờ Thanh Toán',
      dataIndex: 'paid_at',
      key: 'paid_at',
      render: (time: string) => new Date(time).toLocaleString('vi-VN'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} style={{ margin: 0 }}>Thống kê Doanh thu</Title>
        {/* Bộ lọc ngày tháng (Tạm thời chỉ làm giao diện) */}
        <RangePicker format="DD/MM/YYYY" onChange={(dates) => setDateRange(dates)} allowClear />
      </div>

      {/* Hàng thẻ thống kê (Summary Cards) */}
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Tổng Doanh Thu (Hôm nay)"
              value={totalRevenue}
              formatter={(val) => formatCurrency(Number(val))}
              prefix={<DollarOutlined className="text-green-500" />}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Số Lượt Giao Dịch"
              value={totalInvoices}
              prefix={<CarOutlined className="text-blue-500" />}
              suffix="lượt"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="Thanh Toán Online"
              value={filteredInvoices.filter(i => i.payment_method !== 'cash').length}
              prefix={<CreditCardOutlined className="text-purple-500" />}
              suffix={`/ ${totalInvoices}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng chi tiết hóa đơn */}
      <Card className="shadow-sm border-gray-200 mt-6" title="Danh sách hóa đơn gần đây" bodyStyle={{ padding: 0 }}>
        <Table 
          columns={columns} 
          dataSource={filteredInvoices} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default RevenuePage;