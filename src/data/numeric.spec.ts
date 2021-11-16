import { readNumeric } from "./numeric";

// http://jabakobob.net/mdbviewer/mdbtools/samples.html
// https://sourceforge.net/p/mdbtools/mailman/mdbtools-dev/thread/loom.20110408T215525-601%40post.gmane.org/#msg27332696

describe("readNumeric", () => {
    test.each`
        buffer                                                                                                    | precision | scale | expectedResult
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa0, 0x86, 0x01, 0x00]} | ${8}      | ${5}  | ${"1.00000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa0, 0x86, 0x01, 0x00]} | ${9}      | ${5}  | ${"1.00000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa0, 0x86, 0x01, 0x00]} | ${10}     | ${5}  | ${"1.00000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${18}     | ${10} | ${"1.0000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${19}     | ${10} | ${"1.0000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]} | ${20}     | ${0}  | ${"1"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${20}     | ${10} | ${"1.0000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${28}     | ${10} | ${"1.0000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${28}     | ${28} | ${"0.0000000000000000000000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x27, 0x00, 0x00]} | ${8}      | ${5}  | ${"0.10000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x27, 0x00, 0x00]} | ${9}      | ${5}  | ${"0.10000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x27, 0x00, 0x00]} | ${10}     | ${5}  | ${"0.10000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${18}     | ${10} | ${"0.1000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${19}     | ${10} | ${"0.1000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${20}     | ${0}  | ${"0"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${20}     | ${10} | ${"0.1000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${28}     | ${10} | ${"0.1000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x3c, 0x2e, 0x3b, 0x03, 0x3c, 0x80, 0xd0, 0x9f, 0x00, 0x00, 0x00, 0xe8]} | ${28}     | ${28} | ${"0.1000000000000000000000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${8}      | ${5}  | ${"321.12345"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${9}      | ${5}  | ${"321.12345"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${10}     | ${5}  | ${"321.12345"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${18}     | ${10} | ${"321.1234500000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${19}     | ${10} | ${"321.1234500000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${20}     | ${0}  | ${"0"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${20}     | ${10} | ${"321.1234500000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${28}     | ${10} | ${"321.1234500000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${28}     | ${28} | ${"0.0000000000000000000000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${8}      | ${5}  | ${"321.12345"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0x82, 0xc1, 0x19]} | ${9}      | ${5}  | ${"4321.12345"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xd9, 0x74, 0xc7, 0x43]} | ${10}     | ${5}  | ${"54321.12345"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x68, 0x1b, 0x2a, 0x0c, 0xd2, 0xa6, 0xea, 0x0f]} | ${18}     | ${10} | ${"87654321.1234567890"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xb8, 0x87, 0x10, 0x89, 0xd2, 0xa6, 0x6e, 0xf2]} | ${19}     | ${10} | ${"987654321.1234567890"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0xe1, 0xc2, 0x10, 0x6a, 0xb1, 0x0c, 0xdf, 0xbc]} | ${20}     | ${0}  | ${"99876543210987654321"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0xe1, 0xc2, 0x10, 0x6a, 0xdb, 0xa6, 0x96, 0xcb]} | ${20}     | ${10} | ${"9987654321.1234567899"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x72, 0x98, 0x52, 0x1c, 0xcf, 0x87, 0xab, 0xd0, 0xd2, 0xa6, 0x7e, 0x60]} | ${28}     | ${10} | ${"876543210987654321.1234567890"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x35, 0xfd, 0x03, 0x91, 0x7a, 0x79, 0x6d, 0x4e, 0xf3, 0x38, 0xbe]} | ${28}     | ${28} | ${"0.1234567890123456789012345678"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa0, 0x86, 0x01, 0x00]} | ${8}      | ${5}  | ${"-1.00000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa0, 0x86, 0x01, 0x00]} | ${9}      | ${5}  | ${"-1.00000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa0, 0x86, 0x01, 0x00]} | ${10}     | ${5}  | ${"-1.00000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${18}     | ${10} | ${"-1.0000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${19}     | ${10} | ${"-1.0000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]} | ${20}     | ${0}  | ${"-1"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${20}     | ${10} | ${"-1.0000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0xe4, 0x0b, 0x54]} | ${28}     | ${10} | ${"-1.0000000000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${28}     | ${28} | ${"0.0000000000000000000000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x27, 0x00, 0x00]} | ${8}      | ${5}  | ${"-0.10000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x27, 0x00, 0x00]} | ${9}      | ${5}  | ${"-0.10000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x27, 0x00, 0x00]} | ${10}     | ${5}  | ${"-0.10000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${18}     | ${10} | ${"-0.1000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${19}     | ${10} | ${"-0.1000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${20}     | ${0}  | ${"-0"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${20}     | ${10} | ${"-0.1000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xca, 0x9a, 0x3b]} | ${28}     | ${10} | ${"-0.1000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x3c, 0x2e, 0x3b, 0x03, 0x3c, 0x80, 0xd0, 0x9f, 0x00, 0x00, 0x00, 0xe8]} | ${28}     | ${28} | ${"-0.1000000000000000000000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${8}      | ${5}  | ${"-321.12345"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${9}      | ${5}  | ${"-321.12345"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${10}     | ${5}  | ${"-321.12345"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${18}     | ${10} | ${"-321.1234500000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${19}     | ${10} | ${"-321.1234500000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${20}     | ${0}  | ${"-0"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${20}     | ${10} | ${"-321.1234500000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x02, 0x00, 0x00, 0xa0, 0xdd, 0x7d, 0xac]} | ${28}     | ${10} | ${"-321.1234500000"}
        ${[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]} | ${28}     | ${28} | ${"0.0000000000000000000000000000"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0xfe, 0xe9, 0x01]} | ${8}      | ${5}  | ${"-321.12345"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd9, 0x82, 0xc1, 0x19]} | ${9}      | ${5}  | ${"-4321.12345"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xd9, 0x74, 0xc7, 0x43]} | ${10}     | ${5}  | ${"-54321.12345"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x68, 0x1b, 0x2a, 0x0c, 0xd2, 0xa6, 0xea, 0x0f]} | ${18}     | ${10} | ${"-87654321.1234567890"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xb8, 0x87, 0x10, 0x89, 0xd2, 0xa6, 0x6e, 0xf2]} | ${19}     | ${10} | ${"-987654321.1234567890"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0xe1, 0xc2, 0x10, 0x6a, 0xb1, 0x0c, 0xdf, 0xbc]} | ${20}     | ${0}  | ${"-99876543210987654321"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0xe1, 0xc2, 0x10, 0x6a, 0xdb, 0xa6, 0x96, 0xcb]} | ${20}     | ${10} | ${"-9987654321.1234567899"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0x72, 0x98, 0x52, 0x1c, 0xcf, 0x87, 0xab, 0xd0, 0xd2, 0xa6, 0x7e, 0x60]} | ${28}     | ${10} | ${"-876543210987654321.1234567890"}
        ${[0x80, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x35, 0xfd, 0x03, 0x91, 0x7a, 0x79, 0x6d, 0x4e, 0xf3, 0x38, 0xbe]} | ${28}     | ${28} | ${"-0.1234567890123456789012345678"}
    `("reads numeric value: scale=$scale, precision=$precision", ({ buffer, scale, precision, expectedResult }) => {
        const result = readNumeric(Buffer.from(buffer), { scale, precision });
        expect(result).toBe(expectedResult);

        const actualScale = (result.split(".")[1] ?? "").length;
        expect(actualScale).toBe(scale);
    });
});
