import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Input, Card, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SessionsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');

  // 1. Tạo Mock Data bám sát bảng parking_sessions
  const fetchMockSessions = () => {
    setLoading(true);
    setTimeout(() => {
      setSessions([
        {
          id: '1',
          plate_number: '59A-123.45',
          entry_time: '2026-03-16T08:30:00Z',
          exit_time: null,
          status: 'active', // Đang đỗ
          entry_image_url: 'https://placehold.co/200x100/1677ff/white?text=59A-123.45_IN',
          exit_image_url: null,
        },
        {
          id: '2',
          plate_number: '30F-999.99',
          entry_time: '2026-03-15T18:00:00Z',
          exit_time: '2026-03-16T07:15:00Z',
          status: 'completed', // Đã rời đi
          entry_image_url: 'https://placehold.co/200x100/4CAF50/white?text=30F-999.99_IN',
          exit_image_url: 'https://placehold.co/200x100/f44336/white?text=30F-999.99_OUT',
        },
        {
          id: '3',
          plate_number: '43C-567.89',
          entry_time: '2026-03-16T09:00:00Z',
          exit_time: null,
          status: 'active',
          entry_image_url: 'https://placehold.co/200x100/1677ff/white?text=43C-567.89_IN',
          exit_image_url: null,
        }
      ]);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchMockSessions();
  }, []);

  // Hàm format thời gian cho đẹp (VD: 16/03/2026, 08:30)
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return <span className="text-gray-400">Chưa có</span>;
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // 2. Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Biển Số',
      dataIndex: 'plate_number',
      key: 'plate_number',
      fontWeight: 'bold',
      render: (text: string) => <strong className="text-lg text-blue-800">{text}</strong>,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'processing' : 'default'} className="uppercase">
          {status === 'active' ? 'Đang đỗ' : 'Đã rời đi'}
        </Tag>
      ),
    },
    {
      title: 'Giờ Vào',
      dataIndex: 'entry_time',
      key: 'entry_time',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: 'Ảnh Lúc Vào',
      dataIndex: 'entry_image_url',
      key: 'entry_image_url',
      render: (url: string) => (
        url ? <Image width={80} src={url} alt="Entry" className="rounded border" /> : 'Không có ảnh'
      ),
    },
    {
      title: 'Giờ Ra',
      dataIndex: 'exit_time',
      key: 'exit_time',
      render: (time: string) => formatDateTime(time),
    },
    {
      title: 'Ảnh Lúc Ra',
      dataIndex: 'exit_image_url',
      key: 'exit_image_url',
      render: (url: string) => (
        url ? <Image width={80} src={url} alt="Exit" className="rounded border" /> : 'Chưa ra'
      ),
    },
  ];

  // Logic tìm kiếm cơ bản (Lọc theo biển số)
  const filteredSessions = sessions.filter(session => 
    session.plate_number.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} style={{ margin: 0 }}>Lịch sử xe ra vào</Title>
        <Input 
          placeholder="Nhập biển số để tìm..." 
          prefix={<SearchOutlined className="text-gray-400" />} 
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Card className="shadow-sm border-gray-200" bodyStyle={{ padding: 0 }}>
        <Table 
          columns={columns} 
          dataSource={filteredSessions} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default SessionsPage;