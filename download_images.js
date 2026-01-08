const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const images = [
    { url: "https://mannol.de/imgbank/Image/public/images/bilder_chemie/big/10W-40_Classic_4L.jpg", name: "mannol_classic.jpg" },
    { url: "https://m.media-amazon.com/images/I/71F7XY8pC5L._AC_SL1500_.jpg", name: "mobil1_fs.jpg" },
    { url: "https://m.media-amazon.com/images/I/61M6+yFwJEL._AC_SL1000_.jpg", name: "total_quartz.jpg" },
    { url: "https://zicoil.ru/upload/iblock/d7e/d7e63864a7c06c046e0366c07e05f639.jpg", name: "zic_x7.jpg" },
    { url: "https://kixxoil.com/img/product/en/kixx_g1.png", name: "kixx_g1.png" },
    { url: "https://az726058.vo.msecnd.net/media/31666/motul-8100-x-cess-5w40-5l.jpg", name: "motul_8100.jpg" },
    { url: "https://www.elf.com/sites/g/files/wompnd2466/f/atoms/images/elf_evolution_700_sti_10w-40_1l_0.png", name: "elf_evolution.png" },
    { url: "https://msdspds.castrol.com/bpglis/FusionPDS.nsf/Files/BPXP-8C4S4Z/$File/BPXP-8C4S4Z_0.jpg", name: "castrol_edge.jpg" },
    { url: "https://new.g-energy.org/ru/products/car-oils/f-synth-5w-40/image.jpg", name: "g_energy.jpg" },
    { url: "https://mannol.de/imgbank/Image/public/images/bilder_chemie/big/5W-40_Elite_4L.jpg", name: "mannol_elite.jpg" }
];

const download = (url, dest) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, function (response) {
        if (response.statusCode !== 200) {
            console.error(`Failed to download ${url}: Status Code ${response.statusCode}`);
            return;
        }
        response.pipe(file);
        file.on('finish', function () {
            file.close(() => console.log('Downloaded ' + dest));
        });
    }).on('error', function (err) {
        fs.unlink(dest, () => { }); // Delete the file async
        console.error('Error downloading ' + url + ': ' + err.message);
    });
};

if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
}

images.forEach(img => {
    download(img.url, path.join('public/images', img.name));
});
