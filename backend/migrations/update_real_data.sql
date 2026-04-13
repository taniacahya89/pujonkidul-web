-- Update data real semua destinasi (koordinat, jam buka, tiket, parkir, alamat)
UPDATE destinations SET
  latitude=-7.854675, longitude=112.453564,
  opening_hours='Setiap hari 08.00-18.00',
  ticket_price=10000,
  address='Kawasan Cafe Sawah, Desa Wisata, Krajan, Pujon Kidul, Kec. Pujon, Kabupaten Malang',
  parking_info='Motor: Rp 5.000 | Mobil: Rp 10.000',
  vehicle_access='Motor, Mobil',
  best_time='Pagi hari (08.00-10.00) atau sore hari (15.00-17.00)',
  short_description='Kafe unik di tengah hamparan sawah hijau dengan pemandangan pegunungan Pujon yang memukau.',
  full_description='Cafe Sawah Pujon Kidul adalah destinasi wisata kuliner ikonik yang menawarkan pengalaman makan di tengah sawah yang hijau. Pengunjung dapat menikmati berbagai menu makanan dan minuman tradisional sambil menikmati pemandangan alam pegunungan Malang yang indah. Tersedia berbagai spot foto instagramable di area persawahan yang luas.'
WHERE name='Cafe Sawah';

UPDATE destinations SET
  latitude=-7.870384, longitude=112.481554,
  opening_hours='Setiap hari 08.00-17.00',
  ticket_price=35000,
  address='Jl. Coban Rondo No.30, Krajan, Pandesari, Kec. Pujon, Kabupaten Malang, Jawa Timur 65391',
  parking_info='Motor: Rp 5.000 | Mobil: Rp 10.000 | Bus: Rp 15.000',
  vehicle_access='Motor, Mobil, Bus',
  best_time='Pagi hari (08.00-11.00) untuk menghindari keramaian',
  short_description='Air terjun legendaris dengan ketinggian 84 meter dikelilingi hutan pinus yang sejuk dan asri.',
  full_description='Coban Rondo adalah air terjun ikonik di kawasan Pujon dengan ketinggian sekitar 84 meter. Dikelilingi hutan pinus yang lebat dan udara sejuk pegunungan, destinasi ini menjadi favorit wisatawan dari berbagai daerah. Tersedia area piknik, flying fox, dan berbagai wahana seru di sekitar kawasan air terjun. Harga tiket: Weekday Rp 35.000, Weekend Rp 40.000.'
WHERE name='Coban Rondo';

UPDATE destinations SET
  latitude=-7.861742, longitude=112.459931,
  opening_hours='Setiap hari 08.00-17.00',
  ticket_price=10000,
  address='Tulungrejo, Pujon Kidul, Kec. Pujon, Kabupaten Malang, Jawa Timur 65391',
  parking_info='Motor: Rp 5.000 | Mobil: Rp 10.000',
  vehicle_access='Motor, Mobil',
  best_time='Pagi hari untuk sunrise atau sore hari untuk sunset',
  short_description='Bukit dengan panorama alam Pujon Kidul yang memukau, cocok untuk trekking dan foto sunrise.',
  full_description='Bukit Nirwana menawarkan pemandangan alam Pujon Kidul yang spektakuler dari ketinggian. Pengunjung dapat menikmati hamparan sawah, kebun teh, dan siluet pegunungan yang memukau. Jalur trekking yang tidak terlalu berat menjadikannya cocok untuk semua kalangan. Spot terbaik untuk foto sunrise dan sunset.'
WHERE name='Bukit Nirwana';

UPDATE destinations SET
  latitude=-7.870446, longitude=112.486736,
  opening_hours='24 Jam (check-in 14.00, check-out 12.00)',
  ticket_price=35000,
  address='Jl. Coban Rondo, Jurangrejo, Pandesari, Kec. Pujon, Kabupaten Malang, Jawa Timur 65391',
  parking_info='Motor: Rp 5.000 | Mobil: Rp 10.000',
  vehicle_access='Motor, Mobil',
  best_time='Sepanjang tahun, terutama musim kemarau (April-Oktober)',
  short_description='Glamping premium di tengah hutan pinus dengan fasilitas modern dan pemandangan alam yang menakjubkan.',
  full_description='Bobocabin Coban Rondo menghadirkan pengalaman glamping premium di tengah hutan pinus kawasan Coban Rondo. Setiap kabin dilengkapi fasilitas modern seperti AC, kamar mandi dalam, dan tempat tidur nyaman. Harga tiket: Weekday Rp 35.000, Weekend Rp 40.000.'
WHERE name='Bobocabin Coban Rondo';

UPDATE destinations SET
  latitude=-7.851621, longitude=112.493442,
  opening_hours='Setiap hari 08.00-17.00',
  ticket_price=20000,
  address='Samaan Klojen, Jurangrejo, Pandesari, Kec. Pujon, Kabupaten Malang, Jawa Timur 65112',
  parking_info='Motor: Rp 5.000 | Mobil: Rp 10.000',
  vehicle_access='Motor, Mobil',
  best_time='Pagi hingga siang hari, cocok untuk anak-anak',
  short_description='Taman wisata keluarga dengan ratusan kelinci lucu yang bisa diajak berinteraksi langsung.',
  full_description='Kelinci Park Pujon adalah destinasi wisata keluarga yang menyenangkan dengan ratusan kelinci berbagai ras yang bisa diajak berinteraksi langsung. Harga tiket: Dewasa Rp 20.000, Anak-anak Rp 10.000.'
WHERE name='Kelinci Park';

UPDATE destinations SET
  latitude=-7.854431, longitude=112.485499,
  opening_hours='Setiap hari 08.00-17.00',
  ticket_price=30000,
  address='Jl. Truno Joyo, Jurangrejo, Pandesari, Kec. Pujon, Kabupaten Malang, Jawa Timur 65391',
  parking_info='Motor: Rp 5.000 | Mobil: Rp 10.000 | Bus: Rp 15.000',
  vehicle_access='Motor, Mobil, Bus',
  best_time='Pagi hari (08.00-11.00) saat bunga mekar sempurna',
  short_description='Taman bunga Eropa di Malang dengan ribuan bunga berwarna-warni dan spot foto instagramable.',
  full_description='Florawisata Santerra De Laponte adalah taman bunga bergaya Eropa yang memukau di kawasan Pujon. Ribuan bunga berwarna-warni ditata dengan indah menciptakan pemandangan yang memesona. Harga tiket: Reguler Weekday Rp 30.000, Reguler Weekend Rp 35.000, Terusan Weekday Rp 70.000, Terusan Weekend Rp 85.000.'
WHERE name='Florawisata Santerra De Laponte';

-- Update image_url ke local path
UPDATE destination_details SET image_url='/images/cafesawah_img.jpg'
  WHERE destination_id=(SELECT id FROM destinations WHERE name='Cafe Sawah');
UPDATE destination_details SET image_url='/images/cobanrondo_img.jpg'
  WHERE destination_id=(SELECT id FROM destinations WHERE name='Coban Rondo');
UPDATE destination_details SET image_url='/images/nirwana_img.jpg'
  WHERE destination_id=(SELECT id FROM destinations WHERE name='Bukit Nirwana');
UPDATE destination_details SET image_url='/images/bobocabin_img.jpg'
  WHERE destination_id=(SELECT id FROM destinations WHERE name='Bobocabin Coban Rondo');
UPDATE destination_details SET image_url='/images/kelincipark_img.jpg'
  WHERE destination_id=(SELECT id FROM destinations WHERE name='Kelinci Park');
UPDATE destination_details SET image_url='/images/santerra_img.jpg'
  WHERE destination_id=(SELECT id FROM destinations WHERE name='Florawisata Santerra De Laponte');

SELECT d.name, d.opening_hours, d.ticket_price, d.latitude, d.longitude, dd.image_url
FROM destinations d JOIN destination_details dd ON d.id=dd.destination_id ORDER BY d.id;
