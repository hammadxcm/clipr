import QRCode from 'qrcode';

export type QrFormat = 'svg' | 'png';

/**
 * Generate a QR code for the given text.
 * @param text - The content to encode (typically a URL).
 * @param format - Output format: 'svg' or 'png'.
 * @param size - Width/height in pixels (for PNG) or module count hint.
 * @returns The QR code as a string (SVG) or Buffer (PNG).
 */
export async function generateQr(
  text: string,
  format: QrFormat = 'svg',
  size: number = 256,
): Promise<{ data: string | Buffer; contentType: string }> {
  if (format === 'svg') {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: size,
      margin: 2,
    });
    return { data: svg, contentType: 'image/svg+xml' };
  }

  // PNG format
  const dataUrl = await QRCode.toDataURL(text, {
    width: size,
    margin: 2,
  });
  // Strip the data:image/png;base64, prefix and decode
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const buffer = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));
  return { data: buffer as unknown as Buffer, contentType: 'image/png' };
}
