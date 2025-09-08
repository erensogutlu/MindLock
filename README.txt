/* MindLock */

MindLock, modern web teknolojileri kullanarak geliştirilmiş, çok katmanlı güvenlik testleri içeren yenilikçi bir CAPTCHA sistemidir. Geleneksel CAPTCHA sistemlerinin ötesinde, kullanıcı deneyimini koruyarak bot saldırılarına karşı maksimum koruma sağlar.

* Özellikler : 

 -> Çok Katmanlı Doğrulama
 -> Gelişmiş Bot Koruması
 -> Modern Kullanıcı Deneyimi
 -> Mobil Uyumlu Tasarım

* Kullanılan Teknolojiler :

   -> HTML / CSS
   -> JavaScript

* Geliştirici : Eren Söğütlü

** Kritik Güvenlik Açıkları : 

1. Client-Side Doğrulama
Tüm güvenlik kontrolleri JavaScript ile client-side yapıldığı için browser console üzerinden kolayca bypass edilebilir.

2. Öngörülebilir Rastgelelik
Math.random() kullanılarak üretilen test desenleri ve sorular, botlar tarafından öğrenilip otomatik çözülebilir.

3. Fare Hareket Simulasyonu
MouseEvent API kullanılarak realistic fare hareketleri simüle edilebilir ve güvenlik kontrollerini geçebilir.

4. Zaman Manipülasyonu
setInterval ve Date.now() fonksiyonları browser developer tools ile manipüle edilebilir veya override edilebilir.

5. Canvas OCR Saldırıları
Canvas'taki şekiller ve renkler Tesseract.js gibi OCR araçlarıyla otomatik olarak tanınıp çözülebilir.

6. Global State Değişkenleri
mevcutAşama, güvenlikPuanı gibi global değişkenler console üzerinden direkt değiştirilebilinir.

7. XSS Açıkları
innerHTML kullanımında input sanitization yapılmadığı için malicious script injection mümkün.

8. Session Yönetimi Eksikliği
Session token, rate limiting ve oturum süresi kontrolü olmadığı için aynı test defalarca kullanılabilir.

9. Network Traffic Analizi
Tüm veriler client-side işlendiği için network trafiği analiz edilerek test cevapları tahmin edilebilir.

10. Browser Automation
Selenium, Puppeteer gibi automation araçları ile tüm testler otomatik olarak çözülebilir.

11. JavaScript Devre Dışı Bırakma
JavaScript kapatılarak tüm güvenlik kontrolleri bypass edilebilir ve form doğrudan gönderilebilir.

12. Headless Browser Kullanımı
Headless Chrome/Firefox ile güvenlik kontrollerini geçerek otomatik test çözümü yapılabilir.


LİNK : https://erensogutlu-mindlock.netlify.app/

-----------------------------------------------------------------------------------------------------------------

/* MindLock */

MindLock is an innovative CAPTCHA system developed using modern web technologies and featuring multi-layered security tests. Beyond traditional CAPTCHA systems, it provides maximum protection against bot attacks by preserving the user experience.

* Features :

-> Multi-Layered Authentication
-> Advanced Bot Protection
-> Modern User Experience
-> Mobile-Friendly Design

* Technologies Used:

  -> HTML / CSS
  -> JavaScript

* Developer : Eren Söğütlü

** Critical Vulnerabilities :

1. Client-Side Validation
Since all security checks are performed client-side using JavaScript, they can be easily bypassed via the browser console.

2. Predictable Randomness
Test patterns and questions generated using Math.random() can be learned and automatically solved by bots.

3. Mouse Movement Simulation
Realistic mouse movements can be simulated using the MouseEvent API and bypass security checks.

4. Time Manipulation
The setInterval and Date.now() functions can be manipulated or overridden with browser developer tools.

5. Canvas OCR Attacks
Shapes and colors on Canvas can be automatically recognized and decoded with OCR tools like Tesseract.js.

6. Global State Variables
Global variables such as currentStage and securityScore can be modified directly from the console.

7. XSS Vulnerabilities
Malicious script injection is possible because there is no input sanitization when using innerHTML.

8. Lack of Session Management
The same test can be used repeatedly because there is no session token, rate limiting, or session duration control.

9. Network Traffic Analysis
Because all data is processed client-side, network traffic can be analyzed to predict test responses.

10. Browser Automation
All tests can be automatically decoded with automation tools like Selenium and Puppeteer.

11. Disabling JavaScript
By disabling JavaScript, all security checks can be bypassed and the form can be submitted directly.

12. Using a Headless Browser
With Headless Chrome/Firefox, you can bypass security checks and perform automated testing solutions.

LINK : https://erensogutlu-mindlock.netlify.app/
