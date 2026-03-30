import QRCode from 'qrcode';

export type QrFormat = 'svg' | 'png';

/**
 * Generate a QR code for the given URL.
 *
 * @param url - The URL to encode in the QR code.
 * @param format - Output format: 'svg' returns a string, 'png' returns a Buffer.
 * @param size - Width/height in pixels (for PNG). Defaults to 256.
 * @returns The QR code as an SVG string or PNG Buffer.
 */
export async function generateQR(
  url: string,
  format: QrFormat = 'svg',
  size: number = 256,
): Promise<string | Buffer> {
  if (format === 'svg') {
    return QRCode.toString(url, {
      type: 'svg',
      width: size,
      margin: 2,
    });
  }

  return QRCode.toBuffer(url, {
    type: 'png',
    width: size,
    margin: 2,
  });
}
