"use client";
import React, { useEffect, useState, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { Html5Qrcode } from 'html5-qrcode';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoMdQrScanner } from "react-icons/io";

interface DataRow {
  id: number;
  slot: string;
  scanComponentQr: string;
  result: string;
}

const initialData: DataRow[] = [
  { id: 1, slot: 'A1', scanComponentQr: '', result: 'match' },
  { id: 2, slot: 'B2', scanComponentQr: '', result: 'failed' },
  { id: 3, slot: 'C3', scanComponentQr: '', result: 'match' },
  { id: 4, slot: 'A2', scanComponentQr: '', result: 'failed' },
  { id: 5, slot: 'B3', scanComponentQr: '', result: 'match' },
  { id: 6, slot: 'C4', scanComponentQr: '', result: 'failed' },
  { id: 7, slot: 'A3', scanComponentQr: '', result: 'match' },
  { id: 8, slot: 'B4', scanComponentQr: '', result: 'match' },
  { id: 9, slot: 'C5', scanComponentQr: '', result: 'match' },
  { id: 10, slot: 'A4', scanComponentQr: '', result: 'match' },
  { id: 11, slot: 'B5', scanComponentQr: '', result: 'failed' },
  { id: 12, slot: 'C6', scanComponentQr: '', result: 'match' },
  { id: 13, slot: 'A5', scanComponentQr: '', result: 'failed' },
  { id: 14, slot: 'B6', scanComponentQr: '', result: 'match' },
  { id: 15, slot: 'C7', scanComponentQr: '', result: 'match' },
  { id: 16, slot: 'A6', scanComponentQr: '', result: 'failed' },
  { id: 17, slot: 'B7', scanComponentQr: '', result: 'match' },
  { id: 18, slot: 'C8', scanComponentQr: '', result: 'failed' },
  { id: 19, slot: 'A7', scanComponentQr: '', result: 'match' },
  { id: 20, slot: 'B8', scanComponentQr: '', result: 'match' },
];

function TableData() {
  // Data management
  const [sampleData, setSampleData] = useState<DataRow[]>(initialData);
  
  // Pagination config
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(Math.ceil(sampleData.length / itemsPerPage));
  const [visibleData, setVisibleData] = useState<DataRow[]>([]);

  // QR Scanner states
  const [showScanner, setShowScanner] = useState(false);
  const [scanningRowId, setScanningRowId] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader-modal';

  // Update visible data when page or data changes
  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    setVisibleData(sampleData.slice(start, end));
  }, [currentPage, sampleData]);

  // Update page count when data changes
  useEffect(() => {
    setPageCount(Math.ceil(sampleData.length / itemsPerPage));
  }, [sampleData]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  function handlePageClick(event: any) {
    setCurrentPage(event.selected);
  }

  // Open scanner modal for specific row
  const openScanner = (rowId: number) => {
    setScanningRowId(rowId);
    setShowScanner(true);
  };

  // Close scanner modal
  const closeScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
    setShowScanner(false);
    setScanningRowId(null);
  };

  // Start QR scanning
  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' }, // Camera sau
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Khi quét thành công
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Lỗi quét - có thể bỏ qua
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('Không thể khởi động camera:', err);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  // Handle successful scan
  const handleScanSuccess = (decodedText: string) => {
    if (scanningRowId === null) return;

    // Lấy 11 ký tự đầu tiên
    const extractedValue = decodedText.substring(0, 11);

    // Cập nhật data
    setSampleData(prevData =>
      prevData.map(row =>
        row.id === scanningRowId
          ? { ...row, scanComponentQr: extractedValue }
          : row
      )
    );

    // Đóng scanner sau khi quét thành công
    closeScanner();
  };

  // Clear QR code for specific row
  const clearQrCode = (rowId: number) => {
    setSampleData(prevData =>
      prevData.map(row =>
        row.id === rowId
          ? { ...row, scanComponentQr: '' }
          : row
      )
    );
  };

  // Handle modal show event - start scanner
  const handleModalShow = () => {
    // Đợi modal render xong rồi mới start scanner
    setTimeout(() => {
      startScanning();
    }, 100);
  };

  // Get result badge style
  const getResultBadge = (result: string) => {
    if (result === 'match') {
      return <span className="badge bg-success">Match</span>;
    } else if (result === 'failed') {
      return <span className="badge bg-danger">Failed</span>;
    }
    return <span className="badge bg-secondary">{result}</span>;
  };

  return (
    <>
      <Table striped bordered hover responsive="sm">
        <thead className="text-center">
          <tr>
            <th>Id</th>
            <th>Slot</th>
            <th>Scan Component QR</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {visibleData.map((row) => (
            <tr key={`row-${row.id}`}>
              <td>{row.id}</td>
              <td><strong>{row.slot}</strong></td>
              <td>
                {row.scanComponentQr ? (
                  <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 12px' }}>
                    {row.scanComponentQr}
                  </span>
                ) : (
                  <span className="text-muted">Not scanned</span>
                )}
              </td>
              <td>
                {getResultBadge(row.result)}
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openScanner(row.id)}
                  className="me-2"
                >
                  Scan <IoMdQrScanner />
                </Button>
                {row.scanComponentQr && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => clearQrCode(row.id)}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}

          {visibleData.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">No data</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          forcePage={currentPage}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>

      {/* QR Scanner Modal */}
      <Modal
        show={showScanner}
        onHide={closeScanner}
        onShow={handleModalShow}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Quét QR Code cho Slot: {sampleData.find(r => r.id === scanningRowId)?.slot}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div 
              id={qrCodeRegionId} 
              style={{ 
                width: '100%', 
                maxWidth: '500px', 
                margin: '0 auto' 
              }} 
            />
            <p className="mt-3 text-muted">
              Hướng camera vào mã QR để quét
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeScanner}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

        <div className='d-flex align-items-center justify-content-center'>
            <Button variant='info' className='active:opacity-70'>Send data</Button>
        </div>
      
    </>
  );
}

export default TableData;