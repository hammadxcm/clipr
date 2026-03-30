import QRCode from 'qrcode';

export async function generateQRSvg(url: string): Promise<string> {
  return QRCode.toString(url, { type: 'svg', margin: 2, width: 200 });
}

export async function generateQRDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { margin: 2, width: 200 });
}
