import { NextRequest, NextResponse } from "next/server";
import { deflateSync } from "zlib";

export const runtime = "nodejs";

function u32be(n: number): Buffer {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const t = Buffer.from(type, "ascii");
  return Buffer.concat([u32be(data.length), t, data, u32be(crc32(Buffer.concat([t, data])))]);
}

function makeMaskPng(w: number, h: number): Buffer {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = pngChunk("IHDR", Buffer.concat([u32be(w), u32be(h), Buffer.from([8, 0, 0, 0, 0])]));

  // 0-55% black (ceiling/walls), 55-80% white (furniture zone), 80-100% black (floor)
  const rows: Buffer[] = [];
  for (let y = 0; y < h; y++) {
    const frac = y / h;
    const pixel = frac < 0.55 ? 0 : frac < 0.80 ? 255 : 0;
    const row = Buffer.allocUnsafe(1 + w);
    row[0] = 0;
    row.fill(pixel, 1);
    rows.push(row);
  }

  const idat = pngChunk("IDAT", deflateSync(Buffer.concat(rows), { level: 6 }));
  const iend = pngChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

export async function GET(req: NextRequest) {
  const p = new URL(req.url).searchParams;
  // No cap — caller is responsible for reasonable dimensions
  const w = Math.max(64, parseInt(p.get("w") ?? "1024") || 1024);
  const h = Math.max(64, parseInt(p.get("h") ?? "1024") || 1024);
  return new NextResponse(new Uint8Array(makeMaskPng(w, h)), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
  });
}
