let mevcutAşama = 1;
let toplameAşamaSayısı = 3;
let zamanSayacıları = {};
let güvenlikVerileri = {
	fareHareketleri: [],
	klavyeGirişleri: [],
	zamanDamgaları: [],
	tıklamaSayısı: 0,
};

// görsel test değişkenleri
let görselCanvas, görselCtx;
let hedefRenk,
	hedefŞekiller = [];
let bulunanŞekiller = [];

// matematik test değişkenleri
let matematikSorusu = {};

// dinamik test değişkenleri
let dinamikTestTipi = "";

// sistem başlatma
window.addEventListener("load", function () {
	// yükleme animasyonunu göster
	setTimeout(() => {
		document.getElementById("yukleyiciKonteyner").style.opacity = "0";
		setTimeout(() => {
			document.getElementById("yukleyiciKonteyner").style.display = "none";
			document.getElementById("mindlockKonteyner").classList.add("göster");
			sistemiBaslat();
		}, 500);
	}, 2000);
});

function sistemiBaslat() {
	güvenlikIzlemeyiBaşlat();

	görselTestiBaslat();

	olayDinleyicileriniEkle();
}

function güvenlikIzlemeyiBaşlat() {
	// fare hareketlerini izle
	document.addEventListener("mousemove", function (e) {
		güvenlikVerileri.fareHareketleri.push({
			x: e.clientX,
			y: e.clientY,
			zaman: Date.now(),
		});

		// fazla veri birikimini önle
		if (güvenlikVerileri.fareHareketleri.length > 100) {
			güvenlikVerileri.fareHareketleri.shift();
		}
	});

	// klavye girişlerini izle
	document.addEventListener("keydown", function (e) {
		güvenlikVerileri.klavyeGirişleri.push({
			tuş: e.key,
			zaman: Date.now(),
			süre: 0,
		});
	});

	// tıklama sayısını izle
	document.addEventListener("click", function () {
		güvenlikVerileri.tıklamaSayısı++;
		güvenlikVerileri.zamanDamgaları.push(Date.now());
	});
}

function görselTestiBaslat() {
	görselCanvas = document.getElementById("görselCanvas");
	görselCtx = görselCanvas.getContext("2d");

	// canvas boyutlarını ayarla
	const rect = görselCanvas.getBoundingClientRect();
	görselCanvas.width = rect.width;
	görselCanvas.height = rect.height;

	görselTestiYenile();
	zamanSayacısıBaslat("görsel", 30);
}

function görselTestiYenile() {
	// canvası temizle
	görselCtx.clearRect(0, 0, görselCanvas.width, görselCanvas.height);

	// rastgele hedef renk seç
	const renkler = [
		"#ff6b6b",
		"#4ecdc4",
		"#45b7d1",
		"#96ceb4",
		"#feca57",
		"#ff9ff3",
	];
	hedefRenk = renkler[Math.floor(Math.random() * renkler.length)];

	// şekilleri sıfırla
	hedefŞekiller = [];
	bulunanŞekiller = [];

	// rastgele şekiller çiz
	for (let i = 0; i < 15; i++) {
		const şekil = {
			x: Math.random() * (görselCanvas.width - 40) + 20,
			y: Math.random() * (görselCanvas.height - 40) + 20,
			genişlik: 20 + Math.random() * 20,
			yükseklik: 20 + Math.random() * 20,
			renk:
				i < 5 ? hedefRenk : renkler[Math.floor(Math.random() * renkler.length)],
			tip: Math.random() > 0.5 ? "daire" : "kare",
		};

		if (şekil.renk === hedefRenk) {
			hedefŞekiller.push(şekil);
		}

		çizŞekil(şekil);
	}

	// canvasa tıklama olayını ekle
	görselCanvas.onclick = function (e) {
		const rect = görselCanvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		tıklananŞekliKontrolEt(x, y);
	};
}

function çizŞekil(şekil) {
	görselCtx.fillStyle = şekil.renk;

	if (şekil.tip === "daire") {
		görselCtx.beginPath();
		görselCtx.arc(şekil.x, şekil.y, şekil.genişlik / 2, 0, 2 * Math.PI);
		görselCtx.fill();
	} else {
		görselCtx.fillRect(
			şekil.x - şekil.genişlik / 2,
			şekil.y - şekil.yükseklik / 2,
			şekil.genişlik,
			şekil.yükseklik
		);
	}
}

function tıklananŞekliKontrolEt(x, y) {
	for (let şekil of hedefŞekiller) {
		const mesafe = Math.sqrt(
			Math.pow(x - şekil.x, 2) + Math.pow(y - şekil.y, 2)
		);

		if (mesafe <= şekil.genişlik / 2 && !bulunanŞekiller.includes(şekil)) {
			bulunanŞekiller.push(şekil);

			// bulunan şekli işaretle
			görselCtx.strokeStyle = "#ffffff";
			görselCtx.lineWidth = 3;
			görselCtx.beginPath();
			görselCtx.arc(şekil.x, şekil.y, şekil.genişlik / 2 + 5, 0, 2 * Math.PI);
			görselCtx.stroke();

			break;
		}
	}

	// tüm hedef şekiller bulunduysa
	if (bulunanŞekiller.length === hedefŞekiller.length) {
		document.getElementById("görselDevam").disabled = false;
		zamanSayacısıDurdur("görsel");
	}
}

function matematikTestiBaslat() {
	matematikTestiYenile();
	zamanSayacısıBaslat("matematik", 20);

	// cevap girişini izle
	document.getElementById("matematikCevap").oninput = function () {
		const cevap = parseInt(this.value);
		if (cevap === matematikSorusu.doğruCevap) {
			document.getElementById("matematikDevam").disabled = false;
			zamanSayacısıDurdur("matematik");
		}
	};
}

function matematikTestiYenile() {
	// rastgele matematik sorusu oluştur
	const işlemler = ["+", "-", "*"];
	const işlem = işlemler[Math.floor(Math.random() * işlemler.length)];

	let sayı1, sayı2, sonuç;

	switch (işlem) {
		case "+":
			sayı1 = Math.floor(Math.random() * 50) + 1;
			sayı2 = Math.floor(Math.random() * 50) + 1;
			sonuç = sayı1 + sayı2;
			break;
		case "-":
			sayı1 = Math.floor(Math.random() * 50) + 25;
			sayı2 = Math.floor(Math.random() * 25) + 1;
			sonuç = sayı1 - sayı2;
			break;
		case "*":
			sayı1 = Math.floor(Math.random() * 12) + 1;
			sayı2 = Math.floor(Math.random() * 12) + 1;
			sonuç = sayı1 * sayı2;
			break;
	}

	matematikSorusu = {
		soru: `${sayı1} ${işlem} ${sayı2} = ?`,
		doğruCevap: sonuç,
	};

	document.getElementById("matematikSoru").textContent = matematikSorusu.soru;
	document.getElementById("matematikCevap").value = "";
	document.getElementById("matematikDevam").disabled = true;
}

function dinamikTestiBaslat() {
	// rastgele dinamik test türü seç
	const testTürleri = ["renkSırala", "kelimeSeç", "şekilEşleştir"];
	dinamikTestTipi = testTürleri[Math.floor(Math.random() * testTürleri.length)];

	dinamikTestiYenile();
	zamanSayacısıBaslat("dinamik", 25);
}

function dinamikTestiYenile() {
	const dinamikİçerik = document.getElementById("dinamikİçerik");

	switch (dinamikTestTipi) {
		case "renkSırala":
			renkSıralamaTestiniOluştur(dinamikİçerik);
			break;
		case "kelimeSeç":
			kelimeSeçmeTestiniOluştur(dinamikİçerik);
			break;
		case "şekilEşleştir":
			şekilEşleştirmeTestiniOluştur(dinamikİçerik);
			break;
	}
}

function renkSıralamaTestiniOluştur(konteyner) {
	konteyner.innerHTML = `
                <p style="margin-bottom: 15px;">Renkleri açık tondan koyu tona doğru sıralayın:</p>
                <div id="renkKutuları" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                </div>
            `;

	// rastgele renkler oluştur
	const temelRenk = Math.floor(Math.random() * 360);
	const renkler = [];

	for (let i = 0; i < 5; i++) {
		const açıklık = 30 + i * 15;
		renkler.push({
			renk: `hsl(${temelRenk}, 70%, ${açıklık}%)`,
			değer: açıklık,
			id: i,
		});
	}

	// renkleri karıştır
	const karışıkRenkler = [...renkler].sort(() => Math.random() - 0.5);

	const renkKutuları = document.getElementById("renkKutuları");
	karışıkRenkler.forEach((renk, index) => {
		const kutu = document.createElement("div");
		kutu.style.cssText = `
                    width: 50px;
                    height: 50px;
                    background: ${renk.renk};
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
		kutu.dataset.değer = renk.değer;
		kutu.dataset.sıra = "";

		kutu.onclick = function () {
			// sıralama mantığı
			const mevcutSıra = this.dataset.sıra;
			if (mevcutSıra) {
				this.dataset.sıra = "";
				this.style.border = "2px solid #ddd";
			} else {
				const sıradakiSayı =
					document.querySelectorAll('[data-sıra]:not([data-sıra=""])').length +
					1;
				this.dataset.sıra = sıradakiSayı;
				this.style.border = `3px solid #667eea`;
				this.innerHTML = `<div style="color: white; font-weight: bold; text-align: center; line-height: 46px;">${sıradakiSayı}</div>`;
			}

			renkSıralamasınıKontrolEt();
		};

		renkKutuları.appendChild(kutu);
	});
}

function renkSıralamasınıKontrolEt() {
	const kutular = document.querySelectorAll(
		'#renkKutuları div[data-sıra]:not([data-sıra=""])'
	);

	if (kutular.length === 5) {
		const sıralıDeğerler = Array.from(kutular)
			.sort((a, b) => parseInt(a.dataset.sıra) - parseInt(b.dataset.sıra))
			.map((kutu) => parseInt(kutu.dataset.değer));

		const doğruSıra = sıralıDeğerler.every(
			(değer, index) => index === 0 || değer >= sıralıDeğerler[index - 1]
		);

		if (doğruSıra) {
			document.getElementById("dinamikTamamla").disabled = false;
			zamanSayacısıDurdur("dinamik");
		}
	}
}

function kelimeSeçmeTestiniOluştur(konteyner) {
	const kelimeÇiftleri = [
		{ doğru: "güvenlik", yanlış: "güvenlilk" },
		{ doğru: "doğrulama", yanlış: "doğurulama" },
		{ doğru: "kimlik", yanlış: "kimllik" },
		{ doğru: "koruma", yanlış: "korama" },
		{ doğru: "sistem", yanlış: "sisterm" },
	];

	const seçilenÇift =
		kelimeÇiftleri[Math.floor(Math.random() * kelimeÇiftleri.length)];

	konteyner.innerHTML = `
                <p style="margin-bottom: 15px;">Doğru yazılan kelimeyi seçin:</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="kelime-seçenek mindlock-buton ikincil" data-doğru="true">${seçilenÇift.doğru}</button>
                    <button class="kelime-seçenek mindlock-buton ikincil" data-doğru="false">${seçilenÇift.yanlış}</button>
                </div>
            `;

	// seçenekleri karıştır
	const seçenekler = konteyner.querySelectorAll(".kelime-seçenek");
	if (Math.random() > 0.5) {
		const ilk = seçenekler[0];
		const ikinci = seçenekler[1];
		ilk.parentNode.insertBefore(ikinci, ilk);
	}

	seçenekler.forEach((seçenek) => {
		seçenek.onclick = function () {
			if (this.dataset.doğru === "true") {
				document.getElementById("dinamikTamamla").disabled = false;
				zamanSayacısıDurdur("dinamik");
				this.style.background = "#4caf50";
				this.style.color = "white";
			} else {
				this.style.background = "#f44336";
				this.style.color = "white";
				setTimeout(() => {
					dinamikTestiYenile();
				}, 1000);
			}
		};
	});
}

function şekilEşleştirmeTestiniOluştur(konteyner) {
	konteyner.innerHTML = `
                <p style="margin-bottom: 15px;">Aynı şekilleri eşleştirin:</p>
                <div id="şekilTablosu" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 300px; margin: 0 auto;">
                </div>
            `;

	// şekil çiftleri oluştur
	const şekiller = ["🔵", "🔴", "🟢", "🟡", "🟣", "🟠", "⚫", "⚪"];
	const seçilenŞekiller = şekiller.slice(0, 4);
	const tümŞekiller = [...seçilenŞekiller, ...seçilenŞekiller];

	// karıştır
	tümŞekiller.sort(() => Math.random() - 0.5);

	const şekilTablosu = document.getElementById("şekilTablosu");
	let açıkKartlar = [];
	let eşleşenÇiftler = 0;

	tümŞekiller.forEach((şekil, index) => {
		const kart = document.createElement("div");
		kart.style.cssText = `
                    width: 60px;
                    height: 60px;
                    background: #f0f0f0;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
		kart.dataset.şekil = şekil;
		kart.dataset.index = index;
		kart.textContent = "❓";

		kart.onclick = function () {
			if (açıkKartlar.length < 2 && !this.classList.contains("açık")) {
				this.textContent = şekil;
				this.style.background = "#e3f2fd";
				this.classList.add("açık");
				açıkKartlar.push(this);

				if (açıkKartlar.length === 2) {
					setTimeout(() => şekilEşleştirmesiniKontrolEt(), 500);
				}
			}
		};

		şekilTablosu.appendChild(kart);
	});

	function şekilEşleştirmesiniKontrolEt() {
		const [kart1, kart2] = açıkKartlar;

		if (kart1.dataset.şekil === kart2.dataset.şekil) {
			// eşleşme başarılı
			kart1.style.background = "#c8e6c9";
			kart2.style.background = "#c8e6c9";
			kart1.style.border = "2px solid #4caf50";
			kart2.style.border = "2px solid #4caf50";
			eşleşenÇiftler++;

			if (eşleşenÇiftler === 4) {
				document.getElementById("dinamikTamamla").disabled = false;
				zamanSayacısıDurdur("dinamik");
			}
		} else {
			// eşleşme başarısız
			kart1.textContent = "❓";
			kart2.textContent = "❓";
			kart1.style.background = "#f0f0f0";
			kart2.style.background = "#f0f0f0";
			kart1.classList.remove("açık");
			kart2.classList.remove("açık");
		}

		açıkKartlar = [];
	}
}

function zamanSayacısıBaslat(testTipi, başlangıçSüresi) {
	let kalanSüre = başlangıçSüresi;
	const zamanElementi = document.getElementById(testTipi + "Zaman");

	zamanSayacıları[testTipi] = setInterval(() => {
		kalanSüre--;
		zamanElementi.textContent = kalanSüre;

		if (kalanSüre <= 0) {
			zamanSayacısıDurdur(testTipi);
			zamanAştı();
		}
	}, 1000);
}

function zamanSayacısıDurdur(testTipi) {
	if (zamanSayacıları[testTipi]) {
		clearInterval(zamanSayacıları[testTipi]);
		delete zamanSayacıları[testTipi];
	}
}

function zamanAştı() {
	sonuçGöster("Süre doldu! Güvenlik doğrulama başarısız.", false);
}

function ilerlemeyiGüncelle() {
	const ilerlemeyüzdesi = (mevcutAşama / toplameAşamaSayısı) * 100;
	document.getElementById("ilerlemeCubuğu").style.width = ilerlemeyüzdesi + "%";
}

function sonrakiAşamayaGeç() {
	// mevcut aşamayı tamamlandı olarak işaretle
	const mevcutTest = document.querySelectorAll(".test-aşama")[mevcutAşama - 1];
	const mevcutDurum = mevcutTest.querySelector(".durum-ikonu");

	mevcutTest.classList.remove("aktif");
	mevcutTest.classList.add("tamamlandı");
	mevcutDurum.classList.remove("aktif");
	mevcutDurum.classList.add("tamamlandı");
	mevcutDurum.textContent = "✓";

	mevcutAşama++;
	ilerlemeyiGüncelle();

	if (mevcutAşama <= toplameAşamaSayısı) {
		// sonraki aşamayı aktifleştir
		const sonrakiTest =
			document.querySelectorAll(".test-aşama")[mevcutAşama - 1];
		const sonrakiDurum = sonrakiTest.querySelector(".durum-ikonu");

		sonrakiTest.classList.add("aktif");
		sonrakiDurum.classList.add("aktif");

		// sonraki teste göre işlem yap
		switch (mevcutAşama) {
			case 2:
				matematikTestiBaslat();
				break;
			case 3:
				dinamikTestiBaslat();
				break;
		}
	} else {
		// tüm testler tamamlandı
		güvenlikAnaliziYap();
	}
}

function güvenlikAnaliziYap() {
	// bot tespiti için güvenlik verilerini analiz et
	const fareHareketAnalizi = güvenlikVerileri.fareHareketleri.length > 10;
	const klavyeGirişAnalizi = güvenlikVerileri.klavyeGirişleri.length > 5;
	const tıklamaSıklığıAnalizi = güvenlikVerileri.tıklamaSayısı < 50; // çok fazla tıklama bot işareti
	const zamanAnlizi = güvenlikVerileri.zamanDamgaları.length > 0;

	// ortalama fare hızını hesapla
	let toplameHız = 0;
	for (let i = 1; i < güvenlikVerileri.fareHareketleri.length; i++) {
		const önceki = güvenlikVerileri.fareHareketleri[i - 1];
		const şuanki = güvenlikVerileri.fareHareketleri[i];

		const mesafe = Math.sqrt(
			Math.pow(şuanki.x - önceki.x, 2) + Math.pow(şuanki.y - önceki.y, 2)
		);
		const zaman = şuanki.zaman - önceki.zaman;
		const hız = mesafe / zaman;

		toplameHız += hız;
	}

	const ortalamaHız =
		toplameHız / (güvenlikVerileri.fareHareketleri.length - 1);
	const hızAnalizi = ortalamaHız > 0.1 && ortalamaHız < 5; // makul insan hızı aralığı

	// genel güvenlik puanı hesapla
	let güvenlikPuanı = 0;
	if (fareHareketAnalizi) güvenlikPuanı += 20;
	if (klavyeGirişAnalizi) güvenlikPuanı += 15;
	if (tıklamaSıklığıAnalizi) güvenlikPuanı += 25;
	if (zamanAnlizi) güvenlikPuanı += 20;
	if (hızAnalizi) güvenlikPuanı += 20;

	// sonucu göster
	const başarılı = güvenlikPuanı >= 60;
	const mesaj = başarılı
		? `Güvenlik doğrulama başarıyla tamamlandı! (Güvenlik Puanı: ${güvenlikPuanı}/100)`
		: `Güvenlik doğrulama başarısız. Bot aktivitesi tespit edildi. (Güvenlik Puanı: ${güvenlikPuanı}/100)`;

	sonuçGöster(mesaj, başarılı);
}

function sonuçGöster(mesaj, başarılı) {
	const sonuçAlanı = document.getElementById("sonuçAlanı");
	sonuçAlanı.innerHTML = `
                <div class="sonuç-mesaj ${başarılı ? "başarılı" : "başarısız"}">
                    ${mesaj}
                </div>
                ${
									başarılı
										? '<button class="mindlock-buton birincil" onclick="sayfayıYenile()" style="margin-top: 15px; width: 100%;">Yeni Doğrulama</button>'
										: '<button class="mindlock-buton ikincil" onclick="sayfayıYenile()" style="margin-top: 15px; width: 100%;">Tekrar Dene</button>'
								}
            `;

	// tüm aşamaları gizle
	document.querySelectorAll(".test-aşama").forEach((aşama) => {
		aşama.style.display = "none";
	});

	// ilerleme çubuğunu tamamla
	document.getElementById("ilerlemeCubuğu").style.width = "100%";
}

function sayfayıYenile() {
	location.reload();
}

function olayDinleyicileriniEkle() {
	// görsel test butonları
	document.getElementById("görselYenile").onclick = function () {
		görselTestiYenile();
		zamanSayacısıDurdur("görsel");
		zamanSayacısıBaslat("görsel", 30);
		document.getElementById("görselDevam").disabled = true;
	};

	document.getElementById("görselDevam").onclick = function () {
		zamanSayacısıDurdur("görsel");
		sonrakiAşamayaGeç();
	};

	// matematik test butonları
	document.getElementById("matematikYenile").onclick = function () {
		matematikTestiYenile();
		zamanSayacısıDurdur("matematik");
		zamanSayacısıBaslat("matematik", 20);
	};

	document.getElementById("matematikDevam").onclick = function () {
		zamanSayacısıDurdur("matematik");
		sonrakiAşamayaGeç();
	};

	// dinamik test butonları
	document.getElementById("dinamikYenile").onclick = function () {
		dinamikTestiYenile();
		zamanSayacısıDurdur("dinamik");
		zamanSayacısıBaslat("dinamik", 25);
		document.getElementById("dinamikTamamla").disabled = true;
	};

	document.getElementById("dinamikTamamla").onclick = function () {
		zamanSayacısıDurdur("dinamik");
		sonrakiAşamayaGeç();
	};

	// klavye kısayolları
	document.addEventListener("keydown", function (e) {
		// enter tuşu ile aktif butonu tetikle
		if (e.key === "Enter") {
			const aktifAşama = document.querySelector(".test-aşama.aktif");
			if (aktifAşama) {
				const aktifButon = aktifAşama.querySelector(
					".mindlock-buton.birincil:not(:disabled)"
				);
				if (aktifButon) {
					aktifButon.click();
				}
			}
		}

		// r tuşu ile yenile
		if (e.key === "r" || e.key === "R") {
			e.preventDefault();
			const aktifAşama = document.querySelector(".test-aşama.aktif");
			if (aktifAşama) {
				const yenileButonu = aktifAşama.querySelector(
					".mindlock-buton.ikincil"
				);
				if (yenileButonu) {
					yenileButonu.click();
				}
			}
		}
	});
}

// sayfa görünürlüğü değişikliklerini izle
document.addEventListener("visibilitychange", function () {
	if (document.visibilityState === "hidden") {
		güvenlikVerileri.zamanDamgaları.push({
			tip: "sayfa_gizli",
			zaman: Date.now(),
		});
	} else {
		güvenlikVerileri.zamanDamgaları.push({
			tip: "sayfa_görünür",
			zaman: Date.now(),
		});
	}
});

// konsol kullanımını tespit et
let konsolUyarısıGösterildi = false;
const özgünKonsol = console.log;
console.log = function () {
	if (!konsolUyarısıGösterildi) {
		güvenlikVerileri.zamanDamgaları.push({
			tip: "konsol_kullanımı",
			zaman: Date.now(),
		});
		konsolUyarısıGösterildi = true;
	}
	return özgünKonsol.apply(console, arguments);
};

// sağ tık engellemesi
document.addEventListener("contextmenu", function (e) {
	e.preventDefault();
	güvenlikVerileri.zamanDamgaları.push({
		tip: "sağ_tık_denemesi",
		zaman: Date.now(),
	});
});

// metin seçimini engelle
document.addEventListener("selectstart", function (e) {
	if (e.target.tagName !== "INPUT") {
		e.preventDefault();
	}
});

// kopyala-yapıştır engellemesi
document.addEventListener("keydown", function (e) {
	if (
		(e.ctrlKey || e.metaKey) &&
		(e.key === "c" || e.key === "v" || e.key === "x")
	) {
		e.preventDefault();
		güvenlikVerileri.zamanDamgaları.push({
			tip: "kopyala_yapıştır_denemesi",
			zaman: Date.now(),
		});
	}
});

// pencere boyutu değişikliklerini izle
window.addEventListener("resize", function () {
	güvenlikVerileri.zamanDamgaları.push({
		tip: "pencere_boyut_değişimi",
		zaman: Date.now(),
		boyut: { genişlik: window.innerWidth, yükseklik: window.innerHeight },
	});
});
