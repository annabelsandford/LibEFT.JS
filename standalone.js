class EftDimensionsTableEntry {
    constructor(code, actual_size) {
        this.code = code;
        this.actual_size = actual_size;
    }
}

const image_size_table = [
    new EftDimensionsTableEntry(0x1, 512),
    new EftDimensionsTableEntry(0x2, 1024),
    new EftDimensionsTableEntry(0x3, 1536),
    new EftDimensionsTableEntry(0x4, 2048),
    new EftDimensionsTableEntry(0x5, 2560),
    new EftDimensionsTableEntry(0x6, 3072),
    new EftDimensionsTableEntry(0x7, 3584),
    new EftDimensionsTableEntry(0x8, 4096),
    new EftDimensionsTableEntry(0x9, 4608),
    new EftDimensionsTableEntry(0xA, 5120),
    new EftDimensionsTableEntry(0xB, 5632),
    new EftDimensionsTableEntry(0xC, 6144),
    new EftDimensionsTableEntry(0xD, 6656),
    new EftDimensionsTableEntry(0xE, 7168),
    new EftDimensionsTableEntry(0xF, 7680),
    new EftDimensionsTableEntry(0x10, 8192)
];

class Color {
    constructor() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
    }
}

function writeEftTiles(input, tileindexes, tilecount, width, height, use_bgra, swap_wh) {
    const output = Array.from({ length: width * height }, () => new Color());

    let blocknum = 0;
    const height_stride = swap_wh ? width : height;
    const width_stride = swap_wh ? height : width;

    for (let y = 0; y < height_stride / 512; y++) {
        for (let x = 0; x < width_stride / 512; x++) {
            for (let y_512 = 0; y_512 < 512; y_512++) {
                for (let x_512 = 0; x_512 < 512; x_512++) {
                    const x_offset_512 = (x_512 + 8) & 511;
                    const y_offset_512 = x_512 > 503 ? (y_512 + 4) & 511 : y_512;

                    const tile_address = blocknum;

                    if (use_bgra) {
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].b = input[tile_address][y_offset_512 * 512 + x_offset_512].b;  // r
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].g = input[tile_address][y_offset_512 * 512 + x_offset_512].g;  // g
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].r = input[tile_address][y_offset_512 * 512 + x_offset_512].r;  // b
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].a = input[tile_address][y_offset_512 * 512 + x_offset_512].a;  // a
                    } else {
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].r = input[tile_address][y_offset_512 * 512 + x_offset_512].r;  // r
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].g = input[tile_address][y_offset_512 * 512 + x_offset_512].g;  // g
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].b = input[tile_address][y_offset_512 * 512 + x_offset_512].b;  // b
                        output[(y_512 + y * 512) * width_stride + x * 512 + x_512].a = input[tile_address][y_offset_512 * 512 + x_offset_512].a;  // a
                    }
                }
            }

            blocknum++;
        }
    }

    return output;
}

function eft2rgba(input, tileindex, use_bgra) {
    let color0 = 0;  // color 0
    let color1 = 0;  // color 1
    let codes = 0;  // code stream to decode 4x4 block

    const rgba_buf = Array.from({ length: 512 * 512 }, () => new Color());

    const height_in_blocks = 512 / 4;
    const width_in_blocks = 512 / 4;

    for (let y = 0; y < height_in_blocks; y++) {
        for (let x = 0; x < width_in_blocks; x++) {
            color0 = (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8)] |
                (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 1] << 8));
            color1 = (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 2] |
                (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 3] << 8));

            //console.log(`Tile ${tileindex}, Block (${x}, ${y}), Color0: ${color0}, Color1: ${color1}`);

            codes = (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 4] |
                (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 5] << 8) |
                (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 6] << 16) |
                (input[(131072 * tileindex) + (y * 8 * width_in_blocks) + (x * 8) + 7] << 24));

            const reversed_codes = ((codes & 0xFF) << 24) |
                (((codes >> 8) & 0xFF) << 16) |
                (((codes >> 16) & 0xFF) << 8) |
                ((codes >> 24) & 0xFF);

            const color0_rgb = [
                ((color0 >> 11) & 0x1F) * 527 + 23 >> 6,
                ((color0 >> 5) & 0x3F) * 259 + 33 >> 6,
                (color0 & 0x1F) * 527 + 23 >> 6
            ];

            const color1_rgb = [
                ((color1 >> 11) & 0x1F) * 527 + 23 >> 6,
                ((color1 >> 5) & 0x3F) * 259 + 33 >> 6,
                (color1 & 0x1F) * 527 + 23 >> 6
            ];

            for (let yb = 0; yb < 4; yb++) {
                for (let xb = 0; xb < 4; xb++) {
                    const bitshift_amount_x = xb * 2;
                    const bitshift_amount_y = yb * 4 * 2;

                    if (color0 > color1) {
                        const code = (reversed_codes >> (bitshift_amount_x + bitshift_amount_y)) & 0x3;
                        let rgb_row;

                        if (code === 0x0) {
                            rgb_row = color0_rgb;
                        } else if (code === 0x1) {
                            rgb_row = color1_rgb;
                        } else if (code === 0x2) {
                            rgb_row = [
                                (2 * color0_rgb[0] + color1_rgb[0]) / 3,
                                (2 * color0_rgb[1] + color1_rgb[1]) / 3,
                                (2 * color0_rgb[2] + color1_rgb[2]) / 3
                            ];
                        } else if (code === 0x3) {
                            rgb_row = [
                                (color0_rgb[0] + 2 * color1_rgb[0]) / 3,
                                (color0_rgb[1] + 2 * color1_rgb[1]) / 3,
                                (color0_rgb[2] + 2 * color1_rgb[2]) / 3
                            ];
                        }

                        if (use_bgra) {
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].b = rgb_row[0];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].g = rgb_row[1];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].r = rgb_row[2];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].a = 255;
                        } else {
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].r = rgb_row[0];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].g = rgb_row[1];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].b = rgb_row[2];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].a = 255;
                        }
                    } else if (color0 <= color1) {
                        const code = (reversed_codes >> (bitshift_amount_x + bitshift_amount_y)) & 0x3;
                        let rgb_row;

                        if (code === 0x0) {
                            rgb_row = color0_rgb;
                        } else if (code === 0x1) {
                            rgb_row = color1_rgb;
                        } else if (code === 0x2) {
                            rgb_row = [
                                (color0_rgb[0] + color1_rgb[0]) / 2,
                                (color0_rgb[1] + color1_rgb[1]) / 2,
                                (color0_rgb[2] + color1_rgb[2]) / 2
                            ];
                        } else if (code === 0x3) {
                            rgb_row = [0, 0, 0];
                        }

                        if (use_bgra) {
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].b = rgb_row[0];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].g = rgb_row[1];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].r = rgb_row[2];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].a = 255;
                        } else {
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].r = rgb_row[0];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].g = rgb_row[1];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].b = rgb_row[2];
                            rgba_buf[(yb + y * 4) * 512 + 4 * x + xb].a = 255;
                        }
                    }
                }
            }
        }
    }

    return rgba_buf;
}

function getGarbageData(data, header_offset, tile_count, tile_entry_size) {
    const garbage_start = header_offset + tile_count * tile_entry_size;
    const garbage_data = data.slice(garbage_start);
    return garbage_data;
}

async function parseEftFile(file, use_bgra = false, swap_wh = false) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const eft_data = new Uint8Array(arrayBuffer);

    const eft_file = {
        magic: (
            BigInt(eft_data[0]) |
            (BigInt(eft_data[1]) << 8n) |
            (BigInt(eft_data[2]) << 16n) |
            (BigInt(eft_data[3]) << 24n) |
            (BigInt(eft_data[4]) << 32n) |
            (BigInt(eft_data[5]) << 40n) |
            (BigInt(eft_data[6]) << 48n) |
            (BigInt(eft_data[7]) << 56n)
        ),
        height: 0,
        width: 0,
        garbage: null,
        data: null
    };

    const dimensions_table_code = eft_data[8] | (eft_data[9] << 8);
    eft_file.height = image_size_table.find(entry => entry.code === dimensions_table_code).actual_size;
    eft_file.width = eft_file.height;  // Set width equal to height for square tiles
    eft_file.garbage = eft_data.slice(12, 16);
    eft_file.data = eft_data.slice(16);

    if (eft_file.magic !== BigInt("1103806595072")) {
        throw new Error("Invalid EFT file");
    }

    const tile_count = eft_file.data.length / 131072;

    const header_offset = 1024;
    const garbage_data = getGarbageData(eft_file.data, header_offset, tile_count, 131072);

    const rgba_buffer = Array.from({ length: tile_count }, (_, i) => eft2rgba(eft_file.data, i, use_bgra));

    const output_width = eft_file.width;
    const output_height = eft_file.height;

    console.log(`EFT file width: ${output_width}`);
    console.log(`EFT file height: ${output_height}`);
    console.log(`Tile count: ${tile_count}`);

    // Render output in the browser
    const canvas = document.createElement('canvas');
    canvas.width = output_width;
    canvas.height = output_height;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(output_width, output_height);

    const outputBuffer = writeEftTiles(rgba_buffer, null, tile_count, output_width, output_height, use_bgra, swap_wh);

    for (let i = 0; i < output_width * output_height; i++) {
        const pixelOffset = i * 4;
        const color = outputBuffer[i];
        imageData.data[pixelOffset] = color.r;
        imageData.data[pixelOffset + 1] = color.g;
        imageData.data[pixelOffset + 2] = color.b;
        imageData.data[pixelOffset + 3] = color.a;
    }

    ctx.putImageData(imageData, 0, 0);
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(new Error("Failed to read file as ArrayBuffer."));
        };

        reader.readAsArrayBuffer(file);
    });
}